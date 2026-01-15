
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function list() {
    try {
        const users = await prisma.user.findMany();
        users.forEach(u => {
            console.log(`${u.email} : ${u.role}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

list();
