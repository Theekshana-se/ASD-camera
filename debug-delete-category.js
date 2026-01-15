// using native fetch

// Node 18+ has native fetch. If on older node and no node-fetch, this might fail, but let's assume valid environment.
// If it fails, I'll use http module.

const API_URL = 'http://localhost:3002/api/categories';

async function testCategoryFlow() {
    try {
        console.log('1. Creating test category...');
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Delete Category' })
        });

        if (!createRes.ok) {
            const err = await createRes.text();
            console.error('Failed to create category:', createRes.status, err);
            return;
        }

        const category = await createRes.json();
        console.log('Category created:', category);
        const id = category.id;

        console.log(`2. Deleting category ${id}...`);
        const deleteRes = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (deleteRes.status === 204) {
            console.log('Category deleted successfully (204 OK)');
        } else {
            const err = await deleteRes.text();
            console.error('Failed to delete category:', deleteRes.status, err);
        }

    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

testCategoryFlow();
