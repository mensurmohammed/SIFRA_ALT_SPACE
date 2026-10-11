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
    <div className="max-w-3xl space-y-6 min-w-0 max-w-full sm:max-w-3xl">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1 text-2xl sm:text-3xl">
          System Settings
        </h1>
        <p className="text-text-muted text-xs sm:text-sm">Configure library rules and café operations.</p>
      </div>

      <div
        className="bg-white rounded-[12px] border border-border-color p-4 sm:p-8 space-y-6 sm:space-y-8"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        {/* Library Rules */}
        <div>
          <h2 className="font-serif font-bold text-primary-dark text-base sm:text-lg mb-4 sm:mb-5 pb-3 border-b border-border-color">
            Library Rules
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-1 border-b sm:border-b-0 border-gray-100 pb-3 sm:pb-0">
              <label className="text-sm font-semibold text-primary-dark">Maximum Borrowing Duration (Days)</label>
              <input
                type="number"
                value={settings.max_borrowing_duration_days}
                onChange={(e) => handleChange("max_borrowing_duration_days", e.target.value)}
                className="border border-border-color rounded-[6px] p-2.5 sm:p-2 w-full sm:w-28 text-left sm:text-center text-base sm:text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold min-h-[44px] sm:min-h-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-1 border-b sm:border-b-0 border-gray-100 pb-3 sm:pb-0">
              <label className="text-sm font-semibold text-primary-dark">Maximum Books Per Customer</label>
              <input
                type="number"
                value={settings.max_books_per_customer}
                onChange={(e) => handleChange("max_books_per_customer", e.target.value)}
                className="border border-border-color rounded-[6px] p-2.5 sm:p-2 w-full sm:w-28 text-left sm:text-center text-base sm:text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold min-h-[44px] sm:min-h-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-1 border-b sm:border-b-0 border-gray-100 pb-3 sm:pb-0">
              <label className="text-sm font-semibold text-primary-dark">Late Return Fine (ETB per day)</label>
              <input
                type="number"
                value={settings.late_return_fine}
                onChange={(e) => handleChange("late_return_fine", e.target.value)}
                className="border border-border-color rounded-[6px] p-2.5 sm:p-2 w-full sm:w-28 text-left sm:text-center text-base sm:text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold min-h-[44px] sm:min-h-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-1">
              <label className="text-sm font-semibold text-primary-dark">Quarter-Hour Borrowing Rate (Birr)</label>
              <input
                type="number"
                value={settings.borrowing_rate_quarter_hour}
                onChange={(e) => handleChange("borrowing_rate_quarter_hour", e.target.value)}
                className="border border-border-color rounded-[6px] p-2.5 sm:p-2 w-full sm:w-28 text-left sm:text-center text-base sm:text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold min-h-[44px] sm:min-h-0"
              />
            </div>
          </div>
        </div>

        {/* Café Settings */}
        <div>
          <h2 className="font-serif font-bold text-primary-dark text-base sm:text-lg mb-4 sm:mb-5 pb-3 border-b border-border-color">
            Café Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 py-1">
              <label htmlFor="accept_digital_payments" className="text-sm font-semibold text-primary-dark cursor-pointer">
                Accept Digital Payments
              </label>
              <input 
                id="accept_digital_payments"
                type="checkbox" 
                checked={settings.accept_digital_payments === "true"} 
                onChange={(e) => handleChange("accept_digital_payments", e.target.checked ? "true" : "false")}
                className="h-5 w-5 accent-accent-gold cursor-pointer" 
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-1">
              <label className="text-sm font-semibold text-primary-dark">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.tax_rate}
                onChange={(e) => handleChange("tax_rate", e.target.value)}
                className="border border-border-color rounded-[6px] p-2.5 sm:p-2 w-full sm:w-28 text-left sm:text-center text-base sm:text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-gold min-h-[44px] sm:min-h-0"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 sm:py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90 min-h-[44px] flex items-center justify-center shadow-xs"
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