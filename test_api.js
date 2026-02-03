const http = require('http');

function postRequest(data) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/submit',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });

        req.on('error', (error) => reject(error));
        req.write(data);
        req.end();
    });
}

function getRequest() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admissions',
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });

        req.on('error', (error) => reject(error));
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting API Verification ---');

    // Test Data
    const applicant = JSON.stringify({
        full_name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        dob: "2000-01-01",
        gender: "male",
        address: "Test Address",
        course: "cs",
        gpa: 4.0,
        high_school: "Test High"
    });

    try {
        // 1. Submit Form
        console.log('1. Testing Form Submission...');
        const submitResponse = await postRequest(applicant);
        console.log('   Response:', submitResponse);

        if (submitResponse.message === 'Application submitted successfully!') {
            console.log('   [PASS] Submission Successful');
        } else {
            console.error('   [FAIL] Submission Failed');
        }

        // 2. View Admissions
        console.log('\n2. Testing Admin View...');
        const adminResponse = await getRequest();
        console.log(`   Found ${adminResponse.data.length} applications.`);

        const found = adminResponse.data.find(d => d.email === "test@example.com");
        if (found) {
            console.log('   [PASS] Data Persistence Verified (Found submitted user)');
        } else {
            console.error('   [FAIL] Data Persistence Failed (User not found)');
        }

    } catch (error) {
        console.error('An error occurred during testing:', error);
    }
}

// Wait for server to start, then run tests
setTimeout(runTests, 2000);
