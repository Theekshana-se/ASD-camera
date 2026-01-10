"use client";

import { motion } from "framer-motion";

export default function OrbitalLoader() {
  const dotVariants = {
    animate: (i: number) => ({
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: [0.45, 0.05, 0.55, 0.95] as [number, number, number, number], // Cubic bezier for orbital mechanics
        delay: i * 0.2,
      },
    }),
  };

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Center dot */}
      <div className="absolute w-3 h-3 bg-white rounded-full" />

      {/* Orbital dots */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full"
          custom={i}
          variants={dotVariants}
          animate="animate"
          style={{
            transformOrigin: "center",
          }}
        >
          <div
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: "0%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      ))}

      {/* Orbital ring */}
      <div className="absolute w-full h-full border border-white/20 rounded-full" />
    </div>
  );
}

// Full-screen loader variant
export function OrbitalLoaderFullScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50">
      <div className="text-center">
        <OrbitalLoader />
        <motion.p
          className="mt-6 text-white/60 text-sm font-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
