"use client";
import { SectionTitle } from "@/components";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import apiClient from "@/lib/api";

type ClientLogo = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  href?: string | null;
  order: number;
  active: boolean;
};

export default function ClientsPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await apiClient.get("/api/client-logos");
        const data = await res.json();
        // Filter only active logos and sort by order
        const activeLogos = (Array.isArray(data) ? data : [])
          .filter((logo: ClientLogo) => logo.active)
          .sort((a: ClientLogo, b: ClientLogo) => a.order - b.order);
        setLogos(activeLogos);
      } catch (error) {
        console.error("Failed to fetch client logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] min-h-screen">
      <SectionTitle title="Our Clients" path="Home | Our Clients" />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-screen-2xl mx-auto px-10 max-md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                Trusted Partners
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-[#1A1F2E] mb-6 leading-tight">
              Trusted by Industry{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1F1F] to-[#FF6B6B]">
                Leaders
              </span>
            </h1>

            <p className="text-xl text-[#4B5563] leading-relaxed">
              We're proud to partner with leading brands and organizations worldwide. 
              Our commitment to excellence has earned the trust of industry leaders across various sectors.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            {[
              { number: logos.length + "+", label: "Trusted Clients", icon: "🤝" },
              { number: "50+", label: "Countries Served", icon: "🌍" },
              { number: "99%", label: "Satisfaction Rate", icon: "⭐" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 rounded-2xl transition-all duration-300" />
                <div className="relative text-center">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-bold text-[#1A1F2E] mb-2 font-mono">
                    {stat.number}
                  </div>
                  <div className="text-sm text-[#6B7280] uppercase tracking-wider font-semibold">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Client Logos Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-12 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-[#1A1F2E] text-center mb-12">
              Our Valued Partners
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-32 rounded-xl"
                  />
                ))}
              </div>
            ) : logos.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🏢</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1F2E] mb-3">
                  No Client Logos Yet
                </h3>
                <p className="text-[#6B7280] max-w-md mx-auto">
                  We're building partnerships with amazing brands. Check back soon to see our growing list of trusted clients!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {logos.map((logo, index) => (
                  <motion.div
                    key={logo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group"
                  >
                    {logo.href ? (
                      <a
                        href={logo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-red-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 rounded-xl transition-all duration-300" />
                        <div className="relative w-full h-20 flex items-center justify-center">
                          <Image
                            src={logo.imageUrl}
                            alt={logo.alt || "Client logo"}
                            width={150}
                            height={80}
                            className="object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </a>
                    ) : (
                      <div className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-red-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 rounded-xl transition-all duration-300" />
                        <div className="relative w-full h-20 flex items-center justify-center">
                          <Image
                            src={logo.imageUrl}
                            alt={logo.alt || "Client logo"}
                            width={150}
                            height={80}
                            className="object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 text-center bg-gradient-to-br from-[#1A1F2E] via-[#2A2F3E] to-[#1A1F2E] rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }}
              />
            </div>

            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-[80px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Want to Join Our Partners?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                We're always looking to collaborate with innovative brands and organizations. 
                Let's create something amazing together.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF1F1F] to-[#FF4444] text-white font-bold text-lg rounded-lg hover:shadow-[0_0_40px_rgba(255,31,31,0.6)] transition-all duration-300 hover:scale-105"
              >
                <span>Get In Touch</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
