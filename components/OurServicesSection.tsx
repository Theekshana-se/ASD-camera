"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaTruck, FaLightbulb, FaHandHoldingDollar } from "react-icons/fa6";

const items = [
  {
    icon: <FaTruck className="text-4xl" />,
    title: "Free Transport",
    desc:
      "Based on the requirements of our customers, free transport will be provided subject to stipulated terms & conditions of the contract.",
  },
  {
    icon: <FaLightbulb className="text-4xl" />,
    title: "Free advice",
    desc:
      "We are available on our hotline, 24 hours a day & 365 days of the year, to provide free advice and consultancy to anyone in our field of work.",
  },
  {
    icon: <FaHandHoldingDollar className="text-4xl" />,
    title: "Money Back Repayment",
    desc:
      "Subject to the conditions and our failure to honour the obligations of the contract, we will refund your money if we find the circumstances justify such refund.",
  },
];

export default function OurServicesSection() {
  return (
    <section className="relative py-24 bg-white border-y border-[#E5E7EB] overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-10 max-sm:px-5">
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
              Our Services
            </h2>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, index) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -8 }}
              className="group bg-[#F8F9FA] border border-[#E5E7EB] hover:border-[#FF1F1F] rounded-lg p-8 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF1F1F] to-red-800 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {it.icon}
              </div>
              <div className="font-bold text-xl mb-3 text-[#1A1F2E]">{it.title}</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}