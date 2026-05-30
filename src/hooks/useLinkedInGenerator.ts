"use client";

import { useState } from "react";
import type { LinkedInVariant } from "@/types";

export function useLinkedInGenerator() {
  const [variants, setVariants] = useState<LinkedInVariant[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(eventId: string, takeaways: string) {
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

  function reset() {
    setVariants(null);
    setError("");
  }

  return { variants, loading, error, generate, reset };
}
