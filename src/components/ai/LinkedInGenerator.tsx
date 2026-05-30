"use client";

import { useState } from "react";
import type { LinkedInVariant } from "@/types";

interface LinkedInGeneratorProps {
  eventId: string;
  attended: boolean;
}

export function LinkedInGenerator({ eventId, attended }: LinkedInGeneratorProps) {
  const [takeaways, setTakeaways] = useState("");
  const [variants, setVariants] = useState<LinkedInVariant[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  if (!attended) {
    return (
      <div className="border border-[#E8E8E3] bg-white p-5">
        <p className="text-sm text-[#6B6B63]">
          Mark yourself as attended to generate a LinkedIn post.
        </p>
      </div>
    );
  }

  async function generate() {
    if (!takeaways.trim() || loading) return;
    setLoading(true);
    setError("");
    setVariants(null);

    try {
      const res = await fetch("/api/ai/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, takeaways }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate post");
        return;
      }

      setVariants(data.variants);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="border border-[#E8E8E3] bg-white">
      <div className="p-5 border-b border-[#E8E8E3]">
        <h3 className="font-bold text-base mb-1">
          Turn this into a LinkedIn post
        </h3>
        <p className="text-sm text-[#6B6B63]">
          Tell us what you learned or experienced. We&apos;ll write 3 variants in your
          voice.
        </p>
      </div>

      <div className="p-5">
        {!variants ? (
          <>
            <textarea
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              placeholder="What happened? What did you learn? Who did you meet? What will you do differently?"
              rows={4}
              maxLength={2000}
              className="w-full border border-[#E8E8E3] p-3 text-sm resize-none focus:outline-none focus:border-[#0F0F0E] bg-[#FAFAF7] mb-3"
            />
            {error && (
              <p className="text-sm text-[#C84B31] mb-3">{error}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#6B6B63]">
                {takeaways.length}/2000
              </span>
              <button
                onClick={generate}
                disabled={loading || !takeaways.trim()}
                className="bg-[#0F0F0E] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#C84B31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Writing..." : "Generate 3 variants"}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-5">
            {variants.map((variant, i) => (
              <div key={i} className="border border-[#E8E8E3] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63]">
                    {variant.label}
                  </span>
                  <button
                    onClick={() => copyToClipboard(variant.content, `${i}`)}
                    className={`text-xs font-medium px-3 py-1 border transition-colors ${
                      copied === `${i}`
                        ? "border-[#C84B31] text-[#C84B31]"
                        : "border-[#E8E8E3] text-[#6B6B63] hover:border-[#0F0F0E] hover:text-[#0F0F0E]"
                    }`}
                  >
                    {copied === `${i}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-sm font-semibold text-[#0F0F0E] mb-2 leading-snug">
                  {variant.hook}
                </p>
                <p className="text-sm text-[#6B6B63] leading-relaxed whitespace-pre-wrap">
                  {variant.content}
                </p>
              </div>
            ))}
            <button
              onClick={() => {
                setVariants(null);
                setTakeaways("");
              }}
              className="text-sm text-[#6B6B63] hover:text-[#0F0F0E] transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
