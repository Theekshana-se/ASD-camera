"use client";
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlassPlus, FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6';
import { getImageUrl } from '@/lib/utils';

interface ModernProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ModernProductGallery({ images, productName }: ModernProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageUrls = images.map(img => getImageUrl(img));

  const nextImage = () => {
    setSelectedImage(prev => prev < imageUrls.length - 1 ? prev + 1 : 0);
  };

  const prevImage = () => {
    setSelectedImage(prev => prev > 0 ? prev - 1 : imageUrls.length - 1);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div 
          className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group border border-gray-200"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageUrls[selectedImage]}
            alt={productName}
            fill
            className="object-contain p-8"
            priority
          />
          
          {/* Zoom Button */}
          <motion.button
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMagnifyingGlassPlus className="text-red-600 text-lg" />
          </motion.button>

          {/* Navigation Arrows */}
          {imageUrls.length > 1 && (
            <>
              <motion.button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronLeft className="text-red-600" />
              </motion.button>
              <motion.button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronRight className="text-red-600" />
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
            {selectedImage + 1} / {imageUrls.length}
          </div>
        </motion.div>

        {/* Thumbnails */}
        {imageUrls.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {imageUrls.map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx 
                    ? 'border-red-500 ring-2 ring-red-500/30 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src={img} alt={`${productName} view ${idx + 1}`} fill className="object-cover" />
                {selectedImage === idx && (
                  <div className="absolute inset-0 bg-red-500/10" />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaXmark className="text-2xl" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imageUrls[selectedImage]}
                alt={productName}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Navigation in zoom mode */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white"
                >
                  <FaChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white"
                >
                  <FaChevronRight className="text-2xl" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
