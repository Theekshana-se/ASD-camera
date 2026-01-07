"use client";
import Heading from "./Heading";
import ProductCard from "./ProductCard";
import apiClient from "@/lib/api";
import React from "react";

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

  if (!products.length) {
    return (
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto py-20 px-10 max-sm:px-5">
          <div data-reveal="up">
            <Heading title="FEATURED PRODUCTS" />
          </div>
          <div
            data-reveal="up"
            data-reveal-delay="150"
            className="grid grid-cols-4 justify-items-center gap-x-5 gap-y-8 mt-10 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-48 w-full bg-gray-100 rounded animate-pulse" />
                ))
              : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto py-20 px-10 max-sm:px-5">
        <div data-reveal="up">
          <Heading title="FEATURED PRODUCTS" />
        </div>
        <div
          data-reveal="up"
          data-reveal-delay="150"
          className="grid grid-cols-4 justify-items-center gap-x-5 gap-y-8 mt-10 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
