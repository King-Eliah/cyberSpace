"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

export function CursorGlow() {
  const [point, setPoint] = useState<Point>({ x: 50, y: 32 });
  const [visible, setVisible] = useState(false);
  const targetRef = useRef<Point>({ x: 50, y: 32 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      setPoint((current) => {
        const nextX = current.x + (targetRef.current.x - current.x) * 0.08;
        const nextY = current.y + (targetRef.current.y - current.y) * 0.08;
        return { x: nextX, y: nextY };
      });

      frameRef.current = window.requestAnimationFrame(update);
    };

    const handleMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    frameRef.current = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_52%)]"
      />
      <div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,247,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(circle at center, black 18%, rgba(0,0,0,0.5) 58%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 18%, rgba(0,0,0,0.5) 58%, transparent 88%)",
        }}
      />
      <div
        className="absolute h-[520px] w-[520px] rounded-full blur-3xl transition-opacity duration-300"
        style={{
          left: point.x,
          top: point.y,
          opacity: visible ? 1 : 0.65,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(200,75,49,0.20) 0%, rgba(200,75,49,0.12) 30%, rgba(200,75,49,0.00) 68%)",
        }}
      />
      <div
        className="absolute h-[320px] w-[320px] rounded-full blur-3xl transition-opacity duration-300"
        style={{
          left: point.x + 180,
          top: point.y - 120,
          opacity: visible ? 0.9 : 0.45,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(232,168,124,0.14) 0%, rgba(232,168,124,0.08) 34%, rgba(232,168,124,0.00) 70%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,15,14,0.15),rgba(15,15,14,0.55))]" />
    </div>
  );
}