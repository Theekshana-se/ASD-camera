import { SectionTitle } from "@/components";
import React from "react";

export default function ClientsPage() {
  return (
    <div className="bg-white text-black">
      <SectionTitle title="Our Clients" path="Home | Our Clients" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-2xl font-bold">Trusted By</h2>
        <p className="text-gray-700">
          Explore brands and partners we collaborate with to deliver quality products and services.
        </p>
      </div>
    </div>
  );
}
