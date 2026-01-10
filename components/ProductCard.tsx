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
      className="group relative w-full"
    >
      <Link href={`/product/${product.slug || product.id}`} className="block">
        {/* Card Container */}
        <div className="relative bg-white border border-[#E5E7EB] hover:border-[#FF1F1F] rounded-lg overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {isNew && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="px-3 py-1 bg-[#FF1F1F] text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                New
              </motion.div>
            )}
            {discount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: 12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                className="px-3 py-1 bg-gradient-to-r from-red-600 to-black text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                -{discount}%
              </motion.div>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#1A1F2E] hover:bg-[#FF1F1F] hover:text-white hover:border-[#FF1F1F] transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist logic
            }}
          >
            <FiHeart className="w-4 h-4" />
          </motion.button>

          {/* Product Image */}
          <div className="relative h-64 bg-[#F8F9FA] flex items-center justify-center overflow-hidden">
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
                className="object-contain p-4"
              />
            </motion.div>

            {/* Quick Add Button - Slides in from right */}
            <SmartButton
              initial={{ x: 100, opacity: 0 }}
              animate={{
                x: isHovered ? 0 : 100,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-4 right-4 w-12 h-12 bg-[#FF1F1F] text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 hover:scale-110 transition-transform duration-200 !p-0"
              onClick={handleQuickAdd}
            >
              <FiShoppingCart className="w-5 h-5" />
            </SmartButton>
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-3">
            {/* Brand */}
            {product.brand && (
              <div className="text-xs text-[#6B7280] uppercase tracking-widest font-semibold">
                {product.brand}
              </div>
            )}

            {/* Product Name */}
            <h3 className="text-[#1A1F2E] font-bold text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-[#FF1F1F] transition-colors duration-300">
              {productName}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-[#FF1F1F]"
                          : "text-[#D1D5DB]"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-[#6B7280]">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-[#E5E7EB]">
              <div className="text-2xl font-bold text-[#FF1F1F] font-mono">
                Rs.{finalPrice.toLocaleString()}
              </div>
              {discount > 0 && (
                <div className="text-sm text-[#9CA3AF] line-through font-mono">
                  Rs.{price.toLocaleString()}
                </div>
              )}
            </div>

            {/* Rental Period */}
            {product.rentalPeriod && (
              <div className="text-xs text-[#6B7280]">
                per {product.rentalPeriod}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  productStock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-[#6B7280]">
                {productStock > 0 ? `${productStock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}