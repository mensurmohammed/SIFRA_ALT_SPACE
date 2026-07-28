import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerBorrowingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user: any = await verifyJwt(token as string);

  const borrowings = await prisma.borrowing.findMany({
    where: { UserID: user.userId },
    include: { Copy: { include: { Book: true } } },
    orderBy: { BorrowedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          My Borrowings
        </h1>
        <p className="text-text-muted text-sm">Books you have borrowed from Sifra.</p>
      </div>

      {borrowings.length === 0 ? (
        <div
          className="bg-white rounded-[12px] p-12 text-center border border-border-color"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <BookOpen className="w-12 h-12 text-border-color mx-auto mb-3" strokeWidth={1} />
          <p className="text-text-muted mb-5">You haven&apos;t borrowed any books yet.</p>
          <Link
            href="/books"
            className="inline-block px-6 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#352214", color: "#FFFFFF" }}
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {borrowings.map((b) => (
            <div
              key={b.BorrowingID}
              className="bg-white rounded-[12px] border border-border-color overflow-hidden flex flex-col"
              style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
            >
              {/* Cover */}
              <div className="h-48 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center overflow-hidden">
                {b.Copy.Book.CoverImage ? (
                  <img
                    src={b.Copy.Book.CoverImage}
                    alt={b.Copy.Book.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-12 h-12 text-accent-gold opacity-30" strokeWidth={1} />
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-primary-dark text-base line-clamp-2 mb-1">
                  {b.Copy.Book.Title}
                </h3>
                <p className="text-xs text-text-muted mb-4">by {b.Copy.Book.Author}</p>

                <div className="space-y-2 border-t border-border-color pt-4 mt-auto">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Borrowed</span>
                    <span className="font-semibold text-primary-dark">
                      {b.BorrowedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-text-muted">Status</span>
                    <span
                      className="badge text-[10px]"
                      style={
                        b.Status === "Active"
                          ? { background: "#FCE4D6", color: "#C65911" }
                          : { background: "#E2F0D9", color: "#385723" }
                      }
                    >
                      {b.Status}
                    </span>
                  </div>
                  {b.ReturnedAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Returned</span>
                      <span className="font-semibold text-primary-dark">
                        {b.ReturnedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
