import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 flex justify-center">
      <div className="flex items-center select-none">
        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide mr-3">
          KID
        </span>

        {/* Animated Book */}
        <motion.div
          className="relative w-[40px] h-[30px] mx-1"
          animate={{ rotateY: [0, 180, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#FFA131] to-[#83A3FF] rounded-[3px]"
            style={{ backfaceVisibility: "hidden" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#83A3FF] to-[#FFA131] rounded-[3px]"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          />
        </motion.div>

        <span className="text-white font-extrabold text-3xl md:text-4xl tracking-wide ml-3">
          SE
        </span>
      </div>
    </header>
  );
}
