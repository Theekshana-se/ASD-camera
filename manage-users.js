const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const action = process.argv[2]; // 'list' or 'promote'
const email = process.argv[3];

async function main() {
  try {
    if (action === 'list') {
      const users = await prisma.user.findMany({
        orderBy: { id: 'desc' },
        take: 10,
      });
      console.log('\n--- Recent Users ---');
      if (users.length === 0) {
        console.log('No users found in the database.');
      }
      users.forEach(u => {
        console.log(`Email: ${u.email} | Role: ${u.role} | ID: ${u.id}`);
      });
      console.log('--------------------\n');
    } else if (action === 'promote') {
      if (!email) {
        console.log('Please provide an email to promote: node manage-users.js promote user@example.com');
        return;
      }
      const user = await prisma.user.update({
        where: { email },
        data: { role: 'admin' },
      });
      console.log(`\n✅ Success! User ${user.email} is now an ADMIN.\n`);
    } else {
      console.log('\nUsage:');
      console.log('  List users:    node manage-users.js list');
      console.log('  Promote user:  node manage-users.js promote <email>\n');
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();