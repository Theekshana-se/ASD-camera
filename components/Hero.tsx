// *********************
// Role of the component: Animated hero with image slider
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Animated hero with cross‑fading, kenburns slider and CTA
// *********************

"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import config from "@/lib/config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hero = () => {
  const [settingsData, setSettingsData] = useState<any>({});

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/api/settings`, { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => setSettingsData(d))
      .catch(() => setSettingsData({}));
  }, []);

  const title = settingsData?.heroTitle || "THE PRODUCT OF THE FUTURE";
  const subtitle =
    settingsData?.heroSubtitle ||
    "Discover premium gear for rent — cameras, laptops, TVs and more.";

  const slides = [
    "/pexels-format-1029757.jpg",
    "/pexels-lex-photography-1109543.jpg",
    "/tv.jpg",
    "/camera 1.png",
    "/laptop 4.webp",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    cssEase: "ease-in-out",
  } as const;

  const sliderRef = useRef<Slider | null>(null);

  return (
    <section className="relative h-[720px] w-full max-lg:h-[900px] max-md:h-[750px] overflow-hidden">
      <div className="absolute inset-0">
        <Slider
          ref={sliderRef as any}
          {...sliderSettings}
          className="h-full"
        >
          {slides.map((src, idx) => (
            <div key={idx} className="relative h-[720px] max-lg:h-[900px] max-md:h-[750px]">
              <Image
                src={src}
                alt="hero slide"
                fill
                priority={idx === 0}
                unoptimized
                className="object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-black/40 to-black/70 pointer-events-none" />
            </div>
          ))}
        </Slider>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/35 backdrop-blur flex items-center justify-center border border-white/50 hover:bg-black/50 transition-colors"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/35 backdrop-blur flex items-center justify-center border border-white/50 hover:bg-black/50 transition-colors"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 max-w-screen-2xl mx-auto h-full px-10 grid grid-cols-3 items-center max-lg:grid-cols-1">
        <div className="col-span-2 max-lg:order-last flex flex-col gap-y-6">
          <h1 className="text-6xl text-white font-extrabold max-xl:text-5xl max-md:text-4xl max-sm:text-3xl fade-up">
            {title}
          </h1>
          <p className="text-white/90 max-sm:text-sm fade-up delay-150">
            {subtitle}
          </p>
          <div className="flex gap-x-4 max-lg:flex-col max-lg:gap-y-3 fade-up delay-300">
            <button className="bg-white text-neutral-900 font-bold px-12 py-3 rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-0.5">
              BUY NOW
            </button>
            <button className="bg-white/80 backdrop-blur text-neutral-900 font-bold px-12 py-3 rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-0.5">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
