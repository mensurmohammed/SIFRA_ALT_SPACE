import { prisma } from "@/lib/prisma";
import { TrendingUp, ShoppingCart, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.TotalAmount, 0);

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1 text-2xl sm:text-3xl">
          System Reports &amp; Analytics
        </h1>
        <p className="text-text-muted text-xs sm:text-sm">Financial overview and data export tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div
          className="bg-white rounded-[12px] p-4 sm:p-6 border-l-4 border border-border-color"
          style={{ borderLeftColor: "#385723", boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(56,87,35,0.08)" }}>
              <TrendingUp className="w-4 h-4" style={{ color: "#385723" }} strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">All-Time Café Revenue</p>
          <p className="text-3xl sm:text-4xl font-bold text-primary-dark">{totalRevenue.toLocaleString()} ETB</p>
        </div>

        <div
          className="bg-white rounded-[12px] p-4 sm:p-6 border-l-4 border border-border-color"
          style={{ borderLeftColor: "#D4A359", boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(212,163,89,0.10)" }}>
              <ShoppingCart className="w-4 h-4" style={{ color: "#D4A359" }} strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Total Orders Processed</p>
          <p className="text-3xl sm:text-4xl font-bold text-primary-dark">{orders.length}</p>
        </div>
      </div>

      <div
        className="bg-white rounded-[12px] p-4 sm:p-6 border border-border-color"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <h2 className="font-serif font-bold text-primary-dark text-base sm:text-lg mb-2">Export Options</h2>
        <p className="text-xs sm:text-sm text-text-muted mb-5">
          Export full historical data to CSV for external accounting software.
        </p>
        <button
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90 min-h-[44px]"
          style={{ background: "#352214", color: "#FFFFFF" }}
        >
          <Download className="w-4 h-4" />
          Export All Data (CSV)
        </button>
      </div>
    </div>
  );
}