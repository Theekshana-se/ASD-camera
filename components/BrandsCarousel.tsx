"use client";
import Heading from "./Heading";
import Link from "next/link";
import apiClient from "@/lib/api";
import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Slider = dynamic(() => import("react-slick"), { ssr: false }) as any;
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

type LogoItem = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  href?: string | null;
  active: boolean;
};

export default function BrandsCarousel() {
  const [items, setItems] = React.useState<LogoItem[]>([]);

  const PrevArrow = (props: any) => (
    <button
      aria-label="Previous"
      onClick={props.onClick}
      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white border border-neutral-300 shadow flex items-center justify-center"
    >
      <FaChevronLeft className="text-black" />
    </button>
  );
  const NextArrow = (props: any) => (
    <button
      aria-label="Next"
      onClick={props.onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white border border-neutral-300 shadow flex items-center justify-center"
    >
      <FaChevronRight className="text-black" />
    </button>
  );

  React.useEffect(() => {
    const load = async () => {
      try {
        const bres = await apiClient.get("/api/brands");
        let arr: LogoItem[] = [];
        if (bres.ok) {
          const bdata = await bres.json();
          arr = (Array.isArray(bdata) ? bdata : [])
            .filter((b: any) => b?.name)
            .slice(0, 12)
            .map((b: any, idx: number) => ({
              id: b.id || String(idx),
              imageUrl: b.imageUrl || "/logo.png",
              alt: b.name,
              href: `/shop?brand=${encodeURIComponent(b.name)}`,
              active: true,
            }));
        }
        if (!arr.length || arr.every((i) => !i.imageUrl || i.imageUrl === "/logo.png")) {
          const res = await apiClient.get("/api/client-logos");
          const data = await res.json();
          const logos: LogoItem[] = Array.isArray(data) ? data.filter((i: any) => i?.imageUrl) : [];
          arr = logos.length ? logos : arr;
        }
        setItems(arr);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);

  // Always show section; if items empty, show nothing inside slider as graceful fallback.

  const settings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  } as const;

  return (
    <section className="bg-neutral-50">
      <div className="max-w-screen-2xl mx-auto py-16 px-6">
        <div data-reveal="up" className="mb-8">
          <Heading title="OUR BRANDS" />
        </div>
        <div className="bg-white rounded-2xl shadow border border-neutral-200 px-4 py-6 relative overflow-hidden">
          <Slider {...settings}>
            {items.map((it) => (
              <div key={it.id} className="px-3">
                <Link href={it.href || "#"} className="block group text-center">
                  <div className="mx-auto h-20 w-full relative">
                    <Image
                      src={it.imageUrl}
                      alt={it.alt || "Brand"}
                      width={200}
                      height={80}
                      className="mx-auto object-contain h-20 w-auto"
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-800 group-hover:text-red-600">
                    {it.alt || "Brand"}
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}