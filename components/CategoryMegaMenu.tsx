"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import CategoryPopoverProduct from "./CategoryPopoverProduct";

type Cat = { id: string; name: string };

const CategoryMegaMenu: React.FC = () => {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    apiClient
      .get("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const list: Cat[] = Array.isArray(data) ? data : data?.categories || [];
        setCategories(list);
        if (list[0]?.name) setActive(list[0].name);
      })
      .catch(() => setCategories([]));
    return () => {
      mounted = false;
    };
  }, []);

  const fetchProducts = (categoryName: string) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    apiClient
      .get(`/api/products?filters[category][$equals]=${encodeURIComponent(categoryName)}&sort=defaultSort&page=1`, { cache: "no-store", signal: controller.signal as any })
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

  const bar = useMemo(() => (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap py-2 px-0 bg-red-600">
      {categories.map((c) => (
        <button
          key={c.id}
          onMouseEnter={() => handleEnter(c.name)}
          onFocus={() => handleEnter(c.name)}
          className={`px-4 py-2 text-sm font-semibold transition-all ${
            active === c.name
              ? "bg-red-800 text-white rounded-full shadow"
              : "bg-transparent text-white hover:bg-red-700 hover:rounded-full"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  ), [categories, active]);

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