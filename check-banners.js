// No require needed for Node 18+
async function check() {
    try {
        const res = await fetch('http://localhost:3001/api/banners');
        if (res.ok) {
            const data = await res.json();
            console.log('✅ Backend Banners Endpoint UP. Count:', data.length);
        } else {
            console.log('❌ Backend returned error:', res.status);
        }
    } catch (err) {
        console.error('❌ Could not connect to backend:', err.message);
    }
}

check();
