"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Users } from "lucide-react";

type Event = {
  EventID: number;
  Title: string;
  Description: string | null;
  EventDate: string;
  StartTime: string | null;
  EndTime: string | null;
  MaxParticipants: number;
  CoverImage?: string | null;
};

export default function EventsClient({ events }: { events: Event[] }) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const now = new Date();
  const filtered = events.filter((e) => {
    const d = new Date(e.EventDate);
    return tab === "upcoming" ? d >= now : d < now;
  });

  return (
    <>
      {/* Toggle Filter */}
      <div className="flex justify-center mb-10">
        <div
          className="flex rounded-full p-1 border"
          style={{ borderColor: "#E0DCD3", background: "#F7F4EE" }}
        >
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-semibold capitalize transition-colors"
              style={
                tab === t
                  ? { background: "#352214", color: "#FFFFFF" }
                  : { background: "transparent", color: "#352214" }
              }
            >
              {t === "upcoming" ? "Upcoming Events" : "Past Events"}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="w-12 h-12 text-border-color mx-auto mb-3" strokeWidth={1} />
          <p className="text-text-muted">No {tab} events at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((event) => {
            const d = new Date(event.EventDate);
            const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
            const day = d.getDate();

            return (
              <div
                key={event.EventID}
                className="bg-white rounded-[12px] overflow-hidden border border-border-color flex flex-col"
                style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
              >
                {/* Photo area */}
                <div className="relative h-52 bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center overflow-hidden">
                  {event.CoverImage ? (
                    <img src={event.CoverImage} alt={event.Title} className="w-full h-full object-cover" />
                  ) : (
                    <CalendarDays className="w-16 h-16 text-accent-gold opacity-25" strokeWidth={1} />
                  )}
                  {/* Date badge */}
                  <span
                    className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[6px]"
                    style={{ background: "#352214", color: "#D4A359" }}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    {month} {day}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-primary-dark text-xl mb-2">
                    {event.Title}
                  </h3>
                  {event.Description && (
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">{event.Description}</p>
                  )}

                  <div className="flex flex-col gap-2 text-sm text-text-muted mb-5">
                    {(event.StartTime || event.EndTime) && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent-gold shrink-0" />
                        {event.StartTime}{event.EndTime ? ` – ${event.EndTime}` : ""}
                      </span>
                    )}
                    {event.MaxParticipants > 0 && (
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent-gold shrink-0" />
                        {event.MaxParticipants} seats available
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Link
                      href={`/events/${event.EventID}`}
                      className="block w-full text-center py-3 rounded-[6px] font-semibold text-sm transition-opacity hover:opacity-90"
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
      )}
    </>
  );
}
