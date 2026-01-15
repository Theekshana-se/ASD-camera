"use client";
import Heading from "./Heading";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import apiClient from "@/lib/api";
import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Slider = dynamic(() => import("react-slick"), { ssr: false }) as any;
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { motion } from "framer-motion";

type LogoItem = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  href?: string | null;
  active: boolean;
};

export default function BrandsCarousel() {
  const [items, setItems] = React.useState<LogoItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const PrevArrow = (props: any) => (
    <motion.button
      whileHover={{ scale: 1.1, x: -4 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Previous"
      onClick={props.onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#E5E7EB] text-[#1A1F2E] shadow-lg hover:bg-[#FF1F1F] hover:border-[#FF1F1F] hover:text-white hover:shadow-xl flex items-center justify-center transition-all duration-300"
    >
      <FaChevronLeft />
    </motion.button>
  );

  const NextArrow = (props: any) => (
    <motion.button
      whileHover={{ scale: 1.1, x: 4 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Next"
      onClick={props.onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#E5E7EB] text-[#1A1F2E] shadow-lg hover:bg-[#FF1F1F] hover:border-[#FF1F1F] hover:text-white hover:shadow-xl flex items-center justify-center transition-all duration-300"
    >
      <FaChevronRight />
    </motion.button>
  );

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/api/brands");
        if (res.ok) {
          const data = await res.json();
          const arr = (Array.isArray(data) ? data : [])
            .filter((b: any) => b?.imageUrl) // Filter brands with images
            .map((b: any) => ({
              id: b.id,
              imageUrl: b.imageUrl,
              alt: b.name,
              href: `/shop?brand=${encodeURIComponent(b.id)}`,
              active: true,
            }));

          // Deduplicate by ID just in case
          const uniqueItems = Array.from(new Map(arr.map((item: any) => [item.id, item])).values()) as LogoItem[];
          setItems(uniqueItems);
        } else {
          console.error("Failed to fetch brands");
          setItems([]);
        }
      } catch (e) {
        console.error("Error loading brands:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const settings = {
    arrows: true,
    dots: true,
    infinite: items.length > 4, // Only loop if enough items
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(items.length, 4), slidesToScroll: 1, infinite: items.length > 3 } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(items.length, 3), slidesToScroll: 1, infinite: items.length > 2 } },
      { breakpoint: 640, settings: { slidesToShow: Math.min(items.length, 2), slidesToScroll: 1, infinite: items.length > 1 } },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  } as const;

  return (
    <section className="relative bg-white border-t border-[#E5E7EB] overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Subtle Red Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative max-w-screen-2xl mx-auto py-24 px-10 max-sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-px w-16 bg-gradient-to-r from-[#FF1F1F] to-transparent"
            />
            <h2 className="text-5xl lg:text-6xl font-bold text-[#1A1F2E] uppercase tracking-tight">
              Trusted Brands
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-lg text-[#6B7280] ml-22"
          >
            Partnering with the world&apos;s leading camera and equipment manufacturers
          </motion.p>
        </motion.div>

        {/* Brands Grid/Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          {loading ? (
            <div className="grid grid-cols-5 gap-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="h-32 bg-[#F8F9FA] rounded-xl animate-pulse border border-[#E5E7EB]"
                />
              ))}
            </div>
          ) : (
            <div className="relative px-12 max-sm:px-0">
              <Slider {...settings}>
                {items.map((it, index) => (
                  <div key={it.id} className="px-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link href={it.href || "#"} className="block group">
                        <motion.div
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E5E7EB] hover:border-[#FF1F1F] overflow-hidden"
                        >
                          {/* Hover Red Glow */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-500"
                          />

                          {/* Brand Logo */}
                          <div className="relative h-24 w-full flex items-center justify-center">
                            <Image
                              src={getImageUrl(it.imageUrl)}
                              alt={it.alt || "Brand"}
                              width={200}
                              height={96}
                              className="object-contain h-full w-auto max-w-full filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                          </div>

                          {/* Brand Name */}
                          <div className="mt-4 text-center">
                            <div className="text-sm font-bold text-[#6B7280] group-hover:text-[#FF1F1F] transition-colors duration-300 uppercase tracking-wider">
                              {it.alt || "Brand"}
                            </div>
                          </div>

                          {/* Corner Accent */}
                          <motion.div
                            className="absolute top-0 right-0 w-12 h-12 bg-[#FF1F1F]/0 group-hover:bg-[#FF1F1F]/10"
                            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                          />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-6 max-md:grid-cols-1"
        >
          {[
            { number: "50+", label: "Premium Brands" },
            { number: "1000+", label: "Products Available" },
            { number: "24/7", label: "Customer Support" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative bg-white rounded-xl p-8 text-center border border-[#E5E7EB] shadow-sm hover:shadow-lg hover:border-[#FF1F1F] transition-all duration-300 group overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-300" />

              <div className="relative">
                <div className="text-5xl font-bold text-[#1A1F2E] font-mono group-hover:text-[#FF1F1F] transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="mt-3 text-sm text-[#6B7280] font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}