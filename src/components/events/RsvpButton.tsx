"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RsvpStatus } from "@/types";

interface RsvpButtonProps {
  eventId: string;
  currentStatus?: RsvpStatus | null;
  goingCount: number;
}

const OPTIONS: { value: RsvpStatus; label: string }[] = [
  { value: "GOING", label: "Going" },
  { value: "INTERESTED", label: "Interested" },
  { value: "MISSED", label: "Can't make it" },
];

export function RsvpButton({ eventId, currentStatus, goingCount }: RsvpButtonProps) {
  const [status, setStatus] = useState<RsvpStatus | null>(currentStatus ?? null);
  const [count, setCount] = useState(goingCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRsvp(newStatus: RsvpStatus) {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status: newStatus }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed");

      const wasGoing = status === "GOING";
      const willBeGoing = newStatus === "GOING";

      setStatus(newStatus);
      if (wasGoing && !willBeGoing) setCount((c) => Math.max(0, c - 1));
      if (!wasGoing && willBeGoing) setCount((c) => c + 1);

      router.refresh();
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleRsvp(opt.value)}
            disabled={loading}
            className={`px-5 py-2 text-sm font-semibold transition-colors border disabled:opacity-50 ${
              status === opt.value
                ? "bg-[#0F0F0E] text-white border-[#0F0F0E]"
                : "bg-white text-[#0F0F0E] border-[#E8E8E3] hover:border-[#C84B31] hover:text-[#C84B31]"
            }`}
          >
            {opt.label}
            {opt.value === "GOING" && status === "GOING" && " ✓"}
          </button>
        ))}
      </div>
      {count > 0 && (
        <p className="text-sm text-[#6B6B63]">
          {count} {count === 1 ? "student" : "students"} going
        </p>
      )}
    </div>
  );
}
