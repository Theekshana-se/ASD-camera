"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { sanitize } from "@/lib/sanitize";

const ProductCard = ({ product }: { product: Product }) => {
  const formatPriceLKR = (n: number) => `Rs.${(n ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const computeFinalPrice = (price: number, discount?: number) => {
    const d = Number(discount || 0);
    if (d > 0 && d < 90) {
      return Math.round(price * (1 - d / 100));
    }
    return price;
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      prefetch
      className="group relative block rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl h-[360px] min-h-[360px] max-h-[360px]"
    >
      <div className="p-4 h-full flex flex-col">
        {(product.discount && product.discount > 0) ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">{product.discount}% OFF</span>
        ) : (product.isOfferItem ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">OFFER</span>
        ) : null)}
        <div className="relative h-[180px] w-full flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
          <Image
            src={
              product.mainImage
                ? (product.mainImage.startsWith("data:") || product.mainImage.startsWith("http")
                    ? product.mainImage
                    : `/${product.mainImage}`)
                : "/product_placeholder.jpg"
            }
            width={220}
            height={160}
            className="h-[160px] w-[220px] object-contain transition-transform duration-300 ease-out group-hover:scale-105"
            alt={sanitize(product?.title) || "Product image"}
          />
        </div>
        <h3 className="mt-4 text-sm text-neutral-900 overflow-hidden min-h-[40px]">{sanitize(product.title)}</h3>
        <div className="mt-2 flex items-center gap-x-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = product.rating ?? 0;
            const idx = i + 1;
            if (value >= idx) return <FaStar key={i} />;
            if (value >= idx - 0.5) return <FaStarHalfAlt key={i} />;
            return <FaRegStar key={i} />;
          })}
          <span className="ml-1 text-xs text-gray-500">{Number(product.rating || 0).toFixed(1)}</span>
        </div>
        <div className="mt-auto flex items-baseline gap-x-2">
          <p className="text-base font-bold text-neutral-900">{formatPriceLKR(computeFinalPrice(Number(product.price), product.discount))}</p>
          {(product.discount && product.discount > 0) ? (
            <p className="text-sm text-gray-500 line-through">{formatPriceLKR(Number(product.price))}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;