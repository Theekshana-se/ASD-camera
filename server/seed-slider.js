const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Attractive slider images as base64 (small placeholder images)
const sliderData = [
    {
        title: "Premium Camera Equipment",
        subtitle: "2026 Collection",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1f2e;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ff1f1f;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23grad1)'/%3E%3Ctext x='50%25' y='45%25' font-family='Arial, sans-serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3EPremium Camera%3C/text%3E%3Ctext x='50%25' y='55%25' font-family='Arial, sans-serif' font-size='40' fill='rgba(255,255,255,0.8)' text-anchor='middle'%3EEquipment%3C/text%3E%3C/svg%3E",
        ctaText: "Explore Equipment",
        ctaHref: "/shop",
        order: 0,
        active: true,
    },
    {
        title: "Professional Lenses",
        subtitle: "Crystal Clear Quality",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232d3748;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234299e1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23grad2)'/%3E%3Ccircle cx='600' cy='300' r='150' fill='rgba(255,255,255,0.1)' stroke='white' stroke-width='4'/%3E%3Ctext x='50%25' y='60%25' font-family='Arial, sans-serif' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3EProfessional Lenses%3C/text%3E%3C/svg%3E",
        ctaText: "Browse Lenses",
        ctaHref: "/shop",
        order: 1,
        active: true,
    },
    {
        title: "Studio Lighting",
        subtitle: "Perfect Illumination",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23744210;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f6ad55;stop-opacity:1' /%3E%3C/linearGradient%3E%3CradialGradient id='light'%3E%3Cstop offset='0%25' style='stop-color:%23fff;stop-opacity:0.8' /%3E%3Cstop offset='100%25' style='stop-color:%23fff;stop-opacity:0' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23grad3)'/%3E%3Ccircle cx='600' cy='200' r='200' fill='url(%23light)'/%3E%3Ctext x='50%25' y='70%25' font-family='Arial, sans-serif' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3EStudio Lighting%3C/text%3E%3C/svg%3E",
        ctaText: "View Lighting",
        ctaHref: "/shop",
        order: 2,
        active: true,
    },
    {
        title: "4K Video Cameras",
        subtitle: "Cinematic Excellence",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23553c9a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23b794f4;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23grad4)'/%3E%3Crect x='400' y='200' width='400' height='250' rx='20' fill='rgba(255,255,255,0.1)' stroke='white' stroke-width='3'/%3E%3Ccircle cx='600' cy='325' r='60' fill='rgba(255,255,255,0.2)' stroke='white' stroke-width='3'/%3E%3Ctext x='50%25' y='85%25' font-family='Arial, sans-serif' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3E4K Video Cameras%3C/text%3E%3C/svg%3E",
        ctaText: "Discover Cameras",
        ctaHref: "/shop",
        order: 3,
        active: true,
    },
    {
        title: "Audio Equipment",
        subtitle: "Crystal Clear Sound",
        imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23234e52;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2338b2ac;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23grad5)'/%3E%3Cellipse cx='600' cy='300' rx='200' ry='250' fill='rgba(255,255,255,0.1)' stroke='white' stroke-width='3'/%3E%3Cline x1='600' y1='100' x2='600' y2='500' stroke='white' stroke-width='3'/%3E%3Ctext x='50%25' y='85%25' font-family='Arial, sans-serif' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3EAudio Equipment%3C/text%3E%3C/svg%3E",
        ctaText: "Explore Audio",
        ctaHref: "/shop",
        order: 4,
        active: true,
    },
];

async function seedSliderData() {
    try {
        console.log('🌱 Seeding slider data...\n');

        // Delete existing slides
        const deleteResult = await prisma.sliderItem.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.count} existing slides\n`);

        // Create new slides
        for (const slide of sliderData) {
            const created = await prisma.sliderItem.create({
                data: slide,
            });
            console.log(`✅ Created slide: "${created.title}"`);
        }

        console.log('\n🎉 Successfully seeded slider data!');
        console.log(`📊 Total slides created: ${sliderData.length}\n`);

        // Display summary
        console.log('📋 Slider Items:');
        console.log('═'.repeat(60));
        sliderData.forEach((slide, index) => {
            console.log(`${index + 1}. ${slide.title}`);
            console.log(`   Subtitle: ${slide.subtitle}`);
            console.log(`   Button: ${slide.ctaText} → ${slide.ctaHref}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error seeding slider data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedSliderData()
    .then(() => {
        console.log('✨ Seed completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seed failed:', error);
        process.exit(1);
    });
