"use client";

import { useState } from "react";
import type { PreEventBrief } from "@/types";

interface PreEventBriefProps {
  eventId: string;
}

export function PreEventBriefComponent({ eventId }: PreEventBriefProps) {
  const [brief, setBrief] = useState<PreEventBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function fetchBrief() {
    if (brief) {
      setOpen(!open);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/pre-event-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate brief");
        return;
      }

      setBrief(data.brief);
      setOpen(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-[#E8E8E3] bg-white">
      <div className="p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">Your brief</h3>
          <p className="text-sm text-[#6B6B63] mt-0.5">
            What to expect, what to bring, and how to show up.
          </p>
        </div>
        <button
          onClick={fetchBrief}
          disabled={loading}
          className="bg-[#0F0F0E] text-white px-5 py-2 text-sm font-semibold hover:bg-[#C84B31] transition-colors disabled:opacity-50 flex-shrink-0 ml-4"
        >
          {loading ? "Generating..." : brief ? (open ? "Hide" : "Show brief") : "Get brief"}
        </button>
      </div>

      {error && (
        <div className="px-5 pb-5">
          <p className="text-sm text-[#C84B31]">{error}</p>
        </div>
      )}

      {brief && open && (
        <div className="border-t border-[#E8E8E3] p-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-2">
              What to expect
            </p>
            <p className="text-sm text-[#0F0F0E] leading-relaxed">
              {brief.whatToExpect}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-2">
              Conversation starters
            </p>
            <ul className="space-y-1.5">
              {brief.conversationStarters.map((s, i) => (
                <li key={i} className="text-sm text-[#0F0F0E] flex gap-2">
                  <span className="text-[#C84B31] font-bold flex-shrink-0">
                    —
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-2">
              Bring this
            </p>
            <ul className="space-y-1">
              {brief.whatToBring.map((item, i) => (
                <li key={i} className="text-sm text-[#0F0F0E]">
                  · {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-2">
              Networking tip
            </p>
            <p className="text-sm text-[#0F0F0E] leading-relaxed border-l-2 border-[#C84B31] pl-3">
              {brief.networkingTip}
            </p>
          </div>

          <div className="bg-[#FAFAF7] p-4 border border-[#E8E8E3]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-1">
              Mindset
            </p>
            <p className="text-sm font-medium text-[#0F0F0E]">
              {brief.mindsetPrimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
