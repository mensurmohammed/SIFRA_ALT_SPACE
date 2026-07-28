"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    max_borrowing_duration_days: "14",
    max_books_per_customer: "3",
    late_return_fine: "5",
    accept_digital_payments: "true",
    tax_rate: "15",
    borrowing_rate_quarter_hour: "15"
  });
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      setModalState({ isOpen: true, message: "Settings saved successfully." });
    } else {
      setModalState({ isOpen: true, message: "Failed to save settings." });
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) return <div className="animate-pulse h-32 bg-border-color rounded-[12px] max-w-3xl"></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          System Settings
        </h1>
        <p className="text-text-muted text-sm">Configure library rules and café operations.</p>
      </div>

      <div
        className="bg-white rounded-[12px] border border-border-color p-8 space-y-8"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        {/* Library Rules */}
        <div>
          <h2 className="font-serif font-bold text-primary-dark text-lg mb-5 pb-3 border-b border-border-color">
            Library Rules
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-dark">Maximum Borrowing Duration (Days)</span>
              <input
                type="number"
                value={settings.max_borrowing_duration_days}
                onChange={(e) => handleChange("max_borrowing_duration_days", e.target.value)}
                className="border border-border-color rounded-[6px] p-2 w-24 text-center text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-dark">Maximum Books Per Customer</span>
              <input
                type="number"
                value={settings.max_books_per_customer}
                onChange={(e) => handleChange("max_books_per_customer", e.target.value)}
                className="border border-border-color rounded-[6px] p-2 w-24 text-center text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-dark">Late Return Fine (ETB per day)</span>
              <input
                type="number"
                value={settings.late_return_fine}
                onChange={(e) => handleChange("late_return_fine", e.target.value)}
                className="border border-border-color rounded-[6px] p-2 w-24 text-center text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-dark">Quarter-Hour Borrowing Rate (Birr)</span>
              <input
                type="number"
                value={settings.borrowing_rate_quarter_hour}
                onChange={(e) => handleChange("borrowing_rate_quarter_hour", e.target.value)}
                className="border border-border-color rounded-[6px] p-2 w-24 text-center text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              />
            </div>
          </div>
        </div>

        {/* Café Settings */}
        <div>
          <h2 className="font-serif font-bold text-primary-dark text-lg mb-5 pb-3 border-b border-border-color">
            Café Settings
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-dark">Accept Digital Payments</span>
              <input 
                type="checkbox" 
                checked={settings.accept_digital_payments === "true"} 
                onChange={(e) => handleChange("accept_digital_payments", e.target.checked ? "true" : "false")}
                className="h-5 w-5 accent-accent-gold" 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary-dark">Tax Rate (%)</span>
              <input
                type="number"
                value={settings.tax_rate}
                onChange={(e) => handleChange("tax_rate", e.target.value)}
                className="border border-border-color rounded-[6px] p-2 w-24 text-center text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: "#352214", color: "#FFFFFF" }}
        >
          Save Settings
        </button>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        message={modalState.message}
        onConfirm={() => setModalState({ ...modalState, isOpen: false })}
        onCancel={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
}
