"use client";

import { Coffee } from "lucide-react";

type MenuItem = {
  MenuItemID: number;
  Name: string;
  Description: string | null;
  Price: number;
  Category: string | null;
  Status: string;
  ImageUrl?: string | null;
};

export default function MenuClient({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Coffee className="w-12 h-12 text-border-color mx-auto mb-3" strokeWidth={1} />
        <p className="text-text-muted">No menu items available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.MenuItemID}
          className="bg-white rounded-[12px] overflow-hidden border border-border-color flex flex-col"
          style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
        >
          {/* Image area */}
          <div className="h-44 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
            {item.ImageUrl ? (
              <img src={item.ImageUrl} alt={item.Name} className="w-full h-full object-cover" />
            ) : (
              <Coffee className="w-14 h-14 text-accent-gold opacity-30" strokeWidth={1} />
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-serif font-bold text-primary-dark text-base mb-1">{item.Name}</h3>
            {item.Description && (
              <p className="text-xs text-text-muted italic mb-4 line-clamp-2">{item.Description}</p>
            )}
            {item.Status === "Unavailable" && (
              <span className="badge-unavailable mb-2 self-start">Unavailable</span>
            )}

            {/* Price row */}
            <div className="mt-auto pt-3 border-t border-border-color">
              <span className="font-bold text-base" style={{ color: "#D4A359" }}>
                {item.Price} ETB
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
