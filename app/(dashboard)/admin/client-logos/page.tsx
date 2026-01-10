"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import { getImageUrl } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaLink } from "react-icons/fa6";
import Image from "next/image";

type Logo = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  href?: string | null;
  order: number;
  active: boolean;
};

export default function ClientLogosAdminPage() {
  const [items, setItems] = useState<Logo[]>([]);
  const [form, setForm] = useState<Partial<Logo>>({ active: true, order: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await apiClient.get("/api/client-logos");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.imageUrl) { toast.error("Image URL required"); return; }
    const res = await apiClient.post("/api/client-logos", form);
    if (res.status === 201) { 
      toast.success("Logo added"); 
      setForm({ active: true, order: 0 }); 
      load(); 
    } else {
      toast.error("Failed to add");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch(`${apiClient.baseUrl}/api/client-logos/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.urls && data.urls.length > 0) {
        setForm({ ...form, imageUrl: data.urls[0] });
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  };

  const update = async (id: string, patch: Partial<Logo>) => {
    const res = await apiClient.put(`/api/client-logos/${id}`, patch);
    if (res.ok) { 
      toast.success("Updated");
      load(); 
    }
  };
  
  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/client-logos/${id}`);
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
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Client Logos</h1>
                <p className="text-gray-400 text-sm">{items.length} client logos</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Add Logo Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaPlus className="text-teal-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Add Client Logo</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Logo Image URL</label>
                  <input
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={form.imageUrl || ""}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                  {form.imageUrl && (
                    <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden bg-gray-800 p-4 flex items-center justify-center">
                      <Image 
                        src={getImageUrl(form.imageUrl)} 
                        alt="Preview" 
                        width={120}
                        height={60}
                        className="object-contain"
                        onError={() => toast.error("Invalid image URL")}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Alt Text</label>
                  <input
                    placeholder="Client name"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={form.alt || ""}
                    onChange={(e) => setForm({ ...form, alt: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Website Link (Optional)</label>
                  <input
                    placeholder="https://client-website.com"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={form.href || ""}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={form.order || 0}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-sm font-medium text-gray-300">Active</span>
                  <button
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      form.active ? "bg-teal-500" : "bg-gray-700"
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus className="text-sm" />
                  Add Client Logo
                </motion.button>
              </div>
            </motion.div>

            {/* Logos List Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-teal-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Client Logos</h2>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-800/50 h-24 rounded-xl" />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <FaUsers className="text-gray-600 text-2xl" />
                    </div>
                    <p className="text-gray-400 font-medium">No client logos yet</p>
                    <p className="text-gray-500 text-sm mt-1">Add your first client logo</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="relative w-full h-20 rounded-lg overflow-hidden bg-gray-800/50 flex items-center justify-center mb-3">
                            <Image 
                              src={item.imageUrl} 
                              alt={item.alt || "Client logo"} 
                              width={100}
                              height={50}
                              className="object-contain"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-white text-sm font-medium truncate">
                              {item.alt || "Untitled Logo"}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <span>Order: {item.order}</span>
                            </div>
                            {item.href && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                                <FaLink className="text-[10px] flex-shrink-0" />
                                <span className="truncate">{item.href}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.active 
                                  ? "bg-green-500/10 text-green-400" 
                                  : "bg-gray-500/10 text-gray-400"
                              }`}>
                                {item.active ? "Active" : "Inactive"}
                              </span>
                              <div className="flex items-center gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => update(item.id, { active: !item.active })}
                                  className="p-1.5 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                                >
                                  {item.active ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => remove(item.id)}
                                  className="p-1.5 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                                >
                                  <FaTrash className="text-xs" />
                                </motion.button>
                              </div>
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