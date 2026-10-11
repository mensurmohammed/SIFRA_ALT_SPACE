"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ redirectUrl = "/staff-login" }: { redirectUrl?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      router.push(redirectUrl);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
    >
      <span>Log Out</span>
    </button>
  );
}