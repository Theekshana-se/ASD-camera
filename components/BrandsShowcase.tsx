"use client";
import Heading from "./Heading";
import Link from "next/link";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import React from "react";

interface BrandSummary {
  name: string;
  slug: string;
  productCount: number;
}

const BrandsShowcase = () => {
  const [brands, setBrands] = React.useState<BrandSummary[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/brands");

        if (response.ok) {
          const data = await response.json();
          const arr = Array.isArray(data)
            ? data.filter((brand: BrandSummary) => Boolean(brand?.name))
            : [];
          if (active) setBrands(arr);
        } else {
          if (active) setBrands([]);
        }
      } catch (error) {
        if (active) setBrands([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  if (!brands.length) {
    return (
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto py-20 px-10 max-sm:px-5">
          <div data-reveal="up">
            <Heading title="RENT BY BRAND" />
          </div>
          <div
            data-reveal="up"
            data-reveal-delay="150"
            className="mt-10 grid grid-cols-5 gap-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2 max-[500px]:grid-cols-1"
          >
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-24 w-full bg-gray-100 rounded animate-pulse" />
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
          <Heading title="RENT BY BRAND" />
        </div>
        <div
          data-reveal="up"
          data-reveal-delay="150"
          className="mt-10 grid grid-cols-5 gap-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2 max-[500px]:grid-cols-1"
        >
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="rounded-lg border border-gray-200 px-6 py-4 flex flex-col gap-y-1 hover:border-red-600 hover:shadow-lg transition-all duration-200 bg-white text-center"
            >
              <span className="text-lg font-semibold">
                {sanitize(brand.name)}
              </span>
              <span className="text-sm text-gray-500">
                {brand.productCount} items
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsShowcase;




