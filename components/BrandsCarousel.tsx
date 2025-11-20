import Heading from "./Heading";
import Link from "next/link";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

interface BrandSummary {
  id?: string;
  name: string;
  slug?: string;
  productCount?: number;
}

const BrandsCarousel = async () => {
  let brands: BrandSummary[] = [];

  try {
    const response = await apiClient.get("/api/brands", { next: { revalidate: 120 } });
    if (response.ok) {
      const data = await response.json();
      brands = Array.isArray(data) ? data.filter((b: any) => Boolean(b?.name)) : [];
    }
  } catch {
    brands = [];
  }

  if (!brands.length) return null;

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto py-20 px-10 max-sm:px-5">
        <div data-reveal="up">
          <Heading title="OUR BRANDS" />
        </div>
        <div
          data-reveal="up"
          data-reveal-delay="150"
          className="mt-10 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <div className="inline-flex gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="rounded-lg border border-gray-200 px-6 py-4 flex flex-col gap-y-1 hover:border-red-600 hover:shadow-lg transition-all duration-200 bg-white text-center min-w-[180px]"
              >
                <span className="text-lg font-semibold">{sanitize(brand.name)}</span>
                {typeof brand.productCount === "number" && (
                  <span className="text-sm text-gray-500">{brand.productCount} items</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsCarousel;