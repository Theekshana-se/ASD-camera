"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FaTag, FaArrowRight, FaPercent, FaGift } from "react-icons/fa6";
import apiClient from "@/lib/api";

type Banner = {
  id: string;
  imageUrl: string;
  title?: string;
  href?: string;
  position: string;
  order: number;
  active: boolean;
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default function PromotionsPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Fetch all banners from the API
        const res = await apiClient.get("/api/banners", { cache: "no-store" });

        if (res.ok) {
          const data = await res.json();

          // Filter for active banners with position "promotion"
          const activeBanners = Array.isArray(data)
            ? data.filter((b: Banner) => b.active && b.position === "promotion")
            : [];

          setBanners(activeBanners.sort((a, b) => a.order - b.order));
        } else {
          // Set empty array so page still renders
          setBanners([]);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden flex items-center justify-center">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gray-950">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[url('/introback.png')] bg-cover bg-no-repeat opacity-30 mix-blend-overlay"
          />
          {/* Animated Gradients */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-4">
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide flex items-center gap-2">
                <FaGift className="text-red-500" />
                Exclusive Offers
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Promotions</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Grab the best deals on premium camera equipment and accessories. Limited time offers you don&apos;t want to miss.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Banners Grid Section */}
      <section className="py-20 px-6 max-w-screen-2xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/1] rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTag className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Active Promotions</h3>
            <p className="text-gray-500 mt-2">Check back soon for exciting new offers!</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {banners.map((banner) => (
              <motion.div
                key={banner.id}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative rounded-3xl overflow-hidden shadow-xl bg-white ring-1 ring-black/5 aspect-[3/1.1] md:aspect-[3/1.1]"
              >
                {/* Banner Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(banner.imageUrl)}
                    alt={banner.title || "Promotion"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {banner.title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-white font-bold text-xl md:text-2xl drop-shadow-lg mb-2 z-10"
                    >
                      {banner.title}
                    </motion.h3>
                  )}

                  {banner.href && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={banner.href}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white hover:text-red-600 transition-all duration-300 z-10"
                      >
                        Shop Now <FaArrowRight />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Decorative Sticker/Badge (Optional Visual Flair) */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg rotate-12">
                    <FaPercent className="text-sm" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 py-24 mb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Stay Updated with <span className="text-red-600">Hot Deals</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Subscribe to our newsletter to receive instant notifications about new promotions, equipment arrivals, and exclusive discounts.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
              />
              <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -ml-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mb-32" />
      </section>
    </div>
  );
}
