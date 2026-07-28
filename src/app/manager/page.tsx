import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Coffee,
  ShoppingBag,
  BookOpen,
  AlertTriangle,
  CreditCard,
  Library,
  ArrowLeftRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManagerDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let activeBorrowings = 0;
  let todayOrders: any[] = [];
  let lowStockItems = 0;

  try {
    [activeBorrowings, todayOrders, lowStockItems] = await Promise.all([
      prisma.borrowing.count({ where: { Status: "Active" } }),
      prisma.order.findMany({ where: { OrderDate: { gte: today } } }),
      prisma.inventoryItem.count({ where: { CurrentStock: { lt: 20 } } }),
    ]);
  } catch (err) {
    console.error("[Manager Dashboard] DB error:", err);
  }

  const todayRevenue = todayOrders.reduce(
    (sum: number, order: any) => sum + order.TotalAmount,
    0
  );

  const stats = [
    {
      icon: CreditCard,
      label: "Today's Sales",
      value: `${todayRevenue} ETB`,
      color: "#D4A359",
      bg: "rgba(212,163,89,0.10)",
    },
    {
      icon: ShoppingBag,
      label: "Orders Today",
      value: todayOrders.length.toString(),
      color: "#352214",
      bg: "rgba(53,34,20,0.08)",
    },
    {
      icon: BookOpen,
      label: "Active Borrowings",
      value: activeBorrowings.toString(),
      color: "#D4A359",
      bg: "rgba(212,163,89,0.10)",
    },
    {
      icon: AlertTriangle,
      label: "Low Stock Alerts",
      value: lowStockItems.toString(),
      color: lowStockItems > 0 ? "#C65911" : "#706F6F",
      bg: lowStockItems > 0 ? "rgba(198,89,17,0.08)" : "rgba(112,111,111,0.08)",
      danger: lowStockItems > 0,
    },
  ];

  const quickActions = [
    {
      href: "/manager/pos",
      label: "Open Café POS",
      icon: Coffee,
      desc: "Process orders at the café counter",
    },
    {
      href: "/manager/borrowings",
      label: "Checkout Desk",
      icon: ArrowLeftRight,
      desc: "Manage book check-in and check-out",
    },
    {
      href: "/manager/books",
      label: "Library Catalog",
      icon: Library,
      desc: "Browse and manage the book collection",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          Manager Dashboard
        </h1>
        <p className="text-text-muted text-sm">Today&apos;s snapshot and quick access to key operations.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ icon: Icon, label, value, color, bg, danger }) => (
          <div
            key={label}
            className={`bg-white rounded-[12px] p-6 border ${danger ? "border-l-4" : "border"} border-border-color`}
            style={{
              boxShadow: "0 2px 8px rgba(53,34,20,0.05)",
              borderLeftColor: danger ? "#C65911" : undefined,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
            <p
              className="text-2xl font-bold"
              style={{ color: danger ? "#C65911" : "#352214" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="font-serif font-bold text-primary-dark text-lg mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-[12px] p-6 border border-border-color hover:shadow-soft-md transition-all group flex flex-col items-center text-center"
              style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                style={{ background: "rgba(212,163,89,0.10)" }}
              >
                <Icon className="w-7 h-7" style={{ color: "#D4A359" }} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-primary-dark text-base mb-1">{label}</h3>
              <p className="text-xs text-text-muted">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
