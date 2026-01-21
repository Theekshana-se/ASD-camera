
// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************
"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";

import { sanitize } from "@/lib/sanitize";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const formatPriceLKR = (n: number) => `Rs.${(n ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <Link href={`/product/${product.slug}`} prefetch className="group block rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">
      <div className="p-4">
        <div className="relative h-40 w-full flex items-center justify-center overflow-hidden">
          <Image
            src={
              product.mainImage
                ? (product.mainImage.startsWith("data:") || product.mainImage.startsWith("http")
                  ? product.mainImage
                  : `/${product.mainImage}`)
                : "/product_placeholder.jpg"
            }
            width={320}
            height={160}
            className="max-h-full w-auto object-contain"
            alt={sanitize(product?.title) || "Product image"}
          />
        </div>
        <h3 className="mt-4 text-sm text-neutral-900 truncate">{sanitize(product.title)}</h3>
        <p className="mt-1 text-base font-bold text-neutral-900">{formatPriceLKR(Number(product.price))}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
