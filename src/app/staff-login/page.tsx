"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";

import ErrorAlert from "@/components/ErrorAlert";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, loginType: "staff" }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    const data = await res.json();
    await refreshUser();
    if (data.user.role === "Administrator") router.push("/admin");
    else if (data.user.role === "Manager") router.push("/manager");
    else router.push("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-16 px-4"
      style={{ background: "#F7F4EE" }}
    >
      <div
        className="w-full bg-white rounded-[16px] px-12 py-12"
        style={{ maxWidth: 480, boxShadow: "0 4px 24px rgba(53,34,20,0.10)" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(212,163,89,0.10)" }}
          >
            <ShieldCheck className="w-7 h-7" style={{ color: "#D4A359" }} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif font-bold text-2xl text-primary-dark mb-2">
            Staff Portal
          </h1>
          <p className="text-sm text-text-muted">Authorized personnel only</p>
        </div>

        <ErrorAlert error={error} className="mb-6" />

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary-dark mb-1.5">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@sifra.et"
                className="input pl-10"
                style={{ height: 48 }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-dark mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-10"
                style={{ height: 48 }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
            style={{ background: "#352214", color: "#FFFFFF" }}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
