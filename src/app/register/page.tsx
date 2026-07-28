"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, MapPin, AlertCircle } from "lucide-react";

import ErrorAlert from "@/components/ErrorAlert";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/login");
  };

  const field = (
    key: keyof typeof formData,
    label: string,
    type: string,
    placeholder: string,
    Icon: React.ElementType,
    required = true
  ) => (
    <div>
      <label className="block text-sm font-semibold text-primary-dark mb-1.5">
        {label}
        {!required && <span className="text-text-muted font-normal ml-1">(Optional)</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type={type}
          required={required}
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          placeholder={placeholder}
          className="input pl-10"
          style={{ height: 48 }}
        />
      </div>
    </div>
  );

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
          <Link
            href="/"
            className="font-serif font-bold text-2xl text-accent-gold tracking-wide block mb-6"
          >
            Sifra
          </Link>
          <h1 className="font-serif font-bold text-2xl text-primary-dark mb-2">
            Join Sifra
          </h1>
          <p className="text-sm text-text-muted">
            Create your account to borrow books and register for events
          </p>
        </div>

        {/* Error */}
        <ErrorAlert error={error} className="mb-6" />

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-1.5">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Abebe"
                  className="input pl-10"
                  style={{ height: 48 }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Bekele"
                  className="input pl-10"
                  style={{ height: 48 }}
                />
              </div>
            </div>
          </div>

          {field("email", "Email", "email", "you@example.com", Mail)}
          {field("password", "Password", "password", "••••••••", Lock)}
          {field("phone", "Phone", "text", "+251 9XX XXX XXX", Phone, false)}

          {/* Address (textarea) */}
          <div>
            <label className="block text-sm font-semibold text-primary-dark mb-1.5">
              Address{" "}
              <span className="text-text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted pointer-events-none" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Addis Ababa, Ethiopia"
                className="textarea pl-10"
                rows={3}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
            style={{ background: "#352214", color: "#FFFFFF" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "#D4A359" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
