import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import Link from "next/link";
import { BookMarked, Heart, CalendarDays, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const user: any = await verifyJwt(token);
  if (!user) return null;

  const [activeBorrowings, wishlistCount, nextEvent] = await Promise.all([
    prisma.borrowing.count({ where: { UserID: user.userId, Status: "Active" } }),
    prisma.wishlist.count({ where: { UserID: user.userId } }),
    prisma.eventRegistration.findFirst({
      where: {
        UserID: user.userId,
        Event: { EventDate: { gte: new Date() } },
      },
      include: { Event: true },
      orderBy: { Event: { EventDate: "asc" } },
    }),
  ]);

  const statCards = [
    {
      href: "/customer/borrowings",
      icon: BookMarked,
      label: "Active Borrowings",
      value: activeBorrowings.toString(),
      color: "#D4A359",
      bg: "rgba(212,163,89,0.10)",
    },
    {
      href: "/customer/wishlist",
      icon: Heart,
      label: "Wishlisted Books",
      value: wishlistCount.toString(),
      color: "#C65911",
      bg: "rgba(198,89,17,0.08)",
    },
    {
      href: "/customer/events",
      icon: CalendarDays,
      label: "Next Event",
      value: nextEvent ? nextEvent.Event.Title : "None upcoming",
      color: "#385723",
      bg: "rgba(56,87,35,0.08)",
      isText: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          Welcome back, {user.name}!
        </h1>
        <p className="text-text-muted text-sm">Here is an overview of your account activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map(({ href, icon: Icon, label, value, color, bg, isText }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-[12px] p-6 border border-border-color hover:shadow-soft-md transition-all group"
            style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">{label}</h3>
            </div>
            <p
              className={`font-bold text-primary-dark ${isText ? "text-base leading-snug" : "text-3xl"}`}
            >
              {value}
            </p>
          </Link>
        ))}
      </div>

      {/* Event Reminder Banner */}
      {nextEvent && (
        <div
          className="rounded-[12px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border"
          style={{
            background: "rgba(212,163,89,0.08)",
            borderColor: "rgba(212,163,89,0.25)",
          }}
        >
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#D4A359" }} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#D4A359" }}>
                Upcoming Event Reminder
              </p>
              <h4 className="font-serif font-bold text-primary-dark text-lg">
                {nextEvent.Event.Title}
              </h4>
              <p className="text-text-muted text-sm mt-0.5">
                {new Date(nextEvent.Event.EventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {nextEvent.Event.StartTime ? ` at ${nextEvent.Event.StartTime}` : ""}
              </p>
            </div>
          </div>
          <Link
            href={`/events/${nextEvent.EventID}`}
            className="shrink-0 px-5 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#D4A359", color: "#352214" }}
          >
            View Details
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div
        className="bg-white rounded-[12px] p-6 border border-border-color"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <h2 className="font-serif font-bold text-primary-dark text-lg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/books", label: "Browse Books" },
            { href: "/events", label: "View Events" },
            { href: "/customer/profile", label: "Edit Profile" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-[6px] text-sm font-semibold border border-border-color text-primary-dark hover:bg-primary-dark hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
