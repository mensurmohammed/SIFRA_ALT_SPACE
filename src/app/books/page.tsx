import { prisma } from "@/lib/prisma";
import BooksClient from "./BooksClient";

export const metadata = {
  title: "Book Catalog",
  description: "Browse the Sifra curated book collection.",
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  let books: any[] = [];
  let categories: string[] = [];

  try {
    books = await prisma.book.findMany({
      include: { Category: true, Copies: true },
      orderBy: { CreatedAt: "desc" },
    });

    const cats = await prisma.bookCategory.findMany({ orderBy: { CategoryName: "asc" } });
    categories = cats.map((c: any) => c.CategoryName);
  } catch (error) {
    console.error("Catalog page error:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px]">
          <p className="font-semibold">Could not load books</p>
          <p className="text-sm mt-1">Please check your database connection and try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F7F4EE" }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-subtitle">Curated Collection</p>
          <h1 className="font-serif font-bold text-primary-dark" style={{ fontSize: "2.25rem" }}>
            Our Book Collection
          </h1>
        </div>

        <BooksClient books={books} categories={categories} />
      </div>
    </div>
  );
}
