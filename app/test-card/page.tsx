import React from "react";
import ProductItem from "@/components/ProductItem";

const mockProduct: Product = {
  id: "demo-1",
  slug: "godox-led-1000-bi-ii",
  title: "Godox LED 1000 BI II",
  price: 2000,
  deposit: 0,
  isOfferItem: false,
  rating: 4.5,
  description: "Demo product for UI preview",
  mainImage: "/product_placeholder.jpg",
  coverPhoto: undefined,
  manufacturer: "Godox",
  categoryId: "lighting",
  category: { name: "Lighting" },
  inStock: 5,
};

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-6 text-2xl font-semibold">Preview Product Card</h1>
        <div className="grid grid-cols-3 gap-6">
          <ProductItem product={mockProduct} color="black" />
          <ProductItem product={{ ...mockProduct, id: "demo-2", title: "Godox AK-R1 Kit" }} color="black" />
          <ProductItem product={{ ...mockProduct, id: "demo-3", title: "Godox AD600BM Flash" }} color="black" />
        </div>
      </div>
    </div>
  );
}