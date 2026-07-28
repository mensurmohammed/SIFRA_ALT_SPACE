"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cafe", label: "Café" },
  { href: "/books", label: "Books" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (loading) {
    return (
      <header
        style={{ background: "#352214", height: 80 }}
        className="sticky top-0 z-50 flex items-center px-4 md:px-8"
      >
        <span className="shrink-0 flex items-center">
          <Logo className="h-10 w-auto text-accent-gold" />
        </span>
      </header>
    );
  }

  return (
    <header
      style={{ background: "#352214", minHeight: 80 }}
      className="sticky top-0 z-50"
    >
      <nav className="flex items-center justify-between h-20 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center hover:opacity-90 transition-opacity">
          <Logo className="h-10 w-auto text-accent-gold" />
        </Link>

        {/* Center Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors pb-1 ${
                isActive(link.href)
                  ? "text-accent-gold border-b-2 border-accent-gold"
                  : "text-white hover:text-accent-gold border-b-2 border-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-accent-gold transition-colors"
              >
                <span
                  className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-primary-dark font-bold text-sm"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white rounded-[8px] shadow-soft-md py-2 min-w-48 z-50 border border-border-color">
                  <Link
                    href={
                      user.role === "Administrator"
                        ? "/admin"
                        : user.role === "Manager"
                        ? "/manager"
                        : "/customer"
                    }
                    className="block px-4 py-2 text-sm text-primary-dark hover:bg-primary-light"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/customer/profile"
                    className="block px-4 py-2 text-sm text-primary-dark hover:bg-primary-light"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <hr className="my-1 border-border-color" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-primary-dark hover:bg-primary-light"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-white hover:underline font-semibold transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-accent-gold text-primary-dark px-[18px] py-2 rounded-[6px] hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{ background: "#352214" }}
          className="md:hidden px-4 pb-6 border-t border-white/10"
        >
          <div className="flex flex-col gap-1 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive(link.href) ? "text-accent-gold" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-3 pt-3 border-t border-white/10 mt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-white font-semibold">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm font-semibold bg-accent-gold text-primary-dark px-4 py-1.5 rounded-[6px]">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
