import { SectionTitle } from "@/components";
import React from "react";

export default function PromotionsPage() {
  return (
    <div className="bg-white text-black">
      <SectionTitle title="Promotions" path="Home | Promotions" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-2xl font-bold">Latest Offers</h2>
        <p className="text-gray-700">
          Discover special deals and rent offers available this season.
        </p>
      </div>
    </div>
  );
}
