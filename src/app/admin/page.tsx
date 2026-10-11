import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, BookOpen, CalendarDays, UserCog, BarChart3, Settings, ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count();
  const booksCount = await prisma.book.count();
  const eventsCount = await prisma.event.count();

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: usersCount,
      color: "#D4A359",
      bg: "rgba(212,163,89,0.10)",
    },
    {
      icon: BookOpen,
      label: "Total Books",
      value: booksCount,
      color: "#352214",
      bg: "rgba(53,34,20,0.08)",
    },
    {
      icon: CalendarDays,
      label: "Total Events",
      value: eventsCount,
      color: "#385723",
      bg: "rgba(56,87,35,0.08)",
    },
  ];

  const quickLinks = [
    { href: "/admin/managers", label: "Manage Manager Accounts", icon: UserCog },
    { href: "/admin/users", label: "Manage Customers", icon: Users },
    { href: "/admin/reports", label: "View Financial Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Configure Library Rules", icon: Settings },
    { href: "/admin/audit", label: "Audit Logs", icon: ClipboardList },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1 text-2xl sm:text-3xl">
          System Overview
        </h1>
        <p className="text-text-muted text-xs sm:text-sm">Administrator control panel for Sifra.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {statCards.map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-[12px] p-4 sm:p-6 border border-border-color"
            style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-text-muted uppercase tracking-wide">{label}</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-primary-dark">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div
          className="bg-white rounded-[12px] p-4 sm:p-6 border border-border-color"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <h2 className="font-serif font-bold text-primary-dark text-base sm:text-lg mb-4 sm:mb-5 pb-3 border-b border-border-color">
            Quick Actions
          </h2>
          <div className="space-y-1.5 sm:space-y-2">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs sm:text-sm font-semibold text-text-muted hover:bg-primary-light hover:text-primary-dark transition-colors min-h-[44px]"
              >
                <Icon className="w-4 h-4 text-accent-gold shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div
          className="bg-white rounded-[12px] p-4 sm:p-6 border border-border-color"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          <h2 className="font-serif font-bold text-primary-dark text-base sm:text-lg mb-4 sm:mb-5 pb-3 border-b border-border-color">
            Recent System Alerts
          </h2>
          <p className="text-xs sm:text-sm text-text-muted italic text-center py-6 sm:py-8">
            No critical alerts at this time.
          </p>
        </div>
      </div>
    </div>
  );
}





