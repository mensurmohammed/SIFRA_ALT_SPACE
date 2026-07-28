import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import WishlistButton from "./WishlistButton";
import { BookOpen, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookDetailsPage(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let user: any = null;

    if (token) {
      user = await verifyJwt(token);
    }

    const book = await prisma.book.findUnique({
      where: { BookID: params.id },
      include: { Category: true, Copies: true, WishlistedBy: true },
    });

    if (!book) notFound();

    const availableCopies = book.Copies.filter((c) => c.Status === "Available").length;
    const isWishlisted = user
      ? book.WishlistedBy.some((w) => w.UserID === user.userId)
      : false;

    return (
      <div style={{ background: "#F7F4EE" }} className="min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary-dark transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>

          <div
            className="bg-white rounded-[12px] border border-border-color overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Cover */}
              <div
                className="md:w-1/3 flex-shrink-0 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center"
                style={{ minHeight: 360 }}
              >
                {book.CoverImage ? (
                  <img
                    src={book.CoverImage}
                    alt={book.Title}
                    className="w-full h-full object-cover aspect-[2/3]"
                  />
                ) : (
                  <BookOpen className="w-20 h-20 text-accent-gold opacity-25" strokeWidth={1} />
                )}
              </div>

              {/* Details */}
              <div className="p-8 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "#D4A359" }}
                    >
                      {book.Category?.CategoryName || "Uncategorized"}
                    </span>
                    <span
                      className="badge text-xs"
                      style={
                        availableCopies > 0
                          ? { background: "#E2F0D9", color: "#385723" }
                          : { background: "#FCE4D6", color: "#C65911" }
                      }
                    >
                      {availableCopies > 0
                        ? `${availableCopies} available`
                        : "Unavailable"}
                    </span>
                  </div>

                  <h1 className="font-serif font-bold text-primary-dark mb-2" style={{ fontSize: "1.875rem" }}>
                    {book.Title}
                  </h1>
                  <p className="text-text-muted mb-6 text-base">by {book.Author}</p>

                  <p className="text-sm text-text-muted leading-relaxed mb-8">
                    {book.Description || "No description available for this book."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                    {[
                      { label: "ISBN", value: book.ISBN || "N/A" },
                      { label: "Publication Year", value: book.PublicationYear?.toString() || "N/A" },
                      { label: "Language", value: book.Language || "English" },
                      { label: "Shelf Location", value: book.ShelfLocation || "General" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                        <p className="font-semibold text-primary-dark">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-border-color">
                  {user ? (
                    <div className="flex gap-3 flex-wrap">
                      <WishlistButton bookId={book.BookID} initialWishlisted={isWishlisted} />
                      {(user.role === "Manager" || user.role === "Administrator") && (
                        <Link
                          href={`/manager/borrowings?bookId=${book.BookID}`}
                          className="px-5 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
                          style={{ background: "#D4A359", color: "#352214" }}
                        >
                          Borrow for Customer
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[8px]"
                      style={{ background: "#F7F4EE" }}
                    >
                      <p className="text-sm text-text-muted">
                        Please log in to borrow this book or add it to your wishlist.
                      </p>
                      <Link
                        href="/login"
                        className="shrink-0 px-5 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ background: "#352214", color: "#FFFFFF" }}
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Book details page error:", error);
    return (
      <div className="max-w-5xl mx-auto px-[8%] py-12">
        <Link href="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary-dark mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px]">
          <p className="font-semibold">Could not load book details</p>
          <p className="text-sm mt-1">Please check your database connection and try again later.</p>
        </div>
      </div>
    );
  }
}
