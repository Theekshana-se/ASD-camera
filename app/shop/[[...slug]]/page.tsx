 "use client";
import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = () => {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/shop";
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[0] === "shop" ? segments[1] : "";
  return (
    <div className="text-black bg-white">
      <div className=" max-w-screen-2xl mx-auto px-10 pb-16 max-sm:px-5">
        <Breadcrumb />
        <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <Filters />
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
                {slug && slug.length > 0
                  ? sanitize(improveCategoryText(slug))
                  : "All products"}
              </h2>

              <SortBy />
            </div>
            <div className="divider"></div>
            <Products />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
