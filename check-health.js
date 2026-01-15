const fetch = require('node-fetch'); // or native fetch if node 18+

async function check() {
    try {
        const res = await fetch('http://localhost:3001/health');
        if (res.ok) {
            const data = await res.json();
            console.log('✅ Backend is UP:', data);
        } else {
            console.log('❌ Backend returned error:', res.status);
        }
    } catch (err) {
        console.error('❌ Could not connect to backend:', err.message);
    }
}

check();
