"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCircleInfo, FaGear, FaTruckFast, FaCircleCheck } from 'react-icons/fa6';

const tabs = [
  { id: 'description', label: 'Description', icon: FaCircleInfo },
  { id: 'specifications', label: 'Specifications', icon: FaGear },
  { id: 'shipping', label: 'Shipping & Returns', icon: FaTruckFast },
];

interface ProductInfoTabsProps {
  product: {
    description?: string;
    features?: string[];
    manufacturer?: string;
    [key: string]: any;
  };
}

export default function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-12">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="text-lg" />
              {tab.label}
              
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-8"
      >
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Product Description</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description || 'No description available.'}
              </p>
            </div>
            {product.manufacturer && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Manufacturer:</span> {product.manufacturer}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'specifications' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Technical Specifications</h3>
            {product.features && product.features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                  >
                    <FaCircleCheck className="text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </div>
        )}
        
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Shipping & Returns</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200">
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <FaTruckFast className="text-green-600" />
                  Shipping Information
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Free shipping on orders over Rs.5,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Estimated delivery: 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Express shipping available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Track your order in real-time</span>
                  </li>
                </ul>
              </div>

              {/* Returns Info */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <FaCircleCheck className="text-blue-600" />
                  Return Policy
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-blue-500 mt-1 flex-shrink-0" />
                    <span>30-day return policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-blue-500 mt-1 flex-shrink-0" />
                    <span>Free returns on defective items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-blue-500 mt-1 flex-shrink-0" />
                    <span>Easy return process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCircleCheck className="text-blue-500 mt-1 flex-shrink-0" />
                    <span>Full refund or exchange</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
