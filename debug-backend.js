
async function check() {
    try {
        const res = await fetch('http://localhost:3002/api/banners');
        const json = await res.json();
        console.log('MSG:', json.message);
        if (json.details) console.log('DTL:', JSON.stringify(json.details));
    } catch (e) {
        console.error(e);
    }
}
check();
