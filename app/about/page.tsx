"use client";
import React from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { FaAward, FaClock, FaUsers, FaShieldAlt } from "react-icons/fa";
import { useSettings } from "@/Providers";

export default function AboutPage() {
  const settings = useSettings() || {};
  const heroTitle = settings?.heroTitle || "ASD Camera Rent";
  const heroSubtitle = settings?.heroSubtitle || "Empowering creativity through professional camera equipment and expert services";
  const heroImage = settings?.heroImageUrl || "/pexels-format-1029757.jpg";

  return (
    <div className="bg-white text-black">
      <ScrollReveal />

      {/* Hero */}
      <section className="relative h-[520px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt="About hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/55 to-black/75" />
        <div className="absolute inset-0">
          <div className="max-w-screen-2xl mx-auto h-full px-10 grid items-center">
            <div data-reveal="up" className="space-y-4">
              <h1 className="text-5xl font-extrabold text-white max-md:text-4xl">
                {heroTitle.split(" ").slice(0, 1).join(" ")}{" "}
                <span className="text-red-500">
                  {heroTitle.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="text-white/90 max-w-2xl">
                {heroSubtitle} since 2010
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 -mt-12 relative">
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2">
            <div data-reveal="up" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <FaAward className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold">15+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>
            <div data-reveal="up" data-reveal-delay="150" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <FaClock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold">24/7</div>
                <div className="text-sm text-gray-600">Service Available</div>
              </div>
            </div>
            <div data-reveal="up" data-reveal-delay="300" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <FaUsers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold">1000+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
            </div>
            <div data-reveal="up" data-reveal-delay="450" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold">100%</div>
                <div className="text-sm text-gray-600">Reliable Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-16">
          <div data-reveal="up" className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Our <span className="text-red-600">Services</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <div data-reveal="up" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="text-lg font-semibold">Camera Equipment Rental</div>
              <div className="text-gray-700 mt-2">Professional cameras and videography equipment for all your creative needs.</div>
            </div>
            <div data-reveal="up" data-reveal-delay="150" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 6l4 6H8l4-6z" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="text-lg font-semibold">Photographer Supply</div>
              <div className="text-gray-700 mt-2">Skilled photographers ready to capture your perfect moments.</div>
            </div>
            <div data-reveal="up" data-reveal-delay="300" className="relative group hover-wave rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="text-lg font-semibold">Videographer Services</div>
              <div className="text-gray-700 mt-2">Expert videographers for films, TV, advertising, and events.</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Our Story */}
      <section className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-10">
          <div data-reveal="up" className="mb-8 text-center">
            <h2 className="text-3xl font-bold">About <span className="text-red-600">Our Story</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
            <div data-reveal="up" className="relative hover-wave rounded-2xl bg-neutral-900 text-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="text-lg font-semibold mb-2">Since 2010</div>
              <p className="text-white/85">
                ASD Camera Rent is a premier company providing camera & videography equipment and photographer & videographer supply services in Sri Lanka since 2010.
              </p>
            </div>
            <div data-reveal="up" className="relative group hover-wave rounded-2xl bg-white ring-1 ring-black/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="text-lg font-semibold mb-2">24/7 Availability</div>
              <p className="text-gray-700">
                Our operations and services are available 24 hours a day & 7 days every week, delivering instant solutions to your continuing needs.
              </p>
            </div>
            <div data-reveal="up" className="relative hover-wave rounded-2xl bg-neutral-900 text-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="text-lg font-semibold mb-2">Trusted Partnership</div>
              <p className="text-white/85">
                Operating as an affiliate under Vimukthi Holdings, we maintain strong partnerships to ensure quality and reliability.
              </p>
            </div>
            <div data-reveal="up" className="relative group hover-wave rounded-2xl bg-white ring-1 ring-black/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:ring-red-200">
              <div className="text-lg font-semibold mb-2">Our Commitment</div>
              <p className="text-gray-700">
                Our goal is to provide services in a consistent, reliable, and timely manner, supporting your creative journey end‑to‑end.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute w-40 h-40 bg-white/5 rounded-full -left-10 top-10" />
          <div className="pointer-events-none absolute w-40 h-40 bg-white/5 rounded-full -right-10 bottom-10" />
        </div>
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800">
          <div className="max-w-screen-2xl mx-auto px-6 py-16 text-center">
            <h2 data-reveal="up" className="text-3xl font-bold text-white">
              Ready to Create <span className="text-red-500">Something Amazing?</span>
            </h2>
            <p data-reveal="up" data-reveal-delay="150" className="text-white/85 mt-3">
              Let us help you bring your vision to life with our professional equipment and expert services.
            </p>
            <a
              data-reveal="up"
              data-reveal-delay="300"
              href="/contact"
              className="inline-flex mt-6 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
