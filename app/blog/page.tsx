import { SectionTitle } from "@/components";
import React from "react";

export default function BlogPage() {
  return (
    <div className="bg-white text-black">
      <SectionTitle title="Blog" path="Home | Blog" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-2xl font-bold">Latest Articles</h2>
        <p className="text-gray-700">
          Read tips, reviews, and guides on cameras and electronics.
        </p>
      </div>
    </div>
  );
}
