
// Native fetch

async function run() {
    try {
        const res = await fetch('http://localhost:3002/api/banners');
        console.log('Status:', res.status);

        if (res.ok) {
            const data = await res.json();
            console.log('Count:', data.length);
            console.log('IDs:', data.map(b => b.id || b._id));

            const targetId = '6967354c71aee002ad15a9a0';
            const found = data.find(b => (b.id === targetId || b._id === targetId));

            if (found) {
                console.log('FOUND TARGET RECORD:', JSON.stringify(found, null, 2));
            } else {
                console.log('TARGET RECORD NOT FOUND IN API RESPONSE');
            }
        } else {
            const txt = await res.text();
            console.log('Body:', txt);
        }
    } catch (e) {
        console.error(e);
    }
}
run();
