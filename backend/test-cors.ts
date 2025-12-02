import fetch from 'node-fetch';

async function testBackend() {
    const url = 'http://localhost:5000/health';
    const origin = 'http://localhost:8081';

    console.log(`Testing connection to ${url}...`);
    console.log(`Simulating Origin: ${origin}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Origin': origin
            }
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log('CORS Headers:');
        console.log(`Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
        console.log(`Access-Control-Allow-Credentials: ${response.headers.get('access-control-allow-credentials')}`);

        if (response.ok) {
            console.log('✅ Backend is reachable.');
            if (response.headers.get('access-control-allow-origin') === origin) {
                console.log('✅ CORS is correctly configured for this origin.');
            } else {
                console.log('❌ CORS header mismatch or missing.');
            }
        } else {
            console.log('❌ Backend returned an error.');
        }

    } catch (error) {
        console.error('❌ Failed to connect to backend:', error);
        console.log('Possible causes: Backend not running, wrong port, or firewall blocking.');
    }
}

testBackend();
