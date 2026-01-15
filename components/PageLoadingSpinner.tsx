"use client";

import { motion } from "framer-motion";

/**
 * PageLoadingSpinner - A beautiful full-screen loading animation
 * Used for initial page loads and suspense boundaries
 */
export default function PageLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-red-500"
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 blur-sm"
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg" />
        
        {/* Glow effect */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-red-500/20 blur-2xl"
        />
      </div>
      
      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute mt-40 text-gray-600 font-medium tracking-wide"
      >
        Loading...
      </motion.p>
    </div>
  );
}
