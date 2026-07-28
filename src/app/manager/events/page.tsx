"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Pencil, EyeOff, Eye } from "lucide-react";

type Event = {
  EventID: string;
  Title: string;
  Status: string;
  Hidden: boolean;
  EventDate: string;
  StartTime: string;
  EndTime: string;
  MaxParticipants: number;
  Registrations: Array<{ Status: string }>;
};

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => { setEvents(data); setLoading(false); });
  }, []);

  const handleToggleHide = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "PATCH" });
      if (res.ok) {
        const updatedEvent = await res.json();
        setEvents(events.map((e) => (e.EventID === updatedEvent.EventID ? updatedEvent : e)));
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
            Event Management
          </h1>
          <p className="text-text-muted text-sm">Manage upcoming and past events.</p>
        </div>
        <Link
          href="/manager/events/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#352214", color: "#FFFFFF" }}
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {/* Table Card */}
      <div
        className="bg-white rounded-[12px] border border-border-color overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <table className="min-w-full">
          <thead>
            <tr style={{ background: "#F7F4EE", borderBottom: "1px solid #E0DCD3" }}>
              {["Date / Time", "Title", "Status", "Registrations", "Actions"].map((h, i) => (
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
            {events.map((event, i) => {
              const activeRegs = (event.Registrations || []).filter(
                (r) => r.Status === "Registered"
              ).length;

              return (
                <tr
                  key={event.EventID}
                  style={{ borderBottom: i < events.length - 1 ? "1px solid #E0DCD3" : "none" }}
                >
                  {/* Date/Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-semibold text-primary-dark">
                      {new Date(event.EventDate).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                    <div className="text-text-muted text-xs mt-0.5">
                      {event.StartTime} – {event.EndTime}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 text-sm font-semibold text-primary-dark whitespace-nowrap">
                    {event.Title}
                  </td>

                  {/* Status badges */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span
                        className="badge text-xs"
                        style={
                          event.Status === "Upcoming"
                            ? { background: "#E2F0D9", color: "#385723" }
                            : event.Status === "Completed"
                            ? { background: "#F7F4EE", color: "#706F6F" }
                            : { background: "rgba(212,163,89,0.15)", color: "#D4A359" }
                        }
                      >
                        {event.Status}
                      </span>
                      {event.Hidden && (
                        <span className="badge text-xs" style={{ background: "#FCE4D6", color: "#C65911" }}>
                          Hidden
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Registrations */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {activeRegs} / {event.MaxParticipants > 0 ? event.MaxParticipants : "Unlimited"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/manager/events/${event.EventID}`}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-[4px]"
                        style={{ background: "rgba(212,163,89,0.15)", color: "#D4A359" }}
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </Link>
                      <button
                        onClick={() => handleToggleHide(event.EventID)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-[4px]"
                        style={
                          event.Hidden
                            ? { background: "#E2F0D9", color: "#385723" }
                            : { background: "#FCE4D6", color: "#C65911" }
                        }
                      >
                        {event.Hidden ? (
                          <><Eye className="w-3 h-3" /> Unhide</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Hide</>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center">
                  <CalendarDays className="w-10 h-10 text-border-color mx-auto mb-2" strokeWidth={1} />
                  <p className="text-sm text-text-muted">No events found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
