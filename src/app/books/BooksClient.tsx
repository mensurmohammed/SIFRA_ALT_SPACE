"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen } from "lucide-react";
import Pagination from "@/components/Pagination";

type Book = {
  BookID: number;
  Title: string;
  Author: string;
  CoverImage: string | null;
  Category: { CategoryName: string } | null;
  Copies: { Status: string }[];
};

const ITEMS_PER_PAGE = 20;

export default function BooksClient({ books, categories }: { books: Book[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Genres");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeCategory]);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        activeCategory === "All Genres" ||
        book.Category?.CategoryName === activeCategory;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        book.Title.toLowerCase().includes(q) ||
        book.Author.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [books, query, activeCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const allCategories = ["All Genres", ...categories];

  return (
    <>
      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="input pl-11"
            style={{ height: 48 }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors border"
            style={
              activeCategory === cat
                ? { background: "#352214", color: "#FFFFFF", borderColor: "#352214" }
                : { background: "#FFFFFF", color: "#352214", borderColor: "#E0E0E0" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-border-color mx-auto mb-3" strokeWidth={1} />
          <p className="text-text-muted">No books found matching your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-8">
            {paginatedBooks.map((book) => {
              const available = book.Copies.filter((c) => c.Status === "Available").length;
              const isBorrowed = available === 0 && book.Copies.length > 0;
              return (
                <Link
                  href={`/books/${book.BookID}`}
                  key={book.BookID}
                  className="group bg-white rounded-[12px] border border-border-color overflow-hidden hover:shadow-soft-md transition-all"
                  style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
                >
                  {/* Cover — 65% of card height */}
                  <div className="relative" style={{ paddingTop: "90%" }}>
                    {book.CoverImage ? (
                      <img
                        src={book.CoverImage}
                        alt={book.Title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-accent-gold opacity-40" strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-serif font-bold text-primary-dark text-sm leading-snug line-clamp-2 mb-0.5">
                      {book.Title}
                    </h3>
                    <p className="text-xs text-text-muted mb-2 line-clamp-1">by {book.Author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {book.Category?.CategoryName || "Uncategorized"}
                      </span>
                      {book.Copies.length > 0 && (
                        <span
                          className="badge text-[10px] px-2 py-0.5"
                          style={
                            isBorrowed
                              ? { background: "#FCE4D6", color: "#C65911" }
                              : { background: "#E2F0D9", color: "#385723" }
                          }
                        >
                          {isBorrowed ? "Borrowed" : "Available"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}
    </>
  );
}
