import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";

export const metadata = {
  title: "Events",
  description: "Upcoming and past events at Sifra.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { Hidden: false },
    orderBy: { EventDate: "asc" },
  });

  // Serialize dates for client component
  const serialized = events.map((e) => ({
    ...e,
    EventDate: e.EventDate.toISOString(),
  }));

  return (
    <div style={{ background: "#F7F4EE" }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-subtitle">Join Us</p>
          <h1 className="font-serif font-bold text-primary-dark" style={{ fontSize: "2.25rem" }}>
            Events at Sifra
          </h1>
        </div>

        <EventsClient events={serialized as any} />
      </div>
    </div>
  );
}
