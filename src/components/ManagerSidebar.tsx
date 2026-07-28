"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import {
  LayoutDashboard,
  Coffee,
  UtensilsCrossed,
  Package,
  Receipt,
  BookOpen,
  ArrowLeftRight,
  CalendarDays,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/manager", label: "Overview", icon: LayoutDashboard },
  { href: "/manager/pos", label: "Café POS", icon: Coffee },
  { href: "/manager/menu-items", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/manager/inventory", label: "Inventory", icon: Package },
  { href: "/manager/orders", label: "Orders History", icon: Receipt },
  { href: "/manager/books", label: "Library Books", icon: BookOpen },
  { href: "/manager/borrowings", label: "Borrowings", icon: ArrowLeftRight },
  { href: "/manager/events", label: "Events", icon: CalendarDays },
  { href: "/manager/reports", label: "Reports", icon: BarChart3 },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{ background: "#352214" }}
      className="w-64 text-white p-6 hidden md:flex flex-col h-screen sticky top-0 shrink-0"
    >
      <div className="mb-8">
        <span className="font-serif font-bold text-xl text-accent-gold tracking-wide">
          Sifra
        </span>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-semibold">
          Manager Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? "nav-item-active" : "nav-item-inactive"}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
        <div className="pt-4">
          <Link href="/" className="nav-item-inactive text-white/40 hover:text-white/70">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back to Main
          </Link>
        </div>
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <LogoutButton redirectUrl="/staff-login" />
      </div>
    </aside>
  );
}
