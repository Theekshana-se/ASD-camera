// Native fetch is used (Node v18+)

const API_URL = 'http://localhost:3002/api/banners';

async function verify() {
    console.log("🚀 Starting Promotion Verification...");

    // 1. Create a Test Promotion
    const testPromo = {
        imageUrl: "https://via.placeholder.com/500",
        title: "TEST_PROMOTION_VERIFICATION",
        position: "promotion",
        active: true,
        order: 999
    };

    let newId = null;

    try {
        console.log("1️⃣  Attempting to CREATE promotion...");
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPromo)
        });

        if (!createRes.ok) {
            throw new Error(`Failed to create: ${createRes.status} ${createRes.statusText}`);
        }

        const createdData = await createRes.json();
        console.log("✅ Created successfully:", createdData);
        newId = createdData.id;

        if (!newId) throw new Error("No ID returned from creation!");

        console.log("   Waiting 2 seconds before fetching...");
        await new Promise(r => setTimeout(r, 2000));

        // 2. Fetch All Promotions to Verify It Exists in DB
        console.log("\n2️⃣  Attempting to FETCH all promotions...");
        const listRes = await fetch(API_URL);
        const listData = await listRes.json();

        // console.log("DEBUG: listData received:", JSON.stringify(listData).substring(0, 200)); 

        if (!Array.isArray(listData)) {
            throw new Error("API did not return an array! Got: " + JSON.stringify(listData));
        }

        const found = listData.find(item => item.id === newId);

        if (found) {
            console.log("✅ Verification SUCCESS! Found the new promotion in the database list.");
            console.log("   - ID:", found.id);
            console.log("   - Title:", found.title);
            console.log("   - Position:", found.position);
        } else {
            console.error("❌ Verification FAILED! Created items was NOT found in the list.");
        }

    } catch (error) {
        console.error("❌ Error during verification:", error.message);
    } finally {
        // 3. Clean up (Delete the test item)
        if (newId) {
            console.log("\n3️⃣  Cleaning up (Deleting test item)...");
            try {
                const deleteRes = await fetch(`${API_URL}/${newId}`, { method: 'DELETE' });

                if (deleteRes.ok) {
                    console.log("✅ Cleanup successful. Test item deleted.");
                } else {
                    console.warn("⚠️ Cleanup failed. You might need to delete ID manually:", newId);
                }
            } catch (e) { console.error("Error deleting:", e); }
        }
    }
}

verify();
