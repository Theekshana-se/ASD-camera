
// Native fetch
async function run() {
    try {
        const res = await fetch('http://localhost:3002/api/banners');
        if (res.ok) {
            const data = await res.json();
            const targetId = '6967354c71aee002ad15a9a0';
            const found = data.find(b => b.id === targetId || b._id === targetId);

            console.log('Total Items:', data.length);
            if (found) {
                console.log('MATCH FOUND!');
                console.log('Title:', found.title);
                console.log('Active:', found.active);
            } else {
                console.log('MATCH NOT FOUND');
                console.log('First 5 IDs:', data.slice(0, 5).map(b => b.id));
            }
        } else {
            console.log('Error:', res.status);
        }
    } catch (e) {
        console.error(e);
    }
}
run();
