"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  duration: number;
  delay: number;
  shape: "rect" | "square" | "dot";
}

const COLORS = ["#C84B31", "#E8A87C", "#8BC34A", "#FAFAF7", "#F5A623", "#C84B31"];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 37 + 11) % 100,
    y: (i * 53 + 7) % 100,
    size: (i % 3 === 0 ? 8 : i % 3 === 1 ? 12 : 6),
    color: COLORS[i % COLORS.length],
    rotation: (i * 47) % 360,
    duration: 3 + (i % 4),
    delay: (i * 0.3) % 2.5,
    shape: i % 3 === 0 ? "rect" : i % 3 === 1 ? "square" : "dot",
  }));
}

export function Particles({ count = 28 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const particles = generateParticles(count);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-70"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            width: p.shape === "rect" ? p.size * 2 : p.size,
            height: p.shape === "dot" ? p.size : p.size,
            borderRadius: p.shape === "dot" ? "50%" : "1px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
