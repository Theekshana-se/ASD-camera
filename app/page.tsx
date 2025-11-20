import {
  CategoryMenu,
  Hero,
  IntroducingSection,
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
    <HotDealsSection />
    <FeaturedProductsSection />
    <OfferItemsSection />
    <BrandsCarousel />
    </>
  );
}
