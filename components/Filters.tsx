// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { formatCategoryName } from "@/utils/categoryFormating";

type FilterCategoryOption = {
  id: string;
  name: string;
};

type BrandOption = {
  name: string;
  slug: string;
  productCount: number;
};

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
  selectedCategory: string;
  selectedBrand: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const Filters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // getting current page number from Zustand store
  const { page, setPage } = usePaginationStore();
  const { sortBy } = useSortStore();

  const slugCategoryFromPath = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "shop" && segments[1]?.length) {
      return segments[1];
    }
    return "all";
  }, [pathname]);

  const getBooleanParam = (value: string | null, defaultValue: boolean) => {
    if (value === null) return defaultValue;
    return value === "true";
  };

  const getNumericParam = (value: string | null, defaultValue: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  };

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: getBooleanParam(searchParams.get("inStock"), true) },
    outOfStock: { text: "outofstock", isChecked: getBooleanParam(searchParams.get("outOfStock"), true) },
    priceFilter: { text: "price", value: getNumericParam(searchParams.get("price"), 3000) },
    ratingFilter: { text: "rating", value: getNumericParam(searchParams.get("rating"), 0) },
    selectedCategory: searchParams.get("category") || slugCategoryFromPath || "all",
    selectedBrand: searchParams.get("brand") || "all",
  });

  const [categories, setCategories] = useState<FilterCategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(false);
  const hasAppliedFiltersRef = useRef<boolean>(false);
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchFilters = async () => {
      setIsLoadingFilters(true);
      try {
        const [categoryRes, brandRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch(`${API_BASE_URL}/api/brands`, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json();
          if (isMounted && Array.isArray(categoryData)) {
            setCategories(
              categoryData
                .filter((category: any) => Boolean(category?.name))
                .map((category: any) => ({
                  id: category?.id || category?._id || category?.name,
                  name: category.name,
                }))
            );
          }
        }

        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (isMounted && Array.isArray(brandData)) {
            setBrands(
              brandData
                .filter((brand: any) => Boolean(brand?.name))
                .map((brand: any) => ({
                  name: brand.name,
                  slug: brand.slug,
                  productCount: brand.productCount ?? 0,
                }))
            );
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Failed to load filter options", error);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFilters(false);
        }
      }
    };

    fetchFilters();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const nextState: InputCategory = {
      inStock: {
        text: "instock",
        isChecked: getBooleanParam(searchParams.get("inStock"), true),
      },
      outOfStock: {
        text: "outofstock",
        isChecked: getBooleanParam(searchParams.get("outOfStock"), true),
      },
      priceFilter: {
        text: "price",
        value: getNumericParam(searchParams.get("price"), 3000),
      },
      ratingFilter: {
        text: "rating",
        value: getNumericParam(searchParams.get("rating"), 0),
      },
      selectedCategory: searchParams.get("category") || slugCategoryFromPath || "all",
      selectedBrand: searchParams.get("brand") || "all",
    };

    setInputCategory((prev) => {
      const hasChanged =
        prev.inStock.isChecked !== nextState.inStock.isChecked ||
        prev.outOfStock.isChecked !== nextState.outOfStock.isChecked ||
        prev.priceFilter.value !== nextState.priceFilter.value ||
        prev.ratingFilter.value !== nextState.ratingFilter.value ||
        prev.selectedCategory !== nextState.selectedCategory ||
        prev.selectedBrand !== nextState.selectedBrand;

      return hasChanged ? nextState : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString, slugCategoryFromPath]);

  useEffect(() => {
    if (!hasAppliedFiltersRef.current) {
      hasAppliedFiltersRef.current = true;
      return;
    }
    setPage(1);
  }, [
    inputCategory.inStock.isChecked,
    inputCategory.outOfStock.isChecked,
    inputCategory.priceFilter.value,
    inputCategory.ratingFilter.value,
    inputCategory.selectedCategory,
    inputCategory.selectedBrand,
    setPage,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    // setting URL params and after that putting them all in URL
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
     params.set("category", inputCategory.selectedCategory || "all");
     params.set("brand", inputCategory.selectedBrand || "all");
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  }, [inputCategory, sortBy, page, pathname, replace]);

  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      {isLoadingFilters && (
        <p className="text-sm text-gray-500 mb-2">Loading options…</p>
      )}
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Price</h3>
        <div>
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range"
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: Number(e.target.value),
                },
              })
            }
          />
          <span>{`Max price: $${inputCategory.priceFilter.value}`}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Category</h3>
        <select
          className="select select-bordered w-full"
          value={inputCategory.selectedCategory}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              selectedCategory: e.target.value,
            })
          }
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {formatCategoryName(category.name)}
            </option>
          ))}
        </select>
      </div>

      <div className="divider"></div>

      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Brand</h3>
        <select
          className="select select-bordered w-full"
          value={inputCategory.selectedBrand}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              selectedBrand: e.target.value,
            })
          }
        >
          <option value="all">All brands</option>
          {brands.map((brand, idx) => (
            <option key={`${brand.name}-${idx}`} value={brand.name}>
              {brand.name} {brand.productCount ? `(${brand.productCount})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="divider"></div>

      <div>
        <h3 className="text-xl mb-2">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-info"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
