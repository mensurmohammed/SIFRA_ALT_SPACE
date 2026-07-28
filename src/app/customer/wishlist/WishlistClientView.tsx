"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, BookOpen, X } from "lucide-react";

export default function WishlistClientView({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);

  const handleRemove = async (wishlistId: string) => {
    const res = await fetch(`/api/wishlist/${wishlistId}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.WishlistID !== wishlistId));
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="bg-white rounded-[12px] p-12 text-center border border-border-color"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <Heart className="w-12 h-12 text-border-color mx-auto mb-3" strokeWidth={1} />
        <p className="text-text-muted mb-2">Your wishlist is empty.</p>
        <p className="text-sm text-text-muted mb-5">Find books you love and save them here.</p>
        <Link
          href="/books"
          className="inline-block px-6 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#352214", color: "#FFFFFF" }}
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <div
          key={item.WishlistID}
          className="bg-white rounded-[12px] border border-border-color overflow-hidden flex flex-col group"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          {/* Cover */}
          <div className="relative h-48 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center overflow-hidden">
            {item.Book.CoverImage ? (
              <img
                src={item.Book.CoverImage}
                alt={item.Book.Title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <BookOpen className="w-12 h-12 text-accent-gold opacity-30" strokeWidth={1} />
            )}
            {/* Remove overlay */}
            <div className="absolute inset-0 bg-primary-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleRemove(item.WishlistID)}
                className="flex items-center gap-1.5 bg-white text-red-600 px-4 py-2 rounded-[6px] text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-serif font-bold text-primary-dark text-base line-clamp-2 mb-1">
              {item.Book.Title}
            </h3>
            <p className="text-xs text-text-muted mb-4">by {item.Book.Author}</p>
            <div className="mt-auto">
              <Link
                href={`/books/${item.Book.BookID}`}
                className="text-xs font-semibold uppercase tracking-wider hover:underline"
                style={{ color: "#D4A359" }}
              >
                View in Library
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
