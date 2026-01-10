"use client";
import { motion } from "framer-motion";

// Digital Scanner Loader
export function DigitalScanner({ size = 60 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* White Wireframe Box */}
        <div className="absolute inset-0 border-2 border-[#1A1F2E]/30 rounded">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#1A1F2E]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#1A1F2E]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#1A1F2E]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#1A1F2E]" />
        </div>

        {/* Scanning Red Line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF1F1F] to-transparent shadow-lg shadow-red-500/50"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Glow Effect */}
        <motion.div
          className="absolute left-0 right-0 h-8 bg-gradient-to-b from-red-500/20 to-transparent blur-sm"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

// Diagonal Shimmer Skeleton
export function ShimmerSkeleton({ 
  width = "100%", 
  height = "200px",
  className = "" 
}: { 
  width?: string; 
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-[#E5E7EB] ${className}`}
      style={{ width, height }}
    >
      {/* Diagonal Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "200%"],
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transform: "rotate(-45deg)",
          width: "200%",
          height: "200%",
        }}
      />

      {/* Subtle Border */}
      <div className="absolute inset-0 border border-[#D1D5DB] rounded-lg" />
    </div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
      {/* Image Skeleton */}
      <ShimmerSkeleton height="256px" className="rounded-none" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <ShimmerSkeleton height="12px" width="40%" />
        <ShimmerSkeleton height="20px" width="90%" />
        <ShimmerSkeleton height="20px" width="70%" />
        <div className="flex gap-2 pt-2">
          <ShimmerSkeleton height="16px" width="16px" className="rounded-full" />
          <ShimmerSkeleton height="16px" width="16px" className="rounded-full" />
          <ShimmerSkeleton height="16px" width="16px" className="rounded-full" />
          <ShimmerSkeleton height="16px" width="16px" className="rounded-full" />
          <ShimmerSkeleton height="16px" width="16px" className="rounded-full" />
        </div>
        <ShimmerSkeleton height="32px" width="50%" />
      </div>
    </div>
  );
}

// Skeleton Grid for Product Sections
export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Full Page Loader
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        <DigitalScanner size={80} />
        <motion.div
          className="text-[#1A1F2E] text-sm font-semibold uppercase tracking-widest"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
}

