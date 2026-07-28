import Link from "next/link";
import { BookOpen, Coffee, Users } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about Sifra — a quiet book café and alternative space in Addis Ababa.",
};

const values = [
  {
    icon: BookOpen,
    title: "Knowledge",
    desc: "We believe access to books and ideas should be open to everyone. Our curated collection is free to explore and borrow.",
  },
  {
    icon: Coffee,
    title: "Quality",
    desc: "From our ethically sourced single-origin beans to every hand-crafted pastry, we pursue quality in everything we serve.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Sifra is more than a café — it is a gathering place for curious minds, creatives, and community builders.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#F7F4EE" }} className="min-h-screen">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <section
        style={{ background: "#352214" }}
        className="py-20 px-4 md:px-8 text-center"
      >
        <h1
          className="font-serif font-bold text-white mb-4"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          About Sifra
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-base leading-relaxed">
          A quiet corner in Addis Ababa where great coffee meets carefully
          curated books and meaningful human connection.
        </p>
      </section>

      {/* ─── Our Story ───────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Image */}
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
              alt="Sifra café atmosphere"
              className="w-full h-80 md:h-96 object-cover rounded-[12px] shadow-soft-md"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="section-subtitle">Our Story</p>
            <h2 className="font-serif font-bold text-primary-dark text-3xl mb-6">
              Where It All Began
            </h2>
            <div className="space-y-4 text-text-muted leading-relaxed text-base">
              <p>
                Sifra started with a simple idea: what if the best coffee in
                Addis Ababa also came with the best books? In 2021, we opened
                our doors in the heart of the city, bringing together specialty
                coffee, a curated library, and a warm space for the community to
                gather.
              </p>
              <p>
                The name &ldquo;Sifra&rdquo; comes from the Amharic concept of
                a quiet, thoughtful space — one set apart for reflection and
                conversation. We built this place with that spirit in mind.
              </p>
              <p>
                Today, Sifra hosts book clubs, poetry readings, film
                discussions, and community events. We are proud to be a home for
                Addis Ababa&apos;s curious, creative, and community-minded
                residents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Panel ───────────────────────────────────── */}
      <section
        style={{ background: "#352214" }}
        className="py-16 px-4 md:px-8 text-center"
      >
        <h2 className="font-serif font-bold text-white text-3xl mb-3">
          Experience Sifra Today
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-sm">
          Order your favorite drink, browse our collection, or join an upcoming
          event. We&apos;d love to have you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/cafe"
            className="px-6 py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#D4A359", color: "#352214" }}
          >
            Order Now
          </Link>
          <Link
            href="/books"
            className="px-6 py-3 rounded-[6px] font-semibold text-sm border border-white text-white hover:bg-white/10 transition-colors"
          >
            View Books
          </Link>
        </div>
      </section>

      {/* ─── Our Values ──────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">What We Stand For</p>
          <h2 className="section-title">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center flex flex-col items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "#FDF8F0" }}
              >
                <Icon
                  className="w-8 h-8"
                  style={{ color: "#D4A359" }}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-serif font-bold text-primary-dark text-xl">{title}</h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
