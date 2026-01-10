"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaImages, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaUpload, FaCheck } from "react-icons/fa6";

type Item = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaHref?: string | null;
  order: number;
  active: boolean;
};

export default function ImagesSliderAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Partial<Item>>({ active: true, order: 0 });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await apiClient.get("/api/slider");
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
    const res = await apiClient.post("/api/slider", form);
    if (res.status === 201) { 
      toast.success("Slider item created"); 
      setForm({ active: true, order: 0 }); 
      load(); 
    } else {
      toast.error("Failed to create");
    }
  };

  const update = async (id: string, patch: Partial<Item>) => {
    const res = await apiClient.put(`/api/slider/${id}`, patch);
    if (res.ok) { 
      toast.success("Updated");
      load(); 
    }
  };
  
  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/slider/${id}`);
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
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                <FaImages className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Images Slider</h1>
                <p className="text-gray-400 text-sm">{items.length} slider items</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Add New Item Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaPlus className="text-pink-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Add Slider Item</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Slider Image</label>
                  <label className="flex flex-col items-center gap-3 px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-pink-500/50 transition-colors">
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
                  {form.imageUrl && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <FaCheck />
                        <span>Image uploaded successfully</span>
                      </div>
                      <img src={form.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Title (Optional)</label>
                  <input
                    placeholder="Enter slider title"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Subtitle (Optional)</label>
                  <input
                    placeholder="Enter slider subtitle"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    value={form.subtitle || ""}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">CTA Text</label>
                    <input
                      placeholder="Shop Now"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      value={form.ctaText || ""}
                      onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">CTA Link</label>
                    <input
                      placeholder="/shop"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      value={form.ctaHref || ""}
                      onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    value={form.order || 0}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-sm font-medium text-gray-300">Active</span>
                  <button
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      form.active ? "bg-pink-500" : "bg-gray-700"
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
                  disabled={!form.imageUrl || uploading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus className="text-sm" />
                  Create Slider Item
                </motion.button>
              </div>
            </motion.div>

            {/* Items List Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaImages className="text-pink-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Slider Items</h2>
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
                      <FaImages className="text-gray-600 text-2xl" />
                    </div>
                    <p className="text-gray-400 font-medium">No slider items yet</p>
                    <p className="text-gray-500 text-sm mt-1">Create your first slider item</p>
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
                            <img 
                              src={item.imageUrl} 
                              alt={item.title || "Slider"} 
                              className="w-24 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">
                                {item.title || "Untitled Slide"}
                              </h3>
                              <p className="text-gray-500 text-sm truncate">
                                {item.subtitle || "No subtitle"}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-600">Order: {item.order}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.active 
                                    ? "bg-green-500/10 text-green-400" 
                                    : "bg-gray-500/10 text-gray-400"
                                }`}>
                                  {item.active ? "Active" : "Inactive"}
                                </span>
                              </div>
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