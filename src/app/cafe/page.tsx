import { prisma } from "@/lib/prisma";
import MenuClient from "./MenuClient";

export const metadata = {
  title: "Our Menu",
  description: "Explore food and drinks at Sifra Café.",
};

export const dynamic = "force-dynamic";

export default async function CafeMenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    orderBy: { Name: "asc" },
  });

  return (
    <div style={{ background: "#F7F4EE" }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-subtitle">What We Serve</p>
          <h1 className="font-serif font-bold text-primary-dark" style={{ fontSize: "2.25rem" }}>
            Our Menu
          </h1>
        </div>

        <MenuClient items={menuItems as any} />
      </div>
    </div>
  );
}
