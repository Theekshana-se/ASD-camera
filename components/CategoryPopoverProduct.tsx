"use client";
import Image from "next/image";
import Link from "next/link";
import { sanitize } from "@/lib/sanitize";

const CategoryPopoverProduct = ({ product }: { product: Product }) => {
  const priceText = `Rs.${(Number(product.price) || 0).toLocaleString("en-LK")}`;
  return (
    <Link
      href={`/product/${product.slug}`}
      prefetch
      className="group relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative h-28 w-full flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
        <Image
          src={product.mainImage?.startsWith("data:") || product.mainImage?.startsWith("http") ? (product.mainImage as string) : `/${product.mainImage}`}
          width={140}
          height={100}
          className="h-[90px] w-[140px] object-contain group-hover:scale-105 transition-transform"
          alt={sanitize(product?.title) || "Product image"}
        />
      </div>
      <div className="mt-2">
        <p className="text-xs text-neutral-700 line-clamp-2 min-h-[32px]">{sanitize(product.title)}</p>
        <p className="mt-1 text-sm font-semibold text-neutral-900">{priceText}</p>
      </div>
    </Link>
  );
};

export default CategoryPopoverProduct;