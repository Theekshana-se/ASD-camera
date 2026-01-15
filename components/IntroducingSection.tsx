// *********************
// Role of the component: IntroducingSection with animated background and stunning typography
// Name of the component: IntroducingSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <IntroducingSection />
// Input parameters: no input parameters
// Output: Animated section with video background and "ASD CAMERA" branding
// *********************

"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const IntroducingSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [particles, setParticles] = React.useState<any[]>([]);

  useEffect(() => {
    // Generate particles on client side to avoid hydration mismatch
    setParticles(
      [...Array(20)].map(() => ({
        x: Math.random() * 100 + "%",
        y: Math.random() * 100 + "%",
        yEnd: Math.random() * -100 - 100 + "%",
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
    );

    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, user interaction required
      });
    }
  }, []);

  return (
    <section className="relative min-h-[700px] overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      {/* Animated Video Background */}
      <div className="absolute inset-0 opacity-30">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2023/05/02/160748-822707462_large.mp4" type="video/mp4" />
          {/* Fallback gradient if video doesn't load */}
        </video>
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            initial={{
              x: p.x,
              y: p.y,
            }}
            animate={{
              y: [null, p.yEnd],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Red Glow Effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content */}
      <div className="relative max-w-screen-2xl mx-auto px-10 text-center flex flex-col gap-y-8 items-center justify-center min-h-[700px] py-20">
        {/* Eyebrow Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300 font-semibold uppercase tracking-widest">
            Premium Equipment
          </span>
        </motion.div>

        {/* Main Heading - INTRODUCING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-400 uppercase tracking-[0.3em] max-md:tracking-[0.2em]">
            Introducing
          </h2>

          {/* ASD CAMERA - Large Two-Tone Typography */}
          <div className="relative">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[180px] font-black leading-none tracking-tight">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-300 drop-shadow-2xl">
                ASD{" "}
              </span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-[#FF1F1F] via-[#FF4444] to-[#FF6B6B] drop-shadow-[0_0_30px_rgba(255,31,31,0.5)]">
                CAMERA
              </span>
            </h1>

            {/* Animated Underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4 origin-center"
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl space-y-4"
        >
          <p className="text-gray-300 text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-lg">
            Capture Every Moment in Stunning Detail
          </p>
          <p className="text-gray-400 text-center text-lg max-md:text-base leading-relaxed">
            Premium camera rentals and sales with flexible terms, fast delivery, and expert support —
            everything you need for professional photography and videography in one place.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/shop"
            className="group relative inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-[#FF1F1F] to-[#FF4444] text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,31,31,0.6)] hover:scale-105"
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <span className="relative z-10 uppercase tracking-wider">Explore Collection</span>

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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-12 pt-8 max-md:gap-8 max-sm:flex-col max-sm:gap-4"
        >
          {[
            { number: "500+", label: "Premium Cameras" },
            { number: "50+", label: "Top Brands" },
            { number: "24/7", label: "Expert Support" },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl font-bold text-white font-mono mb-1 group-hover:text-red-500 transition-colors">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F9FA] to-transparent" />
    </section>
  );
};

export default IntroducingSection;
