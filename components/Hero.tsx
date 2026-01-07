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
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Slider = dynamic(() => import("react-slick"), { ssr: false }) as any;
import { useSettings } from "@/Providers";

const Hero = () => {
  const settingsData = useSettings() || {};
  const [sliderItems, setSliderItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const sres = await fetch(`${config.apiBaseUrl}/api/slider?active=true`);
        const sdata = await sres.json();
        setSliderItems(Array.isArray(sdata) ? sdata.filter((i: any) => i?.imageUrl) : []);
      } catch {
        setSliderItems([]);
      }
    };
    load();
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentItem = sliderItems[currentIdx] || null;
  const title = currentItem?.title || settingsData?.heroTitle || "THE PRODUCT OF THE FUTURE";
  const subtitle =
    currentItem?.subtitle || settingsData?.heroSubtitle ||
    "Discover premium gear for rent — cameras, laptops, TVs and more.";

  const slides = sliderItems.length
    ? sliderItems.map((i) => i.imageUrl)
    : [settingsData?.heroImageUrl || "/pexels-format-1029757.jpg"];

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
    afterChange: (i: number) => setCurrentIdx(i),
  } as const;

  const sliderRef = useRef<any | null>(null);

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
                sizes="100vw"
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
        <div className="col-span-2 max-lg:order-last flex flex-col gap-y-6 lg:pl-20">
          <h1 className="text-6xl text-white font-extrabold max-xl:text-5xl max-md:text-4xl max-sm:text-3xl fade-up">
            {title}
          </h1>
          <p className="text-white/90 max-sm:text-sm fade-up delay-150">
            {subtitle}
          </p>
          <div className="flex gap-x-4 max-lg:flex-col max-lg:gap-y-3 fade-up delay-300">
            {currentItem?.ctaHref ? (
              <a href={currentItem?.ctaHref} className="bg-white text-neutral-900 font-bold px-12 py-3 rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-0.5">
                {currentItem?.ctaText || "Learn More"}
              </a>
            ) : (
              <button className="bg-white text-neutral-900 font-bold px-12 py-3 rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-0.5">
                Shop Now
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
