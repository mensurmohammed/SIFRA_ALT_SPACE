"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send (no backend endpoint yet)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  const contactCards = [
    {
      icon: MapPin,
      title: "Address",
      detail: "Addis Ababa, Ethiopia",
    },
    {
      icon: Phone,
      title: "Phone",
      detail: "+251 911 000 000",
    },
    {
      icon: Mail,
      title: "Email",
      detail: "hello@sifra.et",
    },
  ];

  return (
    <div style={{ background: "#F7F4EE" }} className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-subtitle">Get In Touch</p>
          <h1 className="section-title" style={{ fontSize: "2.25rem" }}>
            Contact Us
          </h1>
        </div>

        {/* Form Card */}
        <div className="flex justify-center mb-12">
          <div
            className="w-full bg-white rounded-[16px] p-10"
            style={{
              maxWidth: 720,
              boxShadow: "0 4px 24px rgba(53,34,20,0.08)",
            }}
          >
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center gap-4">
                <CheckCircle className="w-12 h-12" style={{ color: "#385723" }} />
                <h2 className="font-serif font-bold text-primary-dark text-2xl">
                  Message Sent!
                </h2>
                <p className="text-text-muted text-sm">
                  Thank you for reaching out. We&apos;ll get back to you within
                  24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="text-sm font-semibold hover:underline mt-2"
                  style={{ color: "#D4A359" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-1.5">
                    Name <span style={{ color: "#D4A359" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="input"
                    style={{ height: 48 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-1.5">
                    Email <span style={{ color: "#D4A359" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input"
                    style={{ height: 48 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-1.5">
                    Message <span style={{ color: "#D4A359" }}>*</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="textarea"
                    rows={5}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#352214", color: "#FFFFFF" }}
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="bg-white rounded-[12px] p-8 text-center border border-border-color flex flex-col items-center gap-3"
              style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "#FDF8F0" }}
              >
                <Icon className="w-5 h-5" style={{ color: "#D4A359" }} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-primary-dark">{title}</h3>
              <p className="text-sm text-text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
