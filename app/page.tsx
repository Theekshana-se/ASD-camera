import {
  CategoryMenu,
  IntroducingSection,
  OurServicesSection,
  OfferItemsSection,
  HotDealsSection,
  FeaturedProductsSection,
  BrandsCarousel,
} from "@/components";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedHeroSlider from "@/components/AnimatedHeroSlider";
import React from "react";
import { getSiteSettings } from "@/lib/site-settings";

// Enable ISR - revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

// Add metadata for SEO
export const metadata = {
  title: "Electronics eCommerce Shop - Best Deals on Electronics",
  description: "Shop the latest electronics with amazing deals and fast delivery",
};

export default async function Home() {
  const settings = await getSiteSettings();
  
  return (
    <>
    <ScrollReveal />
    <AnimatedHeroSlider settings={settings} />
    <IntroducingSection />
    <OurServicesSection />
    <HotDealsSection />
    <FeaturedProductsSection />
    <OfferItemsSection />
    <BrandsCarousel />
    </>
  );
}
