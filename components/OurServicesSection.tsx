"use client";
import React from "react";
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
    <section
      className="relative py-16 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url(/pexels-lex-photography-1109543.jpg)" }}
    >
      <div className="absolute inset-0 bg-white/70" />
      <div className="relative max-w-screen-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 data-reveal="up" className="text-3xl md:text-4xl font-bold text-neutral-900">Our Services</h2>
          <div className="mx-auto mt-3 h-1 w-24 bg-red-600 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="group bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-neutral-200 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-400 text-white flex items-center justify-center mb-4">
                {it.icon}
              </div>
              <div className="font-semibold text-lg mb-2 text-neutral-900">{it.title}</div>
              <p className="text-sm text-neutral-700 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}