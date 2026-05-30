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
      <div className="relative overflow-hidden border border-[#E8E8E3] bg-white p-5 shadow-[0_12px_40px_rgba(15,15,14,0.04)]">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#F7DCCF]/60 blur-2xl" />
        <p className="relative text-sm text-[#6B6B63]">
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
    <div className="relative overflow-hidden border border-[#E8E8E3] bg-white shadow-[0_16px_50px_rgba(15,15,14,0.05)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0F0F0E] via-[#C84B31] to-[#E8A97D]" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F7DCCF]/50 blur-3xl" />
      <div className="relative border-b border-[#E8E8E3] px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-[#0F0F0E] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
            AI writing studio
          </span>
          <span className="rounded-full border border-[#E8E8E3] bg-[#FAFAF7] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6B6B63]">
            Groq powered
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-[#0F0F0E]">
          Turn this into a LinkedIn post
        </h3>
        <p className="mt-1 max-w-xl text-sm leading-6 text-[#6B6B63]">
          Share what happened in plain language and we&apos;ll shape it into three clean
          variants that sound like you.
        </p>
      </div>

      <div className="relative p-5 sm:px-6 sm:py-6">
        {!variants ? (
          <>
            <textarea
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              placeholder="What happened? What did you learn? Who did you meet? What will you do differently?"
              rows={4}
              maxLength={2000}
              className="mb-3 w-full resize-none border border-[#E8E8E3] bg-[#FAFAF7] p-4 text-sm leading-6 text-[#0F0F0E] outline-none transition-colors focus:border-[#C84B31] focus:bg-white"
            />
            {error && (
              <p className="mb-3 rounded-md border border-[#F2D0C6] bg-[#FFF6F1] px-3 py-2 text-sm text-[#C84B31]">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B63]">
                {takeaways.length}/2000
              </span>
              <button
                onClick={generate}
                disabled={loading || !takeaways.trim()}
                className="inline-flex items-center justify-center rounded-full bg-[#0F0F0E] px-6 py-3 text-sm font-semibold text-white transition-transform transition-colors hover:-translate-y-0.5 hover:bg-[#C84B31] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Writing..." : "Generate 3 variants"}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#E8E8E3] bg-[#FCFCFB] p-4 shadow-[0_10px_30px_rgba(15,15,14,0.03)]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6B63]">
                    {variant.label}
                  </span>
                  <button
                    onClick={() => copyToClipboard(variant.content, `${i}`)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      copied === `${i}`
                        ? "border-[#C84B31] bg-[#FFF6F1] text-[#C84B31]"
                        : "border-[#E8E8E3] bg-white text-[#6B6B63] hover:border-[#0F0F0E] hover:text-[#0F0F0E]"
                    }`}
                  >
                    {copied === `${i}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mb-2 text-sm font-semibold leading-snug text-[#0F0F0E]">
                  {variant.hook}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#6B6B63]">
                  {variant.content}
                </p>
              </div>
            ))}
            <button
              onClick={() => {
                setVariants(null);
                setTakeaways("");
              }}
              className="text-sm font-medium text-[#6B6B63] transition-colors hover:text-[#0F0F0E]"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
