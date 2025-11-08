import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  /* Tunables */
  const ORB = 28;        // px, orb diameter (match letter height)
  const GAP = 12;        // px, space between the two orbs
  const SPEED = 0.9;     // animation speed
  const SWITCH_LOW = 0.45;   // hysteresis window start
  const SWITCH_HIGH = 0.55;  // hysteresis window end

  const CONTAINER_W = ORB * 2 + GAP;

  const orangeRef = useRef(null);
  const blueRef = useRef(null);
  const frontRef = useRef<'orange' | 'blue'>('orange'); // remember who is in front

  useAnimationFrame((t) => {
    const time = t / 1000;
    // smoothly oscillate 0→1→0
    const s = (Math.sin(time * SPEED) + 1) / 2;

    // two fixed slots inside the container
    const leftX  = - (GAP + ORB) / 2;
    const rightX =   (GAP + ORB) / 2;

    // LERP positions (same axis)
    const orangeX = leftX  + (rightX - leftX) * s;
    const blueX   = rightX - (rightX - leftX) * s;

    // Hysteresis for front/back: switch only outside a safe band
    // keeps the same orb in front while s is between 0.45 and 0.55
    if (s <= SWITCH_LOW)  frontRef.current = 'orange';
    if (s >= SWITCH_HIGH) frontRef.current = 'blue';

    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform   = `translateX(${blueX}px)`;

      // no opacity tricks: solid colors, both always visible
      if (frontRef.current === 'orange') {
        orangeRef.current.style.zIndex = '2';
        blueRef.current.style.zIndex   = '1';
      } else {
        orangeRef.current.style.zIndex = '1';
        blueRef.current.style.zIndex   = '2';
      }
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center gap-6 select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">KID</span>

        {/* Orbs container: exact width = two O's + gap so spacing is even */}
        <div
          className="relative flex items-center justify-center h-[36px]"
          style={{ width: `${CONTAINER_W}px` }}
        >
          {/* Orange orb — solid gradient, no transparent glow */}
          <div
            ref={orangeRef}
            className="absolute rounded-full will-change-transform"
            style={{
              width: ORB, height: ORB,
              background: "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />

          {/* Blue orb — solid gradient */}
          <div
            ref={blueRef}
            className="absolute rounded-full will-change-transform"
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
