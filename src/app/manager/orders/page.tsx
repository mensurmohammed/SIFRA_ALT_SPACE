import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrdersHistoryPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      include: {
        OrderItems: { include: { MenuItem: true } },
        Payments: true,
      },
      orderBy: { OrderDate: "desc" },
    });
  } catch (err) {
    console.error("[Orders Page] DB error:", err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          Café Order History
        </h1>
        <p className="text-text-muted text-sm">All-time record of café orders processed.</p>
      </div>

      <div
        className="bg-white rounded-[12px] border border-border-color overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <table className="min-w-full">
          <thead>
            <tr style={{ background: "#F7F4EE", borderBottom: "1px solid #E0DCD3" }}>
              {["Order ID", "Date", "Items", "Total", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr
                key={o.OrderID}
                style={{ borderBottom: i < orders.length - 1 ? "1px solid #E0DCD3" : "none" }}
              >
                <td className="px-6 py-4 text-xs text-text-muted font-mono whitespace-nowrap">
                  {o.OrderID.substring(0, 8)}…
                </td>
                <td className="px-6 py-4 text-sm text-primary-dark whitespace-nowrap">
                  {o.OrderDate.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {o.OrderItems.map(
                    (item: any) => `${item.Quantity}× ${item.MenuItem.Name}`
                  ).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm font-bold whitespace-nowrap" style={{ color: "#D4A359" }}>
                  {o.TotalAmount} ETB
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="badge text-xs"
                    style={{ background: "#E2F0D9", color: "#385723" }}
                  >
                    {o.Status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-text-muted">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
