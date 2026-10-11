async function main() {
  console.log('Clearing old inventory links and items...');
  // 1. Delete the links first to satisfy the database rules
  await prisma.menuItemInventory.deleteMany({});
  await prisma.menuItem.deleteMany({});
  
  // 2. Now it is perfectly safe to delete the inventory items!
  await prisma.inventoryItem.deleteMany({});

  console.log('Adding new products to inventory...');
  await prisma.inventoryItem.createMany({
    data: [
      { Name: 'French Press Coffee', CurrentStock: 100, Unit: 'cups' },
      { Name: 'Moka Pot Coffee', CurrentStock: 100, Unit: 'cups' },
      { Name: 'Tea', CurrentStock: 150, Unit: 'cups' },
      { Name: 'Water', CurrentStock: 200, Unit: 'bottles' },
      { Name: 'Softdrink', CurrentStock: 150, Unit: 'cans' },
      { Name: 'Peanuts', CurrentStock: 80, Unit: 'bags' },
      { Name: 'Kolo', CurrentStock: 100, Unit: 'portions' },
      { Name: 'Dube', CurrentStock: 50, Unit: 'pieces' },
    ]
  });

  console.log('Seeding finished.');
}
