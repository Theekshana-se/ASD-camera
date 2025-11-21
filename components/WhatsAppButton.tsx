"use client";
import React from "react";

const WhatsAppButton = ({ number }: { number?: string }) => {
  if (!number) return null;
  const href = `https://wa.me/${number.replace(/[^+\d]/g, "")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-[1000] rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 px-4 py-3"
    >
      Chat on WhatsApp
    </a>
  );
};

export default WhatsAppButton;