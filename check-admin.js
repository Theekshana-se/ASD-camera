const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking for admin users...');
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
    });
    
    if (admins.length > 0) {
      console.log('Found admin users:');
      admins.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
    } else {
      console.log('No admin users found.');
    }
    
    const totalUsers = await prisma.user.count();
    console.log(`Total users in database: ${totalUsers}`);
    
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();