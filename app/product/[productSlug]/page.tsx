import {
  StockAvailabillity,
  UrgencyText,
  SingleProductDynamicFields,
  ModernProductGallery,
  ProductInfoTabs,
} from "@/components";
import apiClient from "@/lib/api";
import { getCachedProduct, getCachedProductImages } from "@/lib/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";
import { formatCategoryName } from "@/utils/categoryFormating";
import type { Metadata } from 'next';
import { getImageUrl } from "@/lib/utils";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

// Enable ISR with 10-minute revalidation for product pages
export const revalidate = 600;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: SingleProductPageProps): Promise<Metadata> {
  const paramsAwaited = await params;
  
  try {
    const product = await getCachedProduct(paramsAwaited?.productSlug);
    
    return {
      title: `${sanitize(product?.title)} | Electronics Shop`,
      description: sanitize(product?.description) || `Buy ${sanitize(product?.title)} at the best price`,
      openGraph: {
        title: sanitize(product?.title),
        description: sanitize(product?.description) || '',
        images: [product?.mainImage || '/product_placeholder.jpg'],
      },
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  
  // Use cached data fetchers for better performance
  let product, images;
  
  try {
    product = await getCachedProduct(paramsAwaited?.productSlug);
    images = await getCachedProductImages(product?.id);
  } catch (error) {
    notFound();
  }

  const isAvailable = Boolean(product?.inStock);
  const safeCategory = product?.category?.name
    ? sanitize(formatCategoryName(product.category.name))
    : "No category";
  const featureList = [
    { label: "Brand", value: sanitize(product?.manufacturer || "N/A") },
    { label: "Category", value: safeCategory },
    { label: "Rating", value: `${product?.rating || 0} / 5` },
    {
      label: "Fulfillment",
      value: isAvailable
        ? "Available for delivery or pickup"
        : "Currently unavailable",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 pt-10 px-5">
          {/* Left: Modern Image Gallery */}
          <ModernProductGallery
            images={[
              product?.mainImage,
              ...(Array.isArray(images) ? images.map((img: any) => img?.image) : [])
            ].filter(Boolean)}
            productName={sanitize(product?.title)}
          />
          <div className="flex flex-col gap-y-7 text-[#1A1F2E] max-[500px]:text-center">
            <h1 className="text-3xl font-bold">{sanitize(product?.title)}</h1>
            <p className="text-xl font-semibold text-[#4B5563]">
              Rent price / day:{" "}
              <span className="text-[#FF1F1F] font-bold">${product?.price}</span>
            </p>
            <StockAvailabillity
              stock={product?.inStock || 0}
              inStock={product?.inStock}
            />
            <UrgencyText stock={Math.max(product?.inStock || 0, 0)} />
            <p className="text-lg text-[#4B5563]">
              Booking status:{" "}
              <span className={isAvailable ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {isAvailable
                  ? "Available for your selected dates"
                  : "Fully booked"}
              </span>
            </p>
            <div className="text-left max-[500px]:text-center">
              <h2 className="text-lg font-bold mb-2 text-[#1A1F2E]">Features</h2>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7280] max-[500px]:list-none max-[500px]:pl-0">
                {featureList.map((feature) => (
                  <li key={feature.label}>
                    <span className="font-semibold text-[#1A1F2E]">
                      {feature.label}:
                    </span>{" "}
                    {feature.value}
                  </li>
                ))}
              </ul>
            </div>
            <SingleProductDynamicFields product={product} />
            <div className="flex flex-col gap-y-2 max-[500px]:items-center">
             
              <p className="text-lg text-[#4B5563]">
                SKU: <span className="ml-1 text-[#6B7280]">abccd-18</span>
              </p>
              <div className="text-lg flex gap-x-2 text-[#4B5563]">
                <span>Share:</span>
                <div className="flex items-center gap-x-1 text-2xl text-[#6B7280] hover:text-[#FF1F1F] transition-colors">
                  <FaSquareFacebook className="hover:text-[#FF1F1F] cursor-pointer transition-colors" />
                  <FaSquareXTwitter className="hover:text-[#FF1F1F] cursor-pointer transition-colors" />
                  <FaSquarePinterest className="hover:text-[#FF1F1F] cursor-pointer transition-colors" />
                </div>
              </div>
              <div className="flex gap-x-2">
                <Image
                  src="/visa.svg"
                  width={50}
                  height={50}
                  alt="visa icon"
                  className="w-auto h-auto"
                />
                <Image
                  src="/mastercard.svg"
                  width={50}
                  height={50}
                  alt="mastercard icon"
                  className="h-auto w-auto"
                />
                <Image
                  src="/ae.svg"
                  width={50}
                  height={50}
                  alt="americal express icon"
                  className="h-auto w-auto"
                />
                <Image
                  src="/paypal.svg"
                  width={50}
                  height={50}
                  alt="paypal icon"
                  className="w-auto h-auto"
                />
                <Image
                  src="/dinersclub.svg"
                  width={50}
                  height={50}
                  alt="diners club icon"
                  className="h-auto w-auto"
                />
                <Image
                  src="/discover.svg"
                  width={50}
                  height={50}
                  alt="discover icon"
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Modern Tabbed Product Information */}
        <div className="py-16 px-5">
          <ProductInfoTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
