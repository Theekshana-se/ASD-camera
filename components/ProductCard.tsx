"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import SmartButton from "./SmartButton";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, calculateTotals } = useProductStore();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    // Artificial delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: getImageUrl(product.imageUrl || product.mainImage),
      amount: 1
    });
    calculateTotals();
    toast.success("Product added to the cart");
  };

  const price = product.rentalPrice || product.price || 0;
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const isNew = product.isNew || false;
  const isFeatured = product.isFeatured || false;

  // Use correct field names from Product type
  const rawImage = product.imageUrl || product.mainImage;
  const productImage = getImageUrl(rawImage);
  const productName = product.name || product.title || "Product";
  const productStock = product.stock ?? product.inStock ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full aspect-square"
    >
      <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full">
        {/* Card Container - Now 1:1 Square */}
        <div className="relative w-full h-full bg-white border border-[#E5E7EB] hover:border-[#FF1F1F] rounded-lg overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md">

          {/* Background Image - Fills the square but respects overlay */}
          <div className="absolute inset-x-0 top-0 bottom-0 bg-[#F8F9FA] pt-8 px-8 pb-24 z-0">
            <motion.div
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </div>

          {/* Badges - Floating on top */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
            {isNew && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="px-3 py-1 bg-[#FF1F1F] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm"
              >
                New
              </motion.div>
            )}
            {discount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: 12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                className="px-3 py-1 bg-gradient-to-r from-red-600 to-black text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm"
              >
                -{discount}%
              </motion.div>
            )}
          </div>

          {/* Wishlist Button - Floating on top */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#1A1F2E] hover:bg-[#FF1F1F] hover:text-white hover:border-[#FF1F1F] transition-all duration-300 shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist logic
            }}
          >
            <FiHeart className="w-4 h-4" />
          </motion.button>

          {/* Product Info - Overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 transform translate-y-0 transition-all duration-300">
            <div className="space-y-1">
              {/* Brand */}
              {product.brand && (
                <div className="text-[10px] text-[#6B7280] uppercase tracking-widest font-semibold truncate">
                  {product.brand}
                </div>
              )}

              {/* Product Name */}
              <h3 className="text-[#1A1F2E] font-bold text-sm leading-tight truncate group-hover:text-[#FF1F1F] transition-colors duration-300">
                {productName}
              </h3>

              {/* Price & Stock Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#FF1F1F] font-mono">
                    Rs.{finalPrice.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-[#9CA3AF] line-through font-mono hidden sm:inline">
                      Rs.{price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Dot */}
                <div className="flex items-center gap-1.5" title={productStock > 0 ? "In Stock" : "Out of Stock"}>
                  <div className={`w-2 h-2 rounded-full ${productStock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                </div>
              </div>
            </div>

            {/* Quick Add Button - Floating over info on right */}
            <div className="absolute -top-6 right-4">
              <SmartButton
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 bg-[#FF1F1F] text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 hover:scale-110 transition-transform duration-200 !p-0"
                onClick={handleQuickAdd}
              >
                <FiShoppingCart className="w-4 h-4" />
              </SmartButton>
            </div>
          </div>

          {/* Hover Overlay Gradient */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}