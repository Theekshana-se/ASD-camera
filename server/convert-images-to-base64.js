const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function convertFilePathsToBase64() {
    try {
        console.log('🔄 Converting file-based images to base64...\n');

        // Get all slider items
        const slides = await prisma.sliderItem.findMany();

        let converted = 0;
        let skipped = 0;
        let errors = 0;

        for (const slide of slides) {
            // Check if imageUrl is a file path (not base64 or external URL)
            if (slide.imageUrl && slide.imageUrl.startsWith('/slider/')) {
                try {
                    const filePath = path.join(__dirname, '..', 'public', slide.imageUrl);

                    // Check if file exists
                    if (fs.existsSync(filePath)) {
                        // Read file and convert to base64
                        const fileBuffer = fs.readFileSync(filePath);
                        const mimeType = getMimeType(filePath);
                        const base64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

                        // Update database
                        await prisma.sliderItem.update({
                            where: { id: slide.id },
                            data: { imageUrl: base64 },
                        });

                        console.log(`✅ Converted: "${slide.title}"`);
                        console.log(`   From: ${slide.imageUrl}`);
                        console.log(`   To: data:${mimeType};base64,...\n`);
                        converted++;
                    } else {
                        console.log(`⚠️  File not found: ${slide.imageUrl} for "${slide.title}"`);
                        errors++;
                    }
                } catch (error) {
                    console.error(`❌ Error converting "${slide.title}":`, error.message);
                    errors++;
                }
            } else if (slide.imageUrl && slide.imageUrl.startsWith('data:image/')) {
                console.log(`⏭️  Already base64: "${slide.title}"`);
                skipped++;
            } else {
                console.log(`⏭️  External URL: "${slide.title}"`);
                skipped++;
            }
        }

        console.log('\n📊 Summary:');
        console.log('═'.repeat(50));
        console.log(`✅ Converted: ${converted}`);
        console.log(`⏭️  Skipped: ${skipped}`);
        console.log(`❌ Errors: ${errors}`);
        console.log('═'.repeat(50));

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
    };
    return mimeTypes[ext] || 'image/jpeg';
}

convertFilePathsToBase64()
    .then(() => {
        console.log('\n✨ Conversion completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Conversion failed:', error);
        process.exit(1);
    });
