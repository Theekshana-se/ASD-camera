"use client";
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactSlick = dynamic(() => import("react-slick"), { ssr: false }) as any;

type GalleryProps = {
  main: string;
  images: string[];
};

const ProductGallery: React.FC<GalleryProps> = ({ main, images }) => {
  const all = [main, ...images.filter((i) => i && i !== main)];
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  const current = all[idx] || all[0];

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (i: number) => setIdx(i),
  };

  return (
    <div className="flex gap-4 max-lg:flex-col">
      <div className="flex-1">
        <div className="relative w-full h-[480px] bg-white border rounded-lg overflow-hidden group">
          <Image
            src={current?.startsWith("/") || current?.startsWith("http") ? current : `/${current}`}
            alt="Product"
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {all.map((img, i) => (
            <button key={`${img}-${i}`} className={`relative h-20 w-24 border rounded-md ${i===idx? 'ring-2 ring-red-600':''}`} onClick={()=>setIdx(i)}>
              <Image src={img?.startsWith("/") || img?.startsWith("http") ? img : `/${img}`} alt="thumb" fill className="object-contain" />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={()=>setOpen(false)}>
          <div className="w-full max-w-4xl px-6" onClick={(e)=>e.stopPropagation()}>
            <ReactSlick {...settings}>
              {all.map((img, i) => (
                <div key={`${img}-modal-${i}`} className="relative h-[70vh]">
                  <Image src={img?.startsWith("/") || img?.startsWith("http") ? img : `/${img}`} alt="modal" fill className="object-contain" />
                </div>
              ))}
            </ReactSlick>
            <button className="mt-4 px-4 py-2 rounded bg-white" onClick={()=>setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;