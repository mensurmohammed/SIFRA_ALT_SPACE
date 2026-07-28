"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { ArrowLeftRight, BookOpen, Search } from "lucide-react";

export default function BorrowingManagementPage() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
  const closeModal = () => setModalState({ ...modalState, isOpen: false });
  const [loading, setLoading] = useState(true);

  // New Checkout State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [availableCopies, setAvailableCopies] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [checkoutForm, setCheckoutForm] = useState({
    copyId: "",
    customerEmail: "",
    startTime: ""
  });

  // Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnSession, setReturnSession] = useState<any>(null);
  const [returnEndTime, setReturnEndTime] = useState("");
  const [returnFee, setReturnFee] = useState(0);

  const fetchBorrowings = async () => {
    const res = await fetch("/api/borrowings");
    if (res.ok) setBorrowings(await res.json());
    setLoading(false);
  };

  const fetchAvailableCopies = async () => {
    const res = await fetch("/api/books");
    if (res.ok) {
      const books = await res.json();
      const copies = [];
      const cats = new Set<string>();
      
      for (const b of books) {
        if (b.Category?.CategoryName) cats.add(b.Category.CategoryName);
        for (const c of b.Copies) {
          if (c.Status === "Available") {
            copies.push({ 
              ...c, 
              bookTitle: b.Title, 
              author: b.Author,
              category: b.Category?.CategoryName || "",
              coverImage: b.CoverImage
            });
          }
        }
      }
      setAvailableCopies(copies);
      setCategories(Array.from(cats).sort());
    }
  };

  useEffect(() => { 
    fetchBorrowings();
    fetchAvailableCopies();
  }, []);

  const openCheckoutModal = () => {
    const now = new Date();
    // Default to current time, formatted for datetime-local input
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setCheckoutForm({
      copyId: "",
      customerEmail: "",
      startTime: now.toISOString().slice(0, 16)
    });
    setSearchQuery("");
    setSelectedCategory("All");
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.copyId) {
      setModalState({ isOpen: true, message: "Please select a book copy." });
      return;
    }
    const res = await fetch("/api/borrowings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        copyId: checkoutForm.copyId,
        customerEmail: checkoutForm.customerEmail,
        startTime: checkoutForm.startTime ? new Date(checkoutForm.startTime).toISOString() : null
      })
    });
    if (res.ok) {
      setIsCheckoutModalOpen(false);
      setModalState({ isOpen: true, message: "Borrowing session started successfully." });
      fetchBorrowings();
      fetchAvailableCopies();
    } else {
      const err = await res.json();
      setModalState({ isOpen: true, message: err.error || "Failed to start checkout." });
    }
  };

  const openReturnModal = (session: any) => {
    setReturnSession(session);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setReturnEndTime(now.toISOString().slice(0, 16));
    setIsReturnModalOpen(true);
  };

  useEffect(() => {
    if (isReturnModalOpen && returnSession) {
      const calcFee = () => {
        const start = new Date(returnSession.BorrowedAt);
        const end = returnEndTime ? new Date(returnEndTime) : new Date();
        const durationMs = end.getTime() - start.getTime();
        
        if (durationMs < 0) {
          setReturnFee(0);
          return;
        }

        const durationMinutes = durationMs / (1000 * 60);
        const intervals = Math.max(1, Math.ceil(durationMinutes / 15));
        setReturnFee(intervals * 15); // Default display to 15, actual will be calculated on backend
      };
      calcFee();
    }
  }, [returnEndTime, isReturnModalOpen, returnSession]);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnSession) return;
    const res = await fetch(`/api/borrowings/${returnSession.BorrowingID}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endTime: returnEndTime ? new Date(returnEndTime).toISOString() : null
      })
    });
    if (res.ok) {
      setIsReturnModalOpen(false);
      setModalState({ isOpen: true, message: "Book returned and fee calculated successfully." });
      fetchBorrowings();
    } else {
      const err = await res.json();
      setModalState({ isOpen: true, message: err.error || "Failed to return book." });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-border-color animate-pulse rounded-[6px]" />
        <div className="bg-white rounded-[12px] border border-border-color p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-border-color/50 animate-pulse rounded-[6px]" />
          ))}
        </div>
      </div>
    );
  }

  // Filtered copies for modal
  const filteredCopies = availableCopies.filter(c => {
    const matchesSearch = c.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedCopy = availableCopies.find(c => c.CopyID === checkoutForm.copyId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
            Checkout Desk
          </h1>
          <p className="text-text-muted text-sm">Manage book borrowings and returns.</p>
        </div>
        <button
          onClick={openCheckoutModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#352214", color: "#FFFFFF" }}
        >
          <ArrowLeftRight className="w-4 h-4" />
          New Borrowing
        </button>
      </div>

      <div
        className="bg-white rounded-[12px] border border-border-color overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <table className="min-w-full">
          <thead>
            <tr style={{ background: "#F7F4EE", borderBottom: "1px solid #E0DCD3" }}>
              {["Customer", "Book", "Time", "Status", "Action"].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-widest ${i === 4 ? "text-right" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {borrowings.map((b, i) => (
              <tr
                key={b.BorrowingID}
                style={{ borderBottom: i < borrowings.length - 1 ? "1px solid #E0DCD3" : "none" }}
              >
                <td className="px-6 py-4 text-sm font-semibold text-primary-dark whitespace-nowrap">
                  {b.User ? `${b.User.FirstName} ${b.User.LastName}` : b.CustomerEmail || "Walk-in Guest"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold text-primary-dark">{b.Copy?.Book?.Title}</div>
                  <div className="text-xs text-text-muted">Barcode: {b.Copy?.Barcode}</div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <div className="text-text-muted">
                    Start: {new Date(b.BorrowedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  {b.ReturnedAt && (
                    <div className="text-text-muted">
                      End: {new Date(b.ReturnedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  )}
                  {b.AmountCharged != null && (
                    <div className="text-accent-gold font-bold mt-1 text-xs">
                      Fee: {b.AmountCharged} Birr
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="badge text-xs"
                    style={
                      b.Status === "Active"
                        ? { background: "#FCE4D6", color: "#C65911" }
                        : { background: "#E2F0D9", color: "#385723" }
                    }
                  >
                    {b.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {b.Status === "Active" ? (
                    <button
                      onClick={() => openReturnModal(b)}
                      className="text-xs font-bold px-3 py-1 rounded-[4px] transition-opacity hover:opacity-80"
                      style={{ background: "rgba(212,163,89,0.15)", color: "#D4A359" }}
                    >
                      Return & Pay
                    </button>
                  ) : (
                    <span className="text-xs text-text-muted">Completed</span>
                  )}
                </td>
              </tr>
            ))}
            {borrowings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-text-muted">
                  <BookOpen className="w-10 h-10 text-border-color mx-auto mb-2" strokeWidth={1} />
                  No borrowing records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        message={modalState.message}
        onConfirm={closeModal}
        onCancel={closeModal}
      />

      {/* New Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-[12px] shadow-lg max-w-lg w-full overflow-hidden my-8">
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold text-primary-dark mb-4">New Borrowing Session</h3>
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {/* Book Search and Filter */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">Search & Select Book</label>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by title or author..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-border-color rounded-[6px] focus:outline-none focus:border-accent-gold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="px-4 py-2 rounded-[6px] border border-border-color focus:outline-none focus:border-accent-gold text-sm bg-white"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <select
                    className="w-full px-4 py-2 rounded-[6px] border border-border-color focus:outline-none focus:border-accent-gold text-sm"
                    value={checkoutForm.copyId}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, copyId: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select an available copy from results ({filteredCopies.length})</option>
                    {filteredCopies.map((c) => (
                      <option key={c.CopyID} value={c.CopyID}>
                        {c.bookTitle} — {c.author} (Barcode: {c.Barcode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Book Details Box */}
                {selectedCopy && (
                  <div className="bg-primary-light p-4 rounded-[8px] flex gap-4 items-start border border-border-color/50 mt-2">
                    {selectedCopy.coverImage ? (
                      <img src={selectedCopy.coverImage} alt={selectedCopy.bookTitle} className="w-16 h-24 object-cover rounded shadow-sm" />
                    ) : (
                      <div className="w-16 h-24 bg-border-color/30 rounded flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-text-muted" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-primary-dark text-sm">{selectedCopy.bookTitle}</h4>
                      <p className="text-xs text-text-muted mb-1">{selectedCopy.author}</p>
                      <span className="badge text-[10px]" style={{ background: "#F7F4EE", color: "#D4A359" }}>{selectedCopy.category}</span>
                      <p className="text-xs text-text-muted mt-2 font-mono">Barcode: {selectedCopy.Barcode}</p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <label className="block text-sm font-semibold text-primary-dark mb-1">Customer Email (Optional)</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-[6px] border border-border-color focus:outline-none focus:border-accent-gold text-sm"
                    value={checkoutForm.customerEmail}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, customerEmail: e.target.value })}
                    placeholder="Enter customer email if applicable"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-1">Start Time Override</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 rounded-[6px] border border-border-color focus:outline-none focus:border-accent-gold text-sm"
                    value={checkoutForm.startTime}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, startTime: e.target.value })}
                    required
                  />
                  <p className="text-xs text-text-muted mt-1">Time will be automatically rounded down to the nearest 15-minute interval upon saving.</p>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border-color mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="px-4 py-2 rounded-[6px] text-sm font-semibold border border-border-color text-text-muted hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[6px] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#352214" }}
                    disabled={!checkoutForm.copyId}
                  >
                    Start Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnModalOpen && returnSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[12px] shadow-lg max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold text-primary-dark mb-4">Complete Borrowing Session</h3>
              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div className="bg-primary-light p-4 rounded-[6px] text-sm mb-4">
                  <div className="font-semibold text-primary-dark mb-1">{returnSession.Copy?.Book?.Title}</div>
                  <div className="text-text-muted mb-2">Started: {new Date(returnSession.BorrowedAt).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-1">End Time Override</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 rounded-[6px] border border-border-color focus:outline-none focus:border-accent-gold text-sm"
                    value={returnEndTime}
                    onChange={(e) => setReturnEndTime(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between items-center py-4 border-t border-b border-border-color my-4">
                  <span className="text-sm font-semibold text-primary-dark">Estimated Fee</span>
                  <span className="text-xl font-bold text-accent-gold">{returnFee} Birr</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReturnModalOpen(false)}
                    className="px-4 py-2 rounded-[6px] text-sm font-semibold border border-border-color text-text-muted hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[6px] text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "#D4A359" }}
                  >
                    Confirm Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
