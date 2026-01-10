"use client";
import Image from "next/image";
import Link from "next/link";
import { sanitize } from "@/lib/sanitize";
import { motion } from "framer-motion";
import { useState } from "react";

const CategoryPopoverProduct = ({ product }: { product: Product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const priceText = `Rs.${(Number(product.price) || 0).toLocaleString("en-LK")}`;
  
  return (
    <Link
      href={`/product/${product.slug}`}
      prefetch
      className="group block"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-3 shadow-sm hover:shadow-xl hover:border-[#FF1F1F]/40 transition-all duration-300 overflow-hidden"
      >
        {/* Hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF1F1F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Image container */}
        <div className="relative h-32 w-full flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 mb-3">
          {!imageLoaded && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={product.mainImage?.startsWith("data:") || product.mainImage?.startsWith("http") ? (product.mainImage as string) : `/${product.mainImage}`}
              width={160}
              height={128}
              className="object-contain p-2"
              alt={sanitize(product?.title) || "Product image"}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
          
          {/* Quick view badge on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg className="w-4 h-4 text-[#1A1F2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.div>
        </div>
        
        {/* Product info */}
        <div className="relative z-10 space-y-2">
          {/* Product title */}
          <h4 className="text-xs font-medium text-[#1A1F2E] line-clamp-2 min-h-[32px] leading-relaxed group-hover:text-[#FF1F1F] transition-colors duration-300">
            {sanitize(product.title)}
          </h4>
          
          {/* Price and stock */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#FF1F1F]">{priceText}</p>
            {product.inStock > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                In Stock
              </span>
            )}
          </div>
          
          {/* Add to cart indicator on hover */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-[10px] text-[#1A1F2E] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>View Details</span>
          </motion.div>
        </div>
        
        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF1F1F] to-[#1A1F2E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        />
      </motion.div>
    </Link>
  );
};

export default CategoryPopoverProduct;