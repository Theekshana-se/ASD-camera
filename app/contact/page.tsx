import { SectionTitle } from "@/components";
import React from "react";

export default function ContactPage() {
  return (
    <div className="bg-white text-black">
      <SectionTitle title="Contact Us" path="Home | Contact Us" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-2xl font-bold">Get In Touch</h2>
        <p className="text-gray-700">
          Reach us via phone or email for rentals, support, and inquiries.
        </p>
      </div>
    </div>
  );
}
