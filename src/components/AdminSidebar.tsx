"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import {
  LayoutDashboard,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/managers", label: "Manager Accounts", icon: UserCog },
  { href: "/admin/users", label: "Customer Accounts", icon: Users },
  { href: "/admin/reports", label: "System Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit", label: "Audit Logs", icon: ClipboardList },
];

export default function AdminSidebar() {
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
          Admin Control
        </p>
      </div>

      <nav className="flex-1 space-y-1">
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
