"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import CategoryPopoverProduct from "./CategoryPopoverProduct";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Cat = { id: string; name: string };

// Helper function to capitalize category names properly
const formatCategoryName = (name: string): string => {
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CategoryMegaMenu: React.FC = () => {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [startIdx, setStartIdx] = useState(0);

  const navCats = useMemo(() => (
    [
      { id: "smart-phones", name: "smart-phones", href: "/shop/smart-phones" },
      { id: "cameras", name: "cameras", href: "/shop/cameras" },
      { id: "earbuds", name: "earbuds", href: "/shop/earbuds" },
      { id: "speakers", name: "speakers", href: "/shop/speakers" },
      { id: "juicers", name: "juicers", href: "/shop/juicers" },
      { id: "headphones", name: "headphones", href: "/shop/headphones" },
      { id: "watches", name: "watches", href: "/shop/watches" },
      { id: "laptops", name: "laptops", href: "/shop/laptops" },
      { id: "tea", name: "tea", href: "/shop/tea" },
      { id: "lighters", name: "lighters", href: "/shop/lighters" },
    ]
  ), []);

  useEffect(() => {
    setCategories(navCats.map((c) => ({ id: c.id, name: c.name })));
    setActive(navCats[0]?.name || null);
  }, [navCats]);

  const fetchProducts = (categoryName: string) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    apiClient
      .get(`/api/products?filters[category][$equals]=${encodeURIComponent(categoryName)}&sort=defaultSort&page=1`, { signal: controller.signal as any, next: { revalidate: 60 } as any })
      .then((res) => res.json())
      .then((data) => {
        const arr: Product[] = Array.isArray(data) ? data.slice(0, 12) : [];
        setProducts(arr);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!active) return;
    fetchProducts(active);
  }, [active]);

  const handleEnter = (name: string) => {
    setActive(name);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpen(true), 150);
  };
  
  const handleLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpen(false), 200);
  };

  const maxStart = Math.max(0, navCats.length - 6);
  const scrollLeft = () => setStartIdx((s) => Math.max(0, s - 1));
  const scrollRight = () => setStartIdx((s) => Math.min(maxStart, s + 1));

  const bar = useMemo(() => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-white/95 via-white/98 to-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm py-3"
    >
      {/* Subtle gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF1F1F]/30 to-transparent" />
      
      {/* Left scroll button */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll left" 
          onClick={scrollLeft} 
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/80 text-[#1A1F2E] text-lg font-bold shadow-md hover:shadow-lg hover:border-[#FF1F1F]/30 transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>

      {/* Right scroll button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll right" 
          onClick={scrollRight} 
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/80 text-[#1A1F2E] text-lg font-bold shadow-md hover:shadow-lg hover:border-[#FF1F1F]/30 transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Categories container */}
      <div ref={scrollRef} className="mx-20 flex gap-3 overflow-x-hidden whitespace-nowrap justify-center">
        {navCats.slice(startIdx, startIdx + 6).map((c) => {
          const isActive = active === c.name;
          return (
            <Link
              key={c.id}
              href={c.href}
              prefetch
              onMouseEnter={() => handleEnter(c.name)}
              onFocus={() => handleEnter(c.name)}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative inline-flex items-center rounded-full px-6 py-2.5 font-semibold text-sm tracking-wide
                  overflow-hidden transition-all duration-300
                  ${isActive 
                    ? "bg-gradient-to-r from-[#FF1F1F] to-[#1A1F2E] text-white shadow-lg shadow-red-500/30" 
                    : "bg-white/80 backdrop-blur-sm text-[#1A1F2E] border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#FF1F1F]/40"
                  }
                `}
              >
                {/* Animated gradient background for inactive pills on hover */}
                {!isActive && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#FF1F1F]/10 to-[#1A1F2E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
                
                {/* Glow effect for active pill */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1F1F] to-[#1A1F2E] opacity-50 blur-md"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                <span className="relative z-10">{formatCategoryName(c.name)}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  ), [navCats, startIdx, active]);

  return (
    <div className="relative" onMouseLeave={handleLeave}>
      {bar}
      
      {/* Dropdown mega menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
            className="absolute left-0 right-0 z-40"
          >
            <div className="max-w-screen-2xl mx-auto mt-2 bg-white/95 backdrop-blur-lg border border-gray-200/80 rounded-2xl shadow-2xl shadow-black/10 px-8 py-8">
              {/* Category title with accent */}
              <div className="mb-6 pb-4 border-b border-gray-200/60">
                <h3 className="text-2xl font-bold text-[#1A1F2E] flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-[#FF1F1F] to-[#1A1F2E] rounded-full" />
                  {formatCategoryName(active || "")}
                </h3>
                <p className="text-sm text-gray-600 ml-4 mt-1">
                  {products.length > 0 ? `${products.length} products available` : "Loading products..."}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-6 gap-4 max-xl:grid-cols-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="h-44 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden relative"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">No products yet</p>
                  <p className="text-sm text-gray-600 mt-1">Items in {formatCategoryName(active || "")} are coming soon</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-6 gap-4 max-xl:grid-cols-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2"
                >
                  {products.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      <CategoryPopoverProduct product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryMegaMenu;
