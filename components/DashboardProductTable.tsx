// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Updated with modern design
// Version: 2.0
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table with modern dark theme
// *********************

"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaPen, FaTrash, FaMagnifyingGlass, FaFilter, FaBox } from "react-icons/fa6";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    apiClient.get("/api/products?mode=admin", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.error || "Failed to fetch products");
          setProducts([]);
          return;
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast.error("Network error while fetching products");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/products/${id}`);
    if (res.status === 204) {
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else if (res.status === 400) {
      toast.error("Cannot delete product due to order references");
    } else {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => 
    sanitize(p.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sanitize(p.manufacturer)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <FaBox className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-gray-400 text-sm">{products.length} total products</p>
          </div>
        </div>
        
        <Link href="/admin/products/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
          >
            <FaPlus className="text-sm" />
            Add Product
          </motion.button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:border-gray-600 transition-colors"
        >
          <FaFilter className="text-sm" />
          Filters
        </motion.button>
      </div>

      {/* Table Container */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700">
                <th className="px-6 py-4 text-left">
                  <label className="relative flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="sr-only peer" 
                    />
                    <div className="w-5 h-5 bg-gray-700 border border-gray-600 rounded peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                      {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </label>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-5 h-5 bg-gray-800 rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-gray-800 rounded" />
                          <div className="w-20 h-3 bg-gray-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-800 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-4 bg-gray-800 rounded" /></td>
                    <td className="px-6 py-4"><div className="w-20 h-8 bg-gray-800 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FaBox className="text-gray-600 text-2xl" />
                      </div>
                      <p className="text-gray-400 font-medium">No products found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your search or add a new product</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.02 }}
                      className="group hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <label className="relative flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleSelect(product.id)}
                            className="sr-only peer" 
                          />
                          <div className="w-5 h-5 bg-gray-700 border border-gray-600 rounded peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                            {selectedProducts.has(product.id) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                            <Image
                              fill
                              src={
                                product?.mainImage
                                  ? (product.mainImage.startsWith("data:") || product.mainImage.startsWith("http")
                                      ? product.mainImage
                                      : `/${product.mainImage}`)
                                  : "/product_placeholder.jpg"
                              }
                              alt={sanitize(product?.title) || "Product image"}
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate max-w-[200px]">{sanitize(product?.title)}</p>
                            <p className="text-gray-500 text-sm truncate max-w-[200px]">{sanitize(product?.manufacturer) || "No manufacturer"}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {product?.inStock ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            Out of Stock
                          </span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">Rs.{Number(product?.price || 0).toLocaleString()}</span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2.5 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                            >
                              <FaPen className="text-sm" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => remove(product.id)}
                            className="p-2.5 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{filteredProducts.length}</span> of <span className="text-white font-medium">{products.length}</span> products
            </p>
            {selectedProducts.size > 0 && (
              <p className="text-red-400 text-sm">
                <span className="font-medium">{selectedProducts.size}</span> selected
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProductTable;
