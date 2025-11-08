import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Header() {
  const ORB = 28;        // orb diameter (matches letter height)
  const INNER_GAP = 6;   // gap between the two orbs
  const OUTER_GAP = 5;   // tightened spacing to letters
  const SPEED = 0.9;

  const orangeRef = useRef(null);
  const blueRef = useRef(null);

  useAnimationFrame((t) => {
    const time = t / 1000;
    const s = (Math.sin(time * SPEED) + 1) / 2;

    const leftX = -INNER_GAP / 2 - ORB / 2;
    const rightX = INNER_GAP / 2 + ORB / 2;

    const orangeX = leftX + (rightX - leftX) * s;
    const blueX = rightX - (rightX - leftX) * s;

    const orangeFront = s < 0.5;

    if (orangeRef.current && blueRef.current) {
      orangeRef.current.style.transform = `translateX(${orangeX}px)`;
      blueRef.current.style.transform = `translateX(${blueX}px)`;
      orangeRef.current.style.zIndex = orangeFront ? 2 : 1;
      blueRef.current.style.zIndex = orangeFront ? 1 : 2;
    }
  });

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span
          className="text-white font-extrabold text-3xl md:text-4xl tracking-wide"
          style={{ marginRight: `${OUTER_GAP}px` }}
        >
          KID
        </span>

        {/* Animated “OO” pair */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${ORB * 2 + INNER_GAP}px`,
            height: "36px",
            marginRight: `${OUTER_GAP}px`,
          }}
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

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">SE</span>
      </div>
    </header>
  );
}
