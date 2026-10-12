"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  ShoppingCart,
  BookOpen,
  AlertTriangle,
  Calendar,
  Download,
  Search,
  RefreshCw,
  Coffee,
  CheckCircle2,
  Clock,
  PackageCheck,
} from "lucide-react";
import ErrorAlert from "@/components/ErrorAlert";

type TimeRange = "all" | "today" | "week" | "month";
type TabType = "overview" | "sales" | "borrowings" | "inventory" | "events";

export default function ManagerReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load report data");
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setBorrowings(data.borrowings || []);
      setInventory(data.inventory || []);
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter items based on selected timeRange
  const isWithinTimeRange = (dateString: string) => {
    if (timeRange === "all" || !dateString) return true;
    const date = new Date(dateString);
    const now = new Date();
    
    if (timeRange === "today") {
      return date.toDateString() === now.toDateString();
    }
    
    if (timeRange === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return date >= oneWeekAgo;
    }

    if (timeRange === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return date >= oneMonthAgo;
    }

    return true;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchTime = isWithinTimeRange(o.OrderDate);
      const matchSearch =
        !searchTerm ||
        o.TabName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.OrderID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.Status?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTime && matchSearch;
    });
  }, [orders, timeRange, searchTerm]);

  const filteredBorrowings = useMemo(() => {
    return borrowings.filter((b) => {
      const matchTime = isWithinTimeRange(b.BorrowedAt || b.BorrowDate);
      const userName = `${b.User?.FirstName || ""} ${b.User?.LastName || ""}`;
      const bookTitle = b.Copy?.Book?.Title || b.Book?.Title || "";
      const matchSearch =
        !searchTerm ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.Status?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTime && matchSearch;
    });
  }, [borrowings, timeRange, searchTerm]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((i) => {
      return (
        !searchTerm ||
        i.ItemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.Category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [inventory, searchTerm]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchTime = isWithinTimeRange(e.EventDate);
      const matchSearch =
        !searchTerm ||
        e.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.Status?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTime && matchSearch;
    });
  }, [events, timeRange, searchTerm]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.TotalAmount || 0), 0);
  }, [filteredOrders]);

  const avgOrderValue = useMemo(() => {
    return filteredOrders.length ? Math.round(totalRevenue / filteredOrders.length) : 0;
  }, [filteredOrders, totalRevenue]);

  const activeBorrowingsCount = useMemo(() => {
    return filteredBorrowings.filter((b) => b.Status === "Active").length;
  }, [filteredBorrowings]);

  const overdueBorrowingsCount = useMemo(() => {
    const now = new Date();
    return filteredBorrowings.filter(
      (b) => b.Status === "Active" && b.DueDate && new Date(b.DueDate) < now
    ).length;
  }, [filteredBorrowings]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => (i.CurrentStock || 0) < 20).length;
  }, [inventory]);

 const totalEventRegistrations = useMemo(() => {
  return filteredEvents.reduce(
    (sum, e) =>
      sum +
      (e.Registrations?.filter((r: any) => r.Status === "Registered").length || 0),
    0
  );
}, [filteredEvents]);

  // CSV Export functions
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesCSV = () => {
    const headers = ["Order ID", "Date", "Tab / Customer", "Total Amount (ETB)", "Status"];
    const rows = filteredOrders.map((o) => [
      o.OrderID,
      new Date(o.OrderDate).toLocaleString(),
      o.TabName || "N/A",
      o.TotalAmount,
      o.Status,
    ]);
    downloadCSV(`sales_report_${timeRange}.csv`, headers, rows);
  };

  const exportBorrowingsCSV = () => {
    const headers = ["Borrowing ID", "Borrower Name", "Email", "Book Title", "Borrow Date", "Status"];
    const rows = filteredBorrowings.map((b) => [
      b.BorrowingID,
      `${b.User?.FirstName || ""} ${b.User?.LastName || ""}`.trim() || "N/A",
      b.User?.Email || "N/A",
      b.Copy?.Book?.Title || b.Book?.Title || "N/A",
      b.BorrowedAt ? new Date(b.BorrowedAt).toLocaleDateString() : (b.BorrowDate ? new Date(b.BorrowDate).toLocaleDateString() : "N/A"),
      b.Status,
    ]);
    downloadCSV(`borrowings_report_${timeRange}.csv`, headers, rows);
  };

  const exportInventoryCSV = () => {
    const headers = ["Item ID", "Item Name", "Category", "Current Stock", "Unit", "Status"];
    const rows = inventory.map((i) => [
      i.ItemID,
      i.ItemName,
      i.Category || "General",
      i.CurrentStock,
      i.Unit || "units",
      i.CurrentStock < 20 ? "Low Stock" : "In Stock",
    ]);
    downloadCSV("inventory_report.csv", headers, rows);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
            Manager Reports & Analytics
          </h1>
          <p className="text-text-muted text-sm">
            Operational analytics for café sales, library borrowings, inventory health, and events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            className="p-2.5 rounded-[8px] border border-border-color bg-white hover:bg-gray-50 transition-colors text-text-muted"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-accent-gold" : ""}`} />
          </button>

          {/* Time Filter Buttons */}
          <div className="bg-white border border-border-color rounded-[8px] p-1 flex items-center gap-1 shadow-sm">
            {(
              [
                { id: "all", label: "All Time" },
                { id: "today", label: "Today" },
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setTimeRange(item.id)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                  timeRange === item.id
                    ? "bg-[#352214] text-white shadow-xs"
                    : "text-text-muted hover:text-primary-dark"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ErrorAlert error={error} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          className="bg-white rounded-[12px] p-5 border border-border-color relative overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Total Revenue
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(56,87,35,0.10)" }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: "#385723" }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-dark mb-1">
            {totalRevenue.toLocaleString()} ETB
          </p>
          <p className="text-xs text-text-muted">
            {filteredOrders.length} orders (Avg: {avgOrderValue} ETB)
          </p>
        </div>

        <div
          className="bg-white rounded-[12px] p-5 border border-border-color relative overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Active Borrowings
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,163,89,0.10)" }}
            >
              <BookOpen className="w-4 h-4" style={{ color: "#D4A359" }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-dark mb-1">{activeBorrowingsCount}</p>
          <p className="text-xs text-text-muted">
            {overdueBorrowingsCount > 0 ? (
              <span className="text-[#C65911] font-semibold">
                ⚠️ {overdueBorrowingsCount} overdue borrowings
              </span>
            ) : (
              "All active borrowings on schedule"
            )}
          </p>
        </div>

        <div
          className="bg-white rounded-[12px] p-5 border border-border-color relative overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Low Stock Alerts
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: lowStockCount > 0 ? "rgba(198,89,17,0.10)" : "rgba(112,111,111,0.10)",
              }}
            >
              <AlertTriangle
                className="w-4 h-4"
                style={{ color: lowStockCount > 0 ? "#C65911" : "#706F6F" }}
              />
            </div>
          </div>
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: lowStockCount > 0 ? "#C65911" : "#352214" }}
          >
            {lowStockCount} Items
          </p>
          <p className="text-xs text-text-muted">
            {lowStockCount > 0 ? "Items require inventory restock" : "All inventory levels healthy"}
          </p>
        </div>

        <div
          className="bg-white rounded-[12px] p-5 border border-border-color relative overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Event Attendees
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(53,34,20,0.08)" }}
            >
              <Calendar className="w-4 h-4" style={{ color: "#352214" }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-dark mb-1">{totalEventRegistrations}</p>
          <p className="text-xs text-text-muted">Across {filteredEvents.length} events</p>
        </div>
      </div>

      {/* Tabs & Toolbar */}
      <div className="bg-white rounded-[16px] border border-border-color p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "overview", label: "Overview", icon: PackageCheck },
              { id: "sales", label: "Café Sales", icon: Coffee },
              { id: "borrowings", label: "Borrowings", icon: BookOpen },
              { id: "inventory", label: "Inventory", icon: AlertTriangle },
              { id: "events", label: "Events", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#D4A359] text-white shadow-xs"
                      : "text-text-muted hover:bg-gray-100 hover:text-primary-dark"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & CSV Export toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search report data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-border-color rounded-[8px] bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-gold"
              />
            </div>

            {/* CSV Export Dropdown / Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={
                  activeTab === "borrowings"
                    ? exportBorrowingsCSV
                    : activeTab === "inventory"
                    ? exportInventoryCSV
                    : exportSalesCSV
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-xs"
                style={{ background: "#352214" }}
                title="Export current view to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 text-center text-text-muted space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-accent-gold" />
            <p className="text-sm font-semibold">Gathering reports and analytics...</p>
          </div>
        ) : (
          <div>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Sales & Borrowing summary side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Sales Summary */}
                  <div className="border border-border-color rounded-[12px] p-5 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif font-bold text-primary-dark text-base flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-accent-gold" />
                        Recent Orders Summary
                      </h3>
                      <button
                        onClick={() => setActiveTab("sales")}
                        className="text-xs font-semibold text-accent-gold hover:underline"
                      >
                        View All ({filteredOrders.length})
                      </button>
                    </div>

                    {filteredOrders.length === 0 ? (
                      <p className="text-xs text-text-muted py-6 text-center">No orders found in this period.</p>
                    ) : (
                      <div className="space-y-3">
                        {filteredOrders.slice(0, 5).map((order) => (
                          <div
                            key={order.OrderID}
                            className="bg-white p-3.5 rounded-[8px] border border-gray-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-primary-dark">
                                {order.TabName || `Order #${order.OrderID.slice(0, 8)}`}
                              </p>
                              <p className="text-[11px] text-text-muted">
                                {new Date(order.OrderDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-dark">{order.TotalAmount} ETB</p>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.Status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.Status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Borrowings Overview */}
                  <div className="border border-border-color rounded-[12px] p-5 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif font-bold text-primary-dark text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#385723]" />
                        Active & Recent Borrowings
                      </h3>
                      <button
                        onClick={() => setActiveTab("borrowings")}
                        className="text-xs font-semibold text-accent-gold hover:underline"
                      >
                        View All ({filteredBorrowings.length})
                      </button>
                    </div>

                    {filteredBorrowings.length === 0 ? (
                      <p className="text-xs text-text-muted py-6 text-center">No borrowings found in this period.</p>
                    ) : (
                      <div className="space-y-3">
                        {filteredBorrowings.slice(0, 5).map((borrowing) => (
                          <div
                            key={borrowing.BorrowingID}
                            className="bg-white p-3.5 rounded-[8px] border border-gray-100 flex items-center justify-between text-xs"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="font-bold text-primary-dark truncate">
                                {borrowing.Copy?.Book?.Title || borrowing.Book?.Title || "Book"}
                              </p>
                              <p className="text-[11px] text-text-muted truncate">
                                {borrowing.User?.FirstName} {borrowing.User?.LastName}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  borrowing.Status === "Returned"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {borrowing.Status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sales Tab */}
            {activeTab === "sales" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-primary-dark text-base">
                    Café Sales Report ({filteredOrders.length} records)
                  </h3>
                  <button
                    onClick={exportSalesCSV}
                    className="text-xs font-bold text-accent-gold flex items-center gap-1 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CSV
                  </button>
                </div>

                <div className="overflow-x-auto border border-border-color rounded-[10px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-text-muted uppercase tracking-wider font-semibold border-b border-border-color">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Date &amp; Time</th>
                        <th className="p-3.5">Tab / Customer</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-text-muted">
                            No orders match your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.OrderID} className="hover:bg-gray-50/80">
                            <td className="p-3.5 font-mono text-[11px] text-gray-500">
                              #{order.OrderID.slice(0, 8)}
                            </td>
                            <td className="p-3.5 text-primary-dark">
                              {new Date(order.OrderDate).toLocaleString()}
                            </td>
                            <td className="p-3.5 font-bold text-primary-dark">
                              {order.TabName || "Walk-in Customer"}
                            </td>
                            <td className="p-3.5 font-bold text-primary-dark">
                              {order.TotalAmount} ETB
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  order.Status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.Status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Borrowings Tab */}
            {activeTab === "borrowings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-primary-dark text-base">
                    Library Borrowing Activity ({filteredBorrowings.length} records)
                  </h3>
                  <button
                    onClick={exportBorrowingsCSV}
                    className="text-xs font-bold text-accent-gold flex items-center gap-1 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CSV
                  </button>
                </div>

                <div className="overflow-x-auto border border-border-color rounded-[10px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-text-muted uppercase tracking-wider font-semibold border-b border-border-color">
                      <tr>
                        <th className="p-3.5">Borrower</th>
                        <th className="p-3.5">Book Title</th>
                        <th className="p-3.5">Borrow Date</th>
                        <th className="p-3.5">Due Date</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBorrowings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-text-muted">
                            No borrowings match your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredBorrowings.map((b) => {
                          const isOverdue =
                            b.Status === "Active" && b.DueDate && new Date(b.DueDate) < new Date();
                          return (
                            <tr key={b.BorrowingID} className="hover:bg-gray-50/80">
                              <td className="p-3.5 font-bold text-primary-dark">
                                {b.User?.FirstName} {b.User?.LastName}
                                <span className="block text-[11px] font-normal text-text-muted">
                                  {b.User?.Email}
                                </span>
                              </td>
                              <td className="p-3.5 text-primary-dark font-medium">
                                {b.Copy?.Book?.Title || b.Book?.Title || "N/A"}
                              </td>
                              <td className="p-3.5 text-text-muted">
                                {b.BorrowedAt ? new Date(b.BorrowedAt).toLocaleDateString() : (b.BorrowDate ? new Date(b.BorrowDate).toLocaleDateString() : "N/A")}
                              </td>
                              <td className="p-3.5 text-text-muted">
                                {b.DueDate ? new Date(b.DueDate).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    isOverdue
                                      ? "bg-red-100 text-red-800"
                                      : b.Status === "Returned"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {isOverdue ? "OVERDUE" : b.Status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-primary-dark text-base">
                    Inventory &amp; Stock Levels ({filteredInventory.length} items)
                  </h3>
                  <button
                    onClick={exportInventoryCSV}
                    className="text-xs font-bold text-accent-gold flex items-center gap-1 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CSV
                  </button>
                </div>

                <div className="overflow-x-auto border border-border-color rounded-[10px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-text-muted uppercase tracking-wider font-semibold border-b border-border-color">
                      <tr>
                        <th className="p-3.5">Item Name</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Current Stock</th>
                        <th className="p-3.5">Unit</th>
                        <th className="p-3.5">Stock Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-text-muted">
                            No inventory items match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map((item) => {
                          const isLow = (item.CurrentStock || 0) < 20;
                          return (
                            <tr key={item.ItemID} className="hover:bg-gray-50/80">
                              <td className="p-3.5 font-bold text-primary-dark">
                                {item.ItemName}
                              </td>
                              <td className="p-3.5 text-text-muted">
                                {item.Category || "General"}
                              </td>
                              <td className="p-3.5 font-bold text-primary-dark">
                                {item.CurrentStock}
                              </td>
                              <td className="p-3.5 text-text-muted">{item.Unit || "units"}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    isLow
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {isLow ? "Low Stock Warning" : "In Stock"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-primary-dark text-base">
                  Event Registration Summary ({filteredEvents.length} events)
                </h3>

                <div className="overflow-x-auto border border-border-color rounded-[10px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-text-muted uppercase tracking-wider font-semibold border-b border-border-color">
                      <tr>
                        <th className="p-3.5">Event Title</th>
                        <th className="p-3.5">Date &amp; Time</th>
                        <th className="p-3.5">Registrations / Capacity</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-text-muted">
                            No events match your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((evt) => (
                          <tr key={evt.EventID} className="hover:bg-gray-50/80">
                            <td className="p-3.5 font-bold text-primary-dark">{evt.Title}</td>
                            <td className="p-3.5 text-text-muted">
                              {new Date(evt.EventDate).toLocaleString()}
                            </td>
                            <td className="p-3.5 font-bold text-primary-dark">
                              {evt.Registrations?.filter((r: any) => r.Status === "Registered").length || 0} / {evt.Capacity || "∞"}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                {evt.Status || "Active"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
