// const fetch = require('node-fetch'); // Use native fetch

async function checkProducts() {
    try {
        const baseUrl = 'http://localhost:3002/api/products';

        // Check all products
        console.log('Fetching all products...');
        const all = await fetch(baseUrl);
        const allData = await all.json();
        console.log(`Total products: ${Array.isArray(allData) ? allData.length : 'Not an array'}`);

        // Check featured
        console.log('\nFetching featured products (raw brackets)...');
        const featured = await fetch(`${baseUrl}?filters[isFeatured][$equals]=true`);
        const featuredData = await featured.json();
        console.log(`Featured products: ${Array.isArray(featuredData) ? featuredData.length : 'Not an array'}`);

        // Check featured (encoded)
        console.log('\nFetching featured products (encoded)...');
        const encodedUrl = `${baseUrl}?filters%5BisFeatured%5D%5B%24equals%5D=true`;
        console.log(`URL: ${encodedUrl}`);
        const featuredEnc = await fetch(encodedUrl);
        const featuredEncData = await featuredEnc.json();
        console.log(`Featured products (encoded): ${Array.isArray(featuredEncData) ? featuredEncData.length : 'Not an array' + JSON.stringify(featuredEncData)}`);


        // Check hot deals
        console.log('\nFetching hot deals...');
        const hotDeals = await fetch(`${baseUrl}?filters[isHotDeal][$equals]=true`);
        const hotDealsData = await hotDeals.json();
        console.log(`Hot deals products: ${Array.isArray(hotDealsData) ? hotDealsData.length : 'Not an array'}`);

    } catch (error) {
        console.error('Error fetching products:', error.message);
        if (error.cause) console.error(error.cause);
    }
}

checkProducts();
