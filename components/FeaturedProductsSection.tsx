"use client";
import Heading from "./Heading";
import ProductCard from "./ProductCard";
import apiClient from "@/lib/api";
import React from "react";
import { motion } from "framer-motion";
import { SkeletonGrid } from "./GravityLoader";

const FeaturedProductsSection = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          "/api/products?filters[isFeatured][$equals]=true&sort=defaultSort&page=1"
        );

        if (response.ok) {
          const data = await response.json();
          const arr = Array.isArray(data) ? data.slice(0, 8) : [];
          if (active) setProducts(arr);
        } else {
          if (active) setProducts([]);
        }
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  if (!products.length && !loading) {
    return null;
  }

  return (
    <section className="relative bg-[#F8F9FA] border-t border-[#E5E7EB] overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      
      <div className="relative max-w-screen-2xl mx-auto py-24 px-10 max-sm:px-5">
        {/* Section Header - Kinetic Typography */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-px w-16 bg-gradient-to-r from-[#FF1F1F] to-transparent"
            />
            <h2 className="text-5xl lg:text-6xl font-bold text-[#1A1F2E] uppercase tracking-tight">
              Featured Products
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-lg text-[#6B7280] ml-22"
          >
            Handpicked premium equipment for professionals
          </motion.p>
        </motion.div>

        {/* Products Grid - Rigid 4-column */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1"
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="/shop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1F2E] text-white font-bold rounded-lg hover:bg-[#FF1F1F] hover:text-white transition-all duration-300"
          >
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
