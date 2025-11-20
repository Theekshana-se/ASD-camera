"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Image from "next/image";

type ActivePopup = {
  id: string;
  name: string;
  imageUrl: string;
};

const FirstVisitPopup = () => {
  const [popup, setPopup] = useState<ActivePopup | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname || "";
    if (path.startsWith("/admin")) return;
    const load = async () => {
      try {
        const res = await apiClient.get("/api/popups/active");
        const data = await res.json();
        if (!data || !data?.id) return;
        setPopup({ id: data.id, name: data.name, imageUrl: data.imageUrl });
        setOpen(true);
      } catch {}
    };
    load();
  }, []);

  const close = () => {
    setOpen(false);
  };

  if (!open || !popup) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl shadow-xl w-[95%] max-w-3xl p-4 relative">
        <button className="absolute right-4 top-4" onClick={close}>✕</button>
        <div className="font-bold text-xl mb-4">{popup.name}</div>
        <div className="relative w-full h-[420px] rounded-xl overflow-hidden">
          <Image src={popup.imageUrl} alt={popup.name} fill className="object-contain" />
        </div>
        <div className="mt-6 text-center">
          <button className="btn btn-error" onClick={close}>Got it!</button>
        </div>
      </div>
    </div>
  );
};

export default FirstVisitPopup;