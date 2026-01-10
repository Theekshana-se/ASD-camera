"use client";

import { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface SmartButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * SmartButton - An enhanced button with loading states and animations
 * Prevents double-clicks and provides visual feedback
 */
export default function SmartButton({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
  ...props
}: SmartButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isProcessing || loading || disabled) return;

    setIsProcessing(true);
    
    try {
      await onClick?.(e);
    } finally {
      // Keep processing state for minimum 300ms for visual feedback
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  };

  const isLoading = loading || isProcessing;

  // Variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30",
    secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-lg",
    outline: "border-2 border-red-500 text-red-500 hover:bg-red-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  const isLightVariant = variant === "outline" || variant === "ghost";
  const spinnerBorderColor = isLightVariant ? "border-red-200" : "border-white/30";
  const spinnerTopColor = isLightVariant ? "border-t-red-600" : "border-t-white";

  return (
    <motion.button
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {/* Content */}
      <span className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}>
        {children}
      </span>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-5 h-5 border-2 ${spinnerBorderColor} ${spinnerTopColor} rounded-full`}
          />
        </div>
      )}

      {/* Shine effect on hover */}
      {!isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
}
