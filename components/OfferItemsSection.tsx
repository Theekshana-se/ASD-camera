import Heading from "./Heading";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";

const OfferItemsSection = async () => {
  let offers: Product[] = [];

  try {
    const response = await apiClient.get(
      "/api/products?filters[isOfferItem][$equals]=true&sort=defaultSort&page=1",
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        offers = data.slice(0, 4);
      }
    }
  } catch (error) {
    console.error("Failed to fetch offer items", error);
  }

  if (!offers.length) {
    return null;
  }

  return (
    <section className="bg-gray-50 border-y border-gray-200">
      <div className="max-w-screen-2xl mx-auto py-16 px-10 max-sm:px-5">
        <Heading title="LIMITED-TIME RENT OFFERS" />
        <div className="grid grid-cols-4 justify-items-center gap-x-5 gap-y-8 mt-10 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {offers.map((product) => (
            <ProductItem key={product.id} product={product} color="black" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferItemsSection;



