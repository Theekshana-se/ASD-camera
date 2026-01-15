// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

 "use client";
import React from "react";
import ProductCard from "./ProductCard";
import apiClient from "@/lib/api";

const Products = () => {
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/shop";
  const segments = pathname.split("/").filter(Boolean);
  const slugCategory = segments[0] === "shop" && segments[1]?.length ? segments[1] : undefined;
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams.get("inStock") === "true" ? 1 : 0;
  const outOfStockNum = searchParams.get("outOfStock") === "true" ? 1 : 0;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const sortValue =
    typeof searchParams.get("sort") === "string" && (searchParams.get("sort") || "").length > 0
      ? (searchParams.get("sort") as string)
      : "defaultSort";
  const priceLimit = Number(searchParams.get("price")) || 999999;
  const ratingThreshold = Number(searchParams.get("rating")) || 0;
  const brandFilterParam =
    typeof searchParams.get("brand") === "string" &&
    (searchParams.get("brand") || "").length > 0 &&
    searchParams.get("brand") !== "all"
      ? (searchParams.get("brand") as string)
      : undefined;
  const categoryParamRaw =
    typeof searchParams.get("category") === "string" &&
    (searchParams.get("category") || "").length > 0
      ? (searchParams.get("category") as string)
      : undefined;
  const categoryFromParams =
    categoryParamRaw && categoryParamRaw !== "all"
      ? categoryParamRaw
      : undefined;
  const shouldIgnoreSlug = categoryParamRaw === "all";
  const activeCategory = shouldIgnoreSlug
    ? undefined
    : categoryFromParams || slugCategory;

  let stockMode: string | null = null;
  
  // preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte"; // both checked → include any positive stock
  } else if (inStockNum === 1) {
    stockMode = "equals"; // exactly in stock
  } else if (outOfStockNum === 1) {
    stockMode = "lt"; // less than 1
  } else {
    stockMode = null; // no stock filter by default
  }

  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const queryParts: string[] = [
        `filters[price][$lte]=${priceLimit}`,
        `filters[rating][$gte]=${ratingThreshold}`,
      ];
      if (stockMode) {
        queryParts.push(`filters[inStock][$${stockMode}]=1`);
      }

      if (activeCategory) {
        queryParts.push(
          `filters[category][$equals]=${encodeURIComponent(activeCategory)}`
        );
      }

      if (brandFilterParam) {
        queryParts.push(
          `filters[manufacturer][$equals]=${encodeURIComponent(
            brandFilterParam
          )}`
        );
      }

      queryParts.push(`sort=${encodeURIComponent(sortValue)}`);
      queryParts.push(`page=${page}`);

      try {
        const data = await apiClient.get(`/api/products?${queryParts.join("&")}`);

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
  }, [inStockNum, outOfStockNum, page, sortValue, priceLimit, ratingThreshold, brandFilterParam, activeCategory]);

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full w-full">
          {loading ? (
            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 w-full bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
              No products found for specified query
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
