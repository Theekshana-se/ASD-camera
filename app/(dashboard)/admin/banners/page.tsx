"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaRectangleAd, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaLink, FaUpload, FaCheck, FaImage } from "react-icons/fa6";
import Image from "next/image";

type Banner = {
  id: string;
  imageUrl: string;
  title?: string | null;
  href?: string | null;
  position: string;
  order: number;
  active: boolean;
};

export default function PromotionsAdminPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [form, setForm] = useState<Partial<Banner>>({ active: true, order: 0, position: "promotion" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await apiClient.get("/api/banners");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  
  useEffect(() => { load(); }, []);

  const onFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      // Reusing the slider upload endpoint as it provides a generic image upload capability
      const res = await fetch(`${apiClient.baseUrl}/api/slider/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data?.url) {
        setForm({ ...form, imageUrl: data.url });
        toast.success("Image uploaded");
      } else {
        toast.error(String(data?.error || "Upload failed"));
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const create = async () => {
    if (!form.imageUrl) { toast.error("Image required"); return; }
    const res = await apiClient.post("/api/banners", form);
    if (res.status === 201) { 
      toast.success("Promotion created"); 
      setForm({ active: true, order: 0, position: "promotion" }); 
      load(); 
    } else {
      toast.error("Failed to create");
    }
  };

  const update = async (id: string, patch: Partial<Banner>) => {
    const res = await apiClient.put(`/api/banners/${id}`, patch);
    if (res.ok) { 
      toast.success("Updated");
      load(); 
    }
  };
  
  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/banners/${id}`);
    if (res.status === 204) { 
      toast.success("Deleted"); 
      load(); 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FaRectangleAd className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Promotions Control</h1>
                <p className="text-gray-400 text-sm">{items.length} active promotions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Add Promotion Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaPlus className="text-orange-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Add New Promotion</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Promotion Image</label>
                  <label className="flex flex-col items-center gap-3 px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors">
                    <FaUpload className="text-gray-500 text-3xl" />
                    <span className="text-sm text-gray-400">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => onFileChange(e.target.files)} 
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  
                  {/* Image URL fallback/edit */}
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FaImage />
                    </div>
                    <input
                      placeholder="Or enter image URL manually..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
                      value={form.imageUrl || ""}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    />
                  </div>

                  {form.imageUrl && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                        <FaCheck />
                        <span>Image ready</span>
                      </div>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                      <Image 
                        src={getImageUrl(form.imageUrl)} 
                        alt="Preview" 
                        fill 
                        className="object-cover"
                        onError={() => toast.error("Invalid image URL")}
                      />
                    </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Title (Optional)</label>
                  <input
                    placeholder="e.g., Summer Sale 50% Off"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Link URL (Optional)</label>
                  <input
                    placeholder="/shop/products/camera-lens"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    value={form.href || ""}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Position</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      value={form.position || "promotion"}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                    >
                      <option value="promotion">Promotion Page</option>
                      <option value="home">Home Page</option>
                      <option value="shop">Shop Page</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Order</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      value={form.order || 0}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-sm font-medium text-gray-300">Active Status</span>
                  <button
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      form.active ? "bg-orange-500" : "bg-gray-700"
                    }`}
                  >
                    <motion.div
                      animate={{ x: form.active ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={create}
                  disabled={!form.imageUrl}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus className="text-sm" />
                  Publish Promotion
                </motion.button>
              </div>
            </motion.div>

            {/* List Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaRectangleAd className="text-orange-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Active Promotions</h2>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-800/50 h-24 rounded-xl" />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <FaRectangleAd className="text-gray-600 text-2xl" />
                    </div>
                    <p className="text-gray-400 font-medium">No promotions created yet</p>
                    <p className="text-gray-500 text-sm mt-1">Create your first promotion to display it on the website</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                              <Image 
                                src={item.imageUrl} 
                                alt={item.title || "Promotion"} 
                                fill 
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">
                                {item.title || "Untitled Promotion"}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full">
                                  {item.position}
                                </span>
                                <span className="text-xs text-gray-600">Order: {item.order}</span>
                              </div>
                              {item.href && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                  <FaLink className="text-[10px]" />
                                  <span className="truncate">{item.href}</span>
                                </div>
                              )}
                              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                                item.active 
                                  ? "bg-green-500/10 text-green-400" 
                                  : "bg-gray-500/10 text-gray-400"
                              }`}>
                                {item.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => update(item.id, { active: !item.active })}
                                className="p-2.5 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                              >
                                {item.active ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => remove(item.id)}
                                className="p-2.5 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                              >
                                <FaTrash className="text-sm" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}