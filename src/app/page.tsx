import Hero from "@/components/Hero";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Coffee,
  BookOpen,
  FolderOpen,
  ShoppingBag,
  CalendarDays,
  Clock,
  Users,
  Plus,
} from "lucide-react";

export const metadata = {
  title: "Sifra | Library & Café",
  description: "Coffee, books, and meaningful moments in Addis Ababa.",
};

export const dynamic = "force-dynamic";

const featureCards = [
  {
    icon: Coffee,
    title: "Specialty Coffee",
    desc: "Ethically sourced, expertly crafted single-origin brews.",
  },
  {
    icon: BookOpen,
    title: "Curated Library",
    desc: "Hundreds of titles across every genre, free to borrow.",
  },
  {
    icon: FolderOpen,
    title: "Private Spaces",
    desc: "Quiet rooms and cozy nooks for focused reading or work.",
  },
  {
    icon: ShoppingBag,
    title: "Community Shop",
    desc: "Local art, zines, and handcrafted goods to browse and buy.",
  },
];

const bookCategories = [
  { label: "Fiction", color: "#FCE4D6" },
  { label: "Non-Fiction", color: "#E2F0D9" },
  { label: "Children's", color: "#FFF4CC" },
  { label: "Business", color: "#E8EAF6" },
  { label: "Education", color: "#F3E5F5" },
  { label: "Self-Help", color: "#E0F7FA" },
];

export default async function HomePage() {
  let menuItems: any[] = [];
  let events: any[] = [];

  try {
    [menuItems, events] = await Promise.all([
      prisma.menuItem.findMany({ take: 3, orderBy: { Name: "asc" } }),
      prisma.event.findMany({
        where: { Hidden: false },
        take: 3,
        orderBy: { EventDate: "asc" },
      }),
    ]);
  } catch {
    // silently handle DB errors on home page
  }

  return (
    <main>
      <Hero />

      {/* ─── Features Row ───────────────────────────────── */}
      <section style={{ background: "#F7F4EE" }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-[12px] p-6 text-center flex flex-col items-center gap-3"
                style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                  style={{ background: "#FDF8F0" }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#D4A359" }} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-base text-primary-dark">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Most Loved Coffees ─────────────────────────── */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-subtitle">Crafted Selections</p>
          <h2 className="section-title">Our Most Loved Coffees</h2>
        </div>

        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.MenuItemID}
                className="bg-white rounded-[12px] overflow-hidden border border-border-color"
                style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
              >
                <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  {item.ImageUrl ? (
                    <img src={item.ImageUrl} alt={item.Name} className="w-full h-full object-cover" />
                  ) : (
                    <Coffee className="w-16 h-16 text-accent-gold opacity-40" strokeWidth={1} />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif font-bold text-primary-dark text-lg">{item.Name}</h3>
                    <span className="font-semibold text-sm" style={{ color: "#D4A359" }}>
                      {item.Price} ETB
                    </span>
                  </div>
                  {item.Description && (
                    <p className="text-sm text-text-muted mb-4 line-clamp-2 italic">{item.Description}</p>
                  )}
                  <button
                    className="w-full py-2.5 rounded-[6px] text-sm font-semibold transition-colors"
                    style={{ background: "#F7F4EE", color: "#352214" }}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Habesha Blend", "Yirgacheffe Pour-Over", "Spiced Macchiato"].map((name, i) => (
              <div
                key={name}
                className="bg-white rounded-[12px] overflow-hidden border border-border-color"
                style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
              >
                <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  <Coffee className="w-16 h-16 text-accent-gold opacity-40" strokeWidth={1} />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-primary-dark">{name}</h3>
                    <span className="font-semibold text-sm" style={{ color: "#D4A359" }}>
                      {75 + i * 15} ETB
                    </span>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-[6px] text-sm font-semibold mt-3"
                    style={{ background: "#F7F4EE", color: "#352214" }}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/cafe"
            className="inline-block px-8 py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#352214", color: "#FFFFFF" }}
          >
            Explore Full Menu
          </Link>
        </div>
      </section>

      {/* ─── Upcoming Events ────────────────────────────── */}
      <section style={{ background: "#F7F4EE" }} className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-subtitle">What&apos;s On</p>
            <h2 className="section-title">Upcoming Events</h2>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => {
                const d = new Date(event.EventDate);
                const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                const day = d.getDate();
                return (
                  <div
                    key={event.EventID}
                    className="bg-white rounded-[12px] overflow-hidden border border-border-color flex flex-col"
                    style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
                  >
                    <div className="relative h-44 bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center">
                      <CalendarDays className="w-16 h-16 text-accent-gold opacity-30" strokeWidth={1} />
                      {/* Date tag */}
                      <span
                        className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-[6px]"
                        style={{ background: "#352214", color: "#D4A359" }}
                      >
                        <CalendarDays className="w-3 h-3" />
                        {month} {day}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-serif font-bold text-primary-dark text-lg mb-2">{event.Title}</h3>
                      {event.Description && (
                        <p className="text-sm text-text-muted mb-4 line-clamp-2">{event.Description}</p>
                      )}
                      <div className="flex flex-col gap-1.5 mb-4 text-xs text-text-muted">
                        {event.StartTime && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {event.StartTime}{event.EndTime ? ` – ${event.EndTime}` : ""}
                          </span>
                        )}
                        {event.MaxParticipants > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {event.MaxParticipants} seats
                          </span>
                        )}
                      </div>
                      <div className="mt-auto">
                        <Link
                          href={`/events/${event.EventID}`}
                          className="block w-full text-center py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
                          style={{ background: "#352214", color: "#FFFFFF" }}
                        >
                          Register Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-text-muted py-8">No upcoming events right now. Check back soon!</p>
          )}
        </div>
      </section>

      {/* ─── Explore Books by Category ──────────────────── */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-subtitle">Discover</p>
          <h2 className="section-title">Explore Our Books by Category</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {bookCategories.map(({ label, color }) => (
            <Link
              key={label}
              href={`/books?category=${encodeURIComponent(label)}`}
              className="flex flex-col items-center gap-3 bg-white rounded-[12px] px-6 py-5 border border-border-color hover:shadow-soft-md transition-shadow min-w-[120px]"
              style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: color }}
              >
                <BookOpen className="w-6 h-6 text-primary-dark" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-semibold text-primary-dark text-center">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}