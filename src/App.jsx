import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  /* ---------------- Tunables ---------------- */
  const ORB_SIZE = 28;      // diameter in px
  const ORBIT_RADIUS = 8;   // how far they move up/down in orbit
  const ORBIT_GAP = 16;     // horizontal spacing between orbs
  const SPEED = 1.2;        // rotation speed (radians/sec)

  useAnimationFrame((t) => {
    const time = t / 1000;
    const angle = time * SPEED; // continuous rotation 0 → 2π → ∞

    // Both rotate clockwise around a shared center
    // Orange starts opposite to Blue (π radians apart)
    const orangeX = Math.cos(angle) * ORBIT_RADIUS - ORBIT_GAP / 2;
    const orangeY = Math.sin(angle) * ORBIT_RADIUS;

    const blueX = Math.cos(angle + Math.PI) * ORBIT_RADIUS + ORBIT_GAP / 2;
    const blueY = Math.sin(angle + Math.PI) * ORBIT_RADIUS;

    // Depth sorting based on Y (lower = front)
    const orangeFront = orangeY > blueY;

    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translate(${orangeX}px, ${orangeY}px)`;
      blueRef.current.style.transform = `translate(${blueX}px, ${blueY}px)`;
      orangeRef.current.style.zIndex = orangeFront ? 2 : 1;
      blueRef.current.style.zIndex = orangeFront ? 1 : 2;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-6 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          KID
        </span>

        {/* Container for the two orbiting orbs */}
        <div className="relative flex items-center justify-center w-[72px] h-[36px]">
          {/* Orange orb */}
          <div
            ref={orangeRef}
            className="absolute rounded-full will-change-transform"
            style={{
              width: ORB_SIZE,
              height: ORB_SIZE,
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />

          {/* Blue orb */}
          <div
            ref={blueRef}
            className="absolute rounded-full will-change-transform"
            style={{
              width: ORB_SIZE,
              height: ORB_SIZE,
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF 0%, #83A3FF 60%, #5E7AFF 100%)",
            }}
          />
        </div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
          SE
        </span>
      </div>
    </header>
  );
}
