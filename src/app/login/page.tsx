"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";

import ErrorAlert from "@/components/ErrorAlert";

export default function LoginPage() {
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
      body: JSON.stringify({ email, password, loginType: "customer" }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    await refreshUser();
    router.push("/customer");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-16 px-4"
      style={{ background: "#F7F4EE" }}
    >
      {/* Card */}
      <div
        className="w-full bg-white rounded-[16px] px-12 py-12"
        style={{
          maxWidth: 480,
          boxShadow: "0 4px 24px rgba(53,34,20,0.10)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-serif font-bold text-2xl text-accent-gold tracking-wide block mb-6">
            Sifra
          </Link>
          <h1 className="font-serif font-bold text-2xl text-primary-dark mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-text-muted">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error */}
        <ErrorAlert error={error} className="mb-6" />

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary-dark mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "#D4A359" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
