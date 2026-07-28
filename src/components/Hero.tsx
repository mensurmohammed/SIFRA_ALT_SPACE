"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
  "https://images.unsplash.com/photo-1485322551133-3a4c27a9d925?w=800&q=80",
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    setActive((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section style={{ background: "#352214" }} className="overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[560px]">
        {/* Left – Text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-14 md:py-20">
          <h1 className="font-serif font-bold leading-tight mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            <span className="text-white">Coffee, Books</span>
            <br />
            <span style={{ color: "#D4A359" }}>&amp; Meaningful Moments</span>
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            Enjoy great coffee, explore curated books, attend inspiring events —
            and become part of our community.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/books"
              className="px-6 py-3 font-semibold rounded-[6px] transition-opacity hover:opacity-90 text-sm"
              style={{ background: "#D4A359", color: "#352214" }}
            >
              Explore Books
            </Link>
            <Link
              href="/cafe"
              className="px-6 py-3 font-semibold rounded-[6px] border text-sm transition-colors hover:bg-white/10"
              style={{ borderColor: "#D4A359", color: "#D4A359" }}
            >
              View Our Menu
            </Link>
          </div>
        </div>

        {/* Right – Image */}
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-6 md:py-10">
          <div className="w-full">
            <img
              src={heroImages[active]}
              alt="Sifra atmosphere"
              onClick={handleTap}
              className="w-full aspect-[16/9] object-cover rounded-[12px] shadow-xl cursor-pointer transition-opacity duration-300"
            />
            {/* Slider dots */}
            <div className="flex justify-center gap-2 mt-4">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="w-2.5 h-2.5 rounded-full transition-colors"
                  style={{
                    background: i === active ? "#D4A359" : "#706F6F",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
