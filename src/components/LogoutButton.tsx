"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ redirectUrl = "/login" }: { redirectUrl?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = redirectUrl;
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full text-sm font-semibold text-white/50 hover:text-white transition-colors px-2 py-2 rounded-[6px] hover:bg-white/10"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      Logout
    </button>
  );
}
