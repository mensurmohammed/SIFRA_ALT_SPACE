import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allBooks = await prisma.book.findMany({
    include: {
      Copies: {
        include: {
          Borrowings: true,
        },
      },
      WishlistedBy: true,
    },
  });

  console.log(`Total books in database before cleanup: ${allBooks.length}`);

  const booksToDelete = allBooks.filter((book) => {
    const title = (book.Title || "").trim();
    const author = (book.Author || "").trim();
    const coverImage = (book.CoverImage || "").trim();

    const noTitle =
      !title ||
      title.toLowerCase().startsWith("book (") ||
      title.toLowerCase() === "not found" ||
      title.toLowerCase() === "untitled";

    const unknownAuthor =
      !author ||
      author.toLowerCase() === "unknown author" ||
      author.toLowerCase() === "unknown";

    const noCoverImage = !coverImage;

    return noTitle || unknownAuthor || noCoverImage;
  });

  console.log(`Found ${booksToDelete.length} books matching deletion criteria (no title, unknown author, or no cover image).`);

  let deletedCount = 0;

  for (const book of booksToDelete) {
    const copyIds = book.Copies.map((c) => c.CopyID);

    // 1. Delete associated borrowings if any
    if (copyIds.length > 0) {
      await prisma.borrowing.deleteMany({
        where: {
          CopyID: { in: copyIds },
        },
      });

      // 2. Delete book copies
      await prisma.bookCopy.deleteMany({
        where: {
          CopyID: { in: copyIds },
        },
      });
    }

    // 3. Delete wishlist entries if any
    await prisma.wishlist.deleteMany({
      where: {
        BookID: book.BookID,
      },
    });

    // 4. Delete the book record
    await prisma.book.delete({
      where: {
        BookID: book.BookID,
      },
    });

    deletedCount++;
  }

  const remainingBooks = await prisma.book.count();

  console.log(`Cleanup complete!`);
  console.log(`Deleted books: ${deletedCount}`);
  console.log(`Remaining valid books in database: ${remainingBooks}`);
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
