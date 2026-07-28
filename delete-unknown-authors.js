
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ohhribezauhdvrisicmm:8z%21kMq2%21Y%3Fxc%3FAr@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
    },
  },
});

async function main() {
  console.log("Deleting books with 'Unknown Author'...");

  // Find all books with Unknown Author
  const booksToDelete = await prisma.book.findMany({
    where: { Author: "Unknown Author" },
    select: { BookID: true, Title: true },
  });

  console.log(`Found ${booksToDelete.length} books to delete:`);
  booksToDelete.forEach((book) => {
    console.log(`  - ${book.Title} (ID: ${book.BookID})`);
  });

  // Delete related copies first
  await prisma.bookCopy.deleteMany({
    where: { BookID: { in: booksToDelete.map((b) => b.BookID) } },
  });

  // Delete the books
  await prisma.book.deleteMany({
    where: { Author: "Unknown Author" },
  });

  console.log(`\nSuccessfully deleted ${booksToDelete.length} books!`);
}

main()
  .catch((e) => {
    console.error("Error during deletion:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
