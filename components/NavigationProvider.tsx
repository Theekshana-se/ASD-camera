"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

/**
 * NavigationProvider - Provides navigation state context and renders loading bar
 * Place this in your layout to enable navigation feedback across the app
 */
export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setShowBar(true);
    setProgress(0);
  }, []);

  // Track route changes
  useEffect(() => {
    // Complete navigation
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setShowBar(false);
      setProgress(0);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Animate progress while navigating
  useEffect(() => {
    if (!isNavigating) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isNavigating]);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation }}>
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-gray-900/50"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * NavigationLink - A Link component that triggers navigation loading state
 */
export { NavigationProvider as default };
