const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating accounts with fresh passwords...');

  const managerHash = await bcrypt.hash('manager123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  // 1. Upsert Manager
  await prisma.user.upsert({
    where: { Email: 'manager@sifra.et' },
    update: { PasswordHash: managerHash, Role: 'Manager', Status: 'Active' },
    create: {
      FirstName: 'Manager',
      LastName: 'User',
      Email: 'manager@sifra.et',
      PasswordHash: managerHash,
      Role: 'Manager',
      Status: 'Active',
    },
  });

  // 2. Upsert Admin
  await prisma.user.upsert({
    where: { Email: 'admin@sifra.et' },
    update: { PasswordHash: adminHash, Role: 'Administrator', Status: 'Active' },
    create: {
      FirstName: 'Admin',
      LastName: 'User',
      Email: 'admin@sifra.et',
      PasswordHash: adminHash,
      Role: 'Administrator',
      Status: 'Active',
    },
  });

  // 3. Upsert Customer
  await prisma.user.upsert({
    where: { Email: 'user@sifra.et' },
    update: { PasswordHash: userHash, Role: 'Customer', Status: 'Active' },
    create: {
      FirstName: 'Regular',
      LastName: 'User',
      Email: 'user@sifra.et',
      PasswordHash: userHash,
      Role: 'Customer',
      Status: 'Active',
    },
  });

  console.log('✅ All 3 accounts updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });