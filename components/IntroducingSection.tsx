// *********************
// Role of the component: IntroducingSection with the text "Introducing Singitronic"
// Name of the component: IntroducingSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <IntroducingSection />
// Input parameters: no input parameters
// Output: Section with the text "Introducing Singitronic" and button
// *********************

import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <div className="relative border-t border-gray-100 min-h-[600px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/introback.png')" }}>
      <div className="relative max-w-screen-2xl mx-auto px-10 text-center flex flex-col gap-y-6 items-center py-24">
          <h2 data-reveal="up" className="text-6xl font-bold text-neutral-900 text-center mb-2 max-md:text-5xl max-[480px]:text-4xl">
            INTRODUCING <span className="text-neutral-900">ASD </span><span className="text-red-600"> CAMERA</span>
          </h2>
          <div className="max-w-3xl">
            <p data-reveal="up" data-reveal-delay="150" className="text-neutral-800 text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
              Buy the latest electronics.
            </p>
            <p data-reveal="up" data-reveal-delay="300" className="text-neutral-800 text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
              The best electronics for tech lovers.
            </p>
            <p data-reveal="up" data-reveal-delay="300" className="text-gray-600 text-center text-lg max-md:text-base mt-2">
              Premium rentals and sales with flexible terms, fast delivery and expert support — everything you need for cameras, audio and pro gear in one place.
            </p>
            <Link
              href="/shop"
              data-reveal="up"
              data-reveal-delay="300"
              className="block border border-red-600 text-red-700 font-bold px-12 py-3 text-lg hover:bg-red-600 hover:text-white w-80 mt-4 max-md:text-base max-md:w-72 max-[480px]:w-60 mx-auto"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
  );
};

export default IntroducingSection;
