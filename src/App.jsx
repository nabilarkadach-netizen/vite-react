import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const ORB = 28;      // orb diameter (matches letter height)
  const GAP = 24;      // consistent spacing between all elements (letters & orbs)
  const SPEED = 0.9;   // animation speed

  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  // total logo width: KID + 3 gaps + 2 orbs + SE visually even
  const CONTAINER_W = ORB * 2 + GAP * 3;

  useAnimationFrame((t) => {
    const time = t / 1000;
    const s = (Math.sin(time * SPEED) + 1) / 2;

    // Base left/right for each orb, spaced evenly
    const leftBase = -GAP / 2 - ORB / 2;
    const rightBase = GAP / 2 + ORB / 2;

    // LERP horizontally (smooth crossing)
    const orangeX = leftBase + (rightBase - leftBase) * s;
    const blueX = rightBase - (rightBase - leftBase) * s;

    // z-index logic (which is in front)
    const orangeInFront = s < 0.5;

    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform = `translateX(${blueX}px)`;

      orangeRef.current.style.zIndex = orangeInFront ? 2 : 1;
      blueRef.current.style.zIndex = orangeInFront ? 1 : 2;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center justify-center select-none">
        {/* Left word */}
        <span
          className="text-white font-extrabold text-3xl md:text-4xl tracking-wide"
          style={{ marginRight: `${GAP}px` }}
        >
          KID
        </span>

        {/* Orb pair container — ensures consistent outer spacing */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: `${ORB * 2 + GAP}px`, height: "36px", marginRight: `${GAP}px` }}
        >
          {/* Orange orb */}
          <div
            ref={orangeRef}
            className="absolute rounded-full"
            style={{
              width: ORB,
              height: ORB,
              background:
                "radial-gradient(circle at 40% 35%, #FFEAA0 0%, #FFA131 60%, #E27C00 100%)",
            }}
          />

          {/* Blue orb */}
          <div
            ref={blueRef}
            className="absolute rounded-full"
            style={{
              width: ORB,
              height: ORB,
              background:
                "radial-gradient(circle at 45% 40%, #EAF0FF 0%, #83A3FF 60%, #5E7AFF 100%)",
            }}
          />
        </div>

        {/* Right word */}
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
      </div>
    </header>
  );
}
