import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  /* ---- Tweak these to your taste ---- */
  const ORB = 28;          // orb diameter (px) — keeps same height as letters
  const GAP = 12;          // space between the two orbs (px)
  const SPEED = 0.9;       // animation speed (smaller = slower)

  // Derived: container width holds both orbs + gap (so outside spacing stays even)
  const CONTAINER_W = ORB * 2 + GAP;

  const orangeRef = useRef(null);
  const blueRef   = useRef(null);

  useAnimationFrame((t) => {
    const time = t / 1000;
    // s oscillates 0→1→0 to swap positions smoothly
    const s = (Math.sin(time * SPEED) + 1) / 2;

    // Two fixed slots inside the container (left ↔ right). We just cross-fade positions.
    const leftX  = - (GAP + ORB) / 2;
    const rightX =   (GAP + ORB) / 2;

    // LERP between slots (no vertical motion, no scaling)
    const orangeX = leftX  + (rightX - leftX) * s;
    const blueX   = rightX - (rightX - leftX) * s;

    // Decide who’s in front during the crossing (no opacity tricks, no color change)
    const orangeInFront = s < 0.5; // orange leads first half, blue leads second

    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform   = `translateX(${blueX}px)`;

      orangeRef.current.style.zIndex = orangeInFront ? 2 : 1;
      blueRef.current.style.zIndex   = orangeInFront ? 1 : 2;

      // Keep both visible at all times (prevents “one ball only” look)
      orangeRef.current.style.visibility = "visible";
      blueRef.current.style.visibility   = "visible";
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      {/* The outer gaps here are equal; the orbs container is a fixed width so spacing stays consistent */}
      <div className="flex items-center gap-6 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>

        {/* Orbs container = exactly two O slots + one GAP */}
        <div
          className="relative flex items-center justify-center h-[36px]"
          style={{ width: `${CONTAINER_W}px` }}
          aria-label="KIDOOSE animated logo center"
        >
          {/* Orange orb (solid gradient; no transparent glow) */}
          <div
            ref={orangeRef}
            className="absolute rounded-full"
            style={{
              width: ORB, height: ORB,
              background: "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />

          {/* Blue orb (solid gradient; no transparent glow) */}
          <div
            ref={blueRef}
            className="absolute rounded-full"
            style={{
              width: ORB, height: ORB,
              background: "radial-gradient(circle at 45% 40%, #EAF0FF 0%, #83A3FF 60%, #5E7AFF 100%)",
            }}
          />
        </div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
      </div>
    </header>
  );
}
