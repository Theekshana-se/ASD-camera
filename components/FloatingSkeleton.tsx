"use client";

import { motion } from "framer-motion";

interface FloatingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function FloatingSkeleton({
  width = "100%",
  height = "20px",
  className = "",
}: FloatingSkeletonProps) {
  return (
    <motion.div
      className={`bg-white/5 border border-white/10 rounded ${className}`}
      style={{ width, height }}
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Skeleton variants for different use cases
export function FloatingSkeletonCard() {
  return (
    <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
      <FloatingSkeleton height="24px" width="60%" />
      <FloatingSkeleton height="16px" width="100%" />
      <FloatingSkeleton height="16px" width="90%" />
      <FloatingSkeleton height="16px" width="80%" />
      <div className="flex gap-4 mt-6">
        <FloatingSkeleton height="40px" width="100px" />
        <FloatingSkeleton height="40px" width="100px" />
      </div>
    </div>
  );
}

export function FloatingSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <FloatingSkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}
