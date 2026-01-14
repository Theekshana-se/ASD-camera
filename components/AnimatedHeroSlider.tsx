"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  order: number;
}

const defaultSlides: Slide[] = [
  {
    id: "1",
    title: "Premium Camera Equipment",
    subtitle: "2026 Collection",
    description: "Professional gear for photographers, videographers, and content creators. Rent the best equipment at unbeatable prices.",
    imageUrl: "/hero-camera.png",
    ctaText: "Explore Equipment",
    ctaLink: "/shop",
    order: 0,
  },
  {
    id: "2",
    title: "Professional Lenses",
    subtitle: "Crystal Clear Quality",
    description: "Capture every moment with precision. Our premium lens collection delivers stunning clarity and performance.",
    imageUrl: "/slider image 1.webp",
    ctaText: "Browse Lenses",
    ctaLink: "/shop",
    order: 1,
  },
  {
    id: "3",
    title: "Studio Lighting",
    subtitle: "Perfect Illumination",
    description: "Transform your photography with professional lighting equipment. Create the perfect ambiance for every shot.",
    imageUrl: "/slider image 2.webp",
    ctaText: "View Lighting",
    ctaLink: "/shop",
    order: 2,
  },
];

export default function AnimatedHeroSlider({ settings }: { settings?: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(true);

  // Fetch slides from database
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/slider");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            // Transform database slides to match our interface
            const dbSlides: Slide[] = data.map((item: any) => ({
              id: item.id,
              title: item.title || "Featured Product",
              subtitle: item.subtitle || "New Arrival",
              description: "", // Database doesn't have description, can be added later
              imageUrl: item.imageUrl,
              ctaText: item.ctaText || "Shop Now",
              ctaLink: item.ctaHref || "/shop",
              order: item.order || 0,
            }));
            setSlides(dbSlides);
          }
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
        // Keep using default slides on error
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-[90vh] overflow-hidden flex items-center">
      {/* Animated Blurred Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0]" />
          {current.imageUrl.startsWith('data:image/') ? (
            <img
              src={current.imageUrl}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl scale-110"
            />
          ) : (
            <Image
              src={current.imageUrl}
              alt="Background"
              fill
              className="object-cover opacity-20 blur-3xl scale-110"
              priority={currentSlide === 0}
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] z-[1]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Pulsing Red Glow */}
      <motion.div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[120px] z-[1]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative max-w-screen-2xl mx-auto px-10 py-20 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content with Instant Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current.id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-8 max-lg:text-center"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full shadow-lg"
              >
                <div className="w-2 h-2 bg-[#FF1F1F] rounded-full animate-pulse" />
                <span className="text-sm text-[#4B5563] font-semibold uppercase tracking-wider">
                  {current.subtitle}
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-6xl lg:text-7xl font-bold text-[#1A1F2E] leading-[1.1] tracking-tight"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {current.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-xl text-[#4B5563] leading-relaxed max-w-xl max-lg:mx-auto"
              >
                {current.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex gap-4 max-lg:justify-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={current.ctaLink}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#1A1F2E] text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#FF1F1F] hover:text-white shadow-xl"
                  >
                    <span className="relative z-10">{current.ctaText}</span>
                    <svg
                      className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
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
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-sm border-2 border-[#1A1F2E]/20 text-[#1A1F2E] font-bold rounded-lg hover:border-[#FF1F1F] hover:text-[#FF1F1F] transition-all duration-300 shadow-lg"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>

              {/* Slide Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3 pt-4 max-lg:justify-center"
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-12 bg-[#FF1F1F]"
                        : "w-8 bg-[#1A1F2E]/20 hover:bg-[#1A1F2E]/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Instant Image Transition with Blur Effect */}
          <div className="relative flex items-center justify-center max-lg:mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${current.id}`}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: 15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Floating Product */}
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="relative w-full max-w-lg aspect-square">
                    {current.imageUrl.startsWith('data:image/') ? (
                      <img
                        src={current.imageUrl}
                        alt={current.title}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    ) : (
                      <Image
                        src={current.imageUrl}
                        alt={current.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority={currentSlide === 0}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Pulsing Glow Behind Product */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-[100px]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Decorative Circles */}
            <motion.div
              className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-24 h-24 border border-red-500/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 max-md:hidden"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-[#1A1F2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 max-md:hidden"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-[#1A1F2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider text-[#6B7280]">Scroll</span>
          <svg className="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
