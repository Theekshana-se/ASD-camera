// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

import React from "react";
import ProductCard from "./ProductCard";
import apiClient from "@/lib/api";

const Products = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const sortValue =
    typeof searchParams?.sort === "string" && searchParams.sort.length > 0
      ? searchParams.sort
      : "defaultSort";
  const priceLimit = Number(searchParams?.price) || 999999;
  const ratingThreshold = Number(searchParams?.rating) || 0;
  const brandFilterParam =
    typeof searchParams?.brand === "string" &&
    searchParams.brand.length > 0 &&
    searchParams.brand !== "all"
      ? searchParams.brand
      : undefined;
  const categoryParamRaw =
    typeof searchParams?.category === "string" &&
    searchParams.category.length > 0
      ? searchParams.category
      : undefined;
  const categoryFromParams =
    categoryParamRaw && categoryParamRaw !== "all"
      ? categoryParamRaw
      : undefined;
  const shouldIgnoreSlug = categoryParamRaw === "all";
  const slugCategory =
    params?.slug && Array.isArray(params.slug) && params.slug.length > 0
      ? params.slug[0]
      : undefined;
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

  let products = [];

  try {
    // sending API request with filtering, sorting and pagination for getting all products
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

    const data = await apiClient.get(
      `/api/products?${queryParts.join("&")}`,
      { next: { revalidate: 30 } }
    );

    if (!data.ok) {
      console.error('Failed to fetch products:', data.statusText);
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
