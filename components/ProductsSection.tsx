// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductCard from "./ProductCard";
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await apiClient.get("/api/products");
        if (!data.ok) {
          if (active) setProducts([]);
        } else {
          const result = await data.json();
          if (active) setProducts(Array.isArray(result) ? result : []);
        }
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [])

  return (
    <div className="bg-white border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-48 w-full bg-gray-100 rounded animate-pulse" />
                  ))
                : <div className="text-center text-gray-600 py-10">No products available at the moment.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
