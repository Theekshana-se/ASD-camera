import {
  CategoryMenu,
  Hero,
  IntroducingSection,
  OfferItemsSection,
  BrandsShowcase,
  ProductsSection,
} from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
    <ScrollReveal />
    <Hero />
    <CategoryMenu />
    <IntroducingSection />
    <OfferItemsSection />
    <BrandsShowcase />
    <ProductsSection />
    </>
  );
}
