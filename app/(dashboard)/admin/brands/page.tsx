"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTags,
  FaPlus,
  FaMagnifyingGlass,
  FaPen,
  FaTrash,
  FaArrowRight,
  FaImage
} from "react-icons/fa6";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import Image from "next/image";

type Brand = { id: string; name: string; imageUrl?: string };

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImage, setNewBrandImage] = useState("");

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/brands");
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const deleteBrand = async (id: string) => {
    // if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await apiClient.delete(`/api/brands/${id}`);
      if (res.status === 204) {
        setBrands((prev) => prev.filter((b) => b.id !== id));
        toast.success("Brand deleted");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete brand");
      }
    } catch {
      toast.error("Error deleting brand");
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = { name: newBrandName.trim() };
      if (newBrandImage.trim()) payload.imageUrl = newBrandImage.trim();

      const response = await apiClient.post("/api/brands", payload);

      if (response.status === 201) {
        toast.success("Brand created successfully");
        setNewBrandName("");
        setNewBrandImage("");
        fetchBrands();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create brand");
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FaTags className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Brands</h1>
              <p className="text-gray-400">Manage product brands</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

            {/* LEFT COLUMN: LIST */}
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>

              {/* Brands List */}
              <div className="grid gap-3">
                <AnimatePresence>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800" />
                    ))
                  ) : filteredBrands.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800 border-dashed">
                      <FaTags className="mx-auto text-3xl text-gray-600 mb-3" />
                      <p className="text-gray-400">No brands found</p>
                    </div>
                  ) : (
                    filteredBrands.map((brand, index) => (
                      <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
                              {brand.imageUrl ? (
                                <img src={brand.imageUrl} alt={brand.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-gray-400 font-bold text-lg">
                                  {brand.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {brand.name}
                              </h3>
                              {brand.imageUrl && (
                                <a href={brand.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
                                  <FaImage className="text-[10px]" /> View Logo
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/admin/brands/${brand.id}`}>
                              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                <FaPen className="text-sm" />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteBrand(brand.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT COLUMN: CREATE FORM */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <FaPlus className="text-cyan-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Add New Brand</h2>
              </div>

              <form onSubmit={handleCreateBrand} className="space-y-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-gray-400">Brand Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sony, Canon"
                    className="input input-bordered bg-gray-800 border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-gray-400">Logo URL (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="input input-bordered bg-gray-800 border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                    value={newBrandImage}
                    onChange={(e) => setNewBrandImage(e.target.value)}
                  />

                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Or upload an image:</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered file-input-sm w-full bg-gray-800 border-gray-700 text-gray-300"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewBrandImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {newBrandImage && (
                    <div className="mt-2 text-xs text-gray-500">
                      Preview: <div className="inline-block align-middle w-6 h-6 ml-2 bg-white rounded overflow-hidden"><img src={newBrandImage} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} /></div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-none"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    <>
                      Create Brand <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
}