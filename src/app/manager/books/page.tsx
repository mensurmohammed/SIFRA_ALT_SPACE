"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react";
import Pagination from "@/components/Pagination";

type Book = {
  BookID: string;
  Title: string;
  Author: string;
  ISBN?: string | null;
  Category?: { CategoryName: string } | null;
  Copies: { Status: string }[];
};

const ITEMS_PER_PAGE = 20;

export default function BookManagementPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const q = searchTerm.toLowerCase();
      return (
        !q ||
        b.Title.toLowerCase().includes(q) ||
        b.Author.toLowerCase().includes(q) ||
        b.ISBN?.toLowerCase().includes(q) ||
        b.Category?.CategoryName.toLowerCase().includes(q)
      );
    });
  }, [books, searchTerm]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/books/${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        setBooks(books.filter((b) => b.BookID !== deletingId));
        setShowConfirm(false);
        setDeletingId(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-border-color animate-pulse rounded-[6px]" />
        <div className="bg-white rounded-[12px] border border-border-color p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-border-color/50 animate-pulse rounded-[6px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
            Book Management
          </h1>
          <p className="text-text-muted text-sm">Manage the library&apos;s book catalog and copies.</p>
        </div>
        <Link
          href="/manager/books/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90 shrink-0"
          style={{ background: "#352214", color: "#FFFFFF" }}
        >
          <Plus className="w-4 h-4" />
          Add New Book
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Filter catalog by title, author, category, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-border-color rounded-[8px] focus:outline-none focus:ring-1 focus:ring-accent-gold shadow-xs"
        />
      </div>

      <div
        className="bg-white rounded-[12px] border border-border-color overflow-hidden p-6"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: "#F7F4EE", borderBottom: "1px solid #E0DCD3" }}>
                {["Book", "Author", "Category", "Copies", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-widest ${
                      i === 4 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map((book, i) => {
                const available = book.Copies.filter((c) => c.Status === "Available").length;
                return (
                  <tr
                    key={book.BookID}
                    style={{
                      borderBottom: i < paginatedBooks.length - 1 ? "1px solid #E0DCD3" : "none",
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-primary-dark">{book.Title}</div>
                      <div className="text-xs text-text-muted">{book.ISBN || "No ISBN"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                      {book.Author}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                      {book.Category?.CategoryName || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="badge text-xs"
                        style={
                          available > 0
                            ? { background: "#E2F0D9", color: "#385723" }
                            : { background: "#FCE4D6", color: "#C65911" }
                        }
                      >
                        {available} / {book.Copies.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/manager/books/${book.BookID}`}
                          className="flex items-center gap-1 text-xs font-semibold text-accent-gold hover:underline"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(book.BookID)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <BookOpen className="w-10 h-10 text-border-color mx-auto mb-2" strokeWidth={1} />
                    <p className="text-sm text-text-muted">No books found in catalog.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredBooks.length}
          itemsPerPage={ITEMS_PER_PAGE}
          className="mt-6"
        />
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white rounded-[16px] p-8 max-w-md w-full"
            style={{ boxShadow: "0 8px 40px rgba(53,34,20,0.15)" }}
          >
            <h3 className="font-serif font-bold text-primary-dark text-xl mb-3">Confirm Deletion</h3>
            <p className="text-sm text-text-muted mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setDeletingId(null);
                }}
                className="px-5 py-2.5 rounded-[6px] text-sm font-semibold border border-border-color text-primary-dark hover:bg-primary-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-[6px] text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
