"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import CategoryPopoverProduct from "./CategoryPopoverProduct";
import Link from "next/link";

type Cat = { id: string; name: string };

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
    hoverTimeout.current = setTimeout(() => setOpen(true), 100);
  };
  const handleLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  const maxStart = Math.max(0, navCats.length - 6);
  const scrollLeft = () => setStartIdx((s) => Math.max(0, s - 1));
  const scrollRight = () => setStartIdx((s) => Math.min(maxStart, s + 1));

  const bar = useMemo(() => (
    <div className="relative bg-red-600 py-2">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
        <button aria-label="Scroll left" onClick={scrollLeft} className="w-7 h-7 rounded-full bg-white text-black text-xs font-bold">‹</button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
        <button aria-label="Scroll right" onClick={scrollRight} className="w-7 h-7 rounded-full bg-white text-black text-xs font-bold">›</button>
      </div>
      <div ref={scrollRef} className="mx-20 flex gap-3 overflow-x-hidden whitespace-nowrap justify-center">
        {navCats.slice(startIdx, startIdx + 6).map((c) => (
          <Link
            key={c.id}
            href={c.href}
            prefetch
            onMouseEnter={() => handleEnter(c.name)}
            onFocus={() => handleEnter(c.name)}
            className={`group relative inline-flex items-center rounded-full px-5 py-2 font-semibold overflow-hidden transition-colors ${
              active === c.name ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <span className="relative z-10">{c.name}</span>
            {active !== c.name && (
              <span className="absolute left-0 top-0 h-full w-0 bg-white/20 z-0 transition-all duration-300 group-hover:w-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  ), [navCats, startIdx, active]);

  return (
    <div className="relative" onMouseLeave={handleLeave}>
      {bar}
      <div
        aria-hidden={!open}
        className={`absolute left-0 right-0 z-40 ${open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"} transition duration-200 ease-out`}
      >
        <div className="max-w-screen-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-xl px-6 py-6">
          {loading ? (
            <div className="grid grid-cols-5 gap-4 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-36 rounded-md bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-gray-600">No items in {active} yet.</div>
          ) : (
            <div className="grid grid-cols-5 gap-4 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
              {products.map((p) => (
                <CategoryPopoverProduct key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryMegaMenu;
