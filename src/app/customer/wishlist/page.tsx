import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import WishlistClientView from "./WishlistClientView";

export const dynamic = "force-dynamic";

export default async function CustomerWishlistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user: any = await verifyJwt(token as string);

  const wishlistItems = await prisma.wishlist.findMany({
    where: { UserID: user.userId },
    include: { Book: true },
    orderBy: { CreatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          My Wishlist
        </h1>
        <p className="text-text-muted text-sm">Books you have saved to read later.</p>
      </div>
      <WishlistClientView initialItems={wishlistItems} />
    </div>
  );
}
