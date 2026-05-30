"use client";

import { useState, useEffect } from "react";

const PHRASE = "Every room you enter shapes who you become.";

export function TypewriterText() {
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!deleting && count < PHRASE.length) {
      const t = setTimeout(() => setCount((c) => c + 1), 62);
      return () => clearTimeout(t);
    }
    if (!deleting && count === PHRASE.length) {
      const t = setTimeout(() => setDeleting(true), 3200);
      return () => clearTimeout(t);
    }
    if (deleting && count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 26);
      return () => clearTimeout(t);
    }
    if (deleting && count === 0) {
      setDeleting(false);
    }
  }, [count, deleting]);

  return (
    <>
      {PHRASE.slice(0, count)}
      <span className="inline-block w-[2px] h-[0.85em] bg-[#C84B31] ml-1 animate-pulse align-middle" />
    </>
  );
}
