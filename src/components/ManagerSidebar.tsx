"use client";
import { useState, useEffect } from "react";
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
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar automatically when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Navigation Bar (Only visible on small screens) */}
      <div 
        style={{ background: "#352214" }}
        className="md:hidden flex items-center justify-between px-4 py-3 text-white sticky top-0 z-40 border-b border-white/10"
      >
        <div>
          <span className="font-serif font-bold text-lg text-accent-gold tracking-wide">
            Sifra
          </span>
          <span className="text-xs text-white/50 ml-2 uppercase tracking-wider">
            Manager
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay backdrop on mobile when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Desktop sticky sidebar + Mobile overlay drawer) */}
      <aside
        style={{ background: "#352214" }}
        className={`
          w-64 text-white p-6 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-xl text-accent-gold tracking-wide">
              Sifra
            </span>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-semibold">
              Manager Dashboard
            </p>
          </div>
          {/* Close button inside drawer for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 rounded-lg text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
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
    </>
  );
}