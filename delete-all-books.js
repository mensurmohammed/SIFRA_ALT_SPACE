const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Deleting all books and related records...");

  // Delete in order to avoid foreign key constraints
  await prisma.borrowing.deleteMany({});
  console.log("✅ Deleted all borrowings");

  await prisma.wishlist.deleteMany({});
  console.log("✅ Deleted all wishlists");

  await prisma.bookCopy.deleteMany({});
  console.log("✅ Deleted all book copies");

  await prisma.book.deleteMany({});
  console.log("✅ Deleted all books");

  console.log("\nAll book-related records deleted successfully!");
}

main()
  .catch((e) => {
    console.error("Error during deletion:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
