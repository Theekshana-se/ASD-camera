import {
  CategoryMenu,
  Hero,
  IntroducingSection,
  OurServicesSection,
  OfferItemsSection,
  HotDealsSection,
  FeaturedProductsSection,
  BrandsCarousel,
} from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
    <ScrollReveal />
    <Hero />
    <IntroducingSection />
    <OurServicesSection />
    <HotDealsSection />
    <FeaturedProductsSection />
    <OfferItemsSection />
    <BrandsCarousel />
    </>
  );
}
