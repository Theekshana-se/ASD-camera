"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}

/**
 * SmartLink - An enhanced Link component that provides instant visual feedback
 * Shows a ripple effect on click and triggers loading state immediately
 */
export default function SmartLink({ 
  href, 
  children, 
  className = "", 
  prefetch = true,
  ...props 
}: SmartLinkProps) {
  const router = useRouter();
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    // If it's an internal link, handle navigation
    if (href.startsWith('/')) {
      e.preventDefault();
      // Small delay for visual feedback
      setTimeout(() => {
        router.push(href);
      }, 100);
    }
  }, [href, router]);

  return (
    <Link
      href={href}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      prefetch={prefetch}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </Link>
  );
}
