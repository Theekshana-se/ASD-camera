"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaRectangleAd, FaPlus, FaTrash, FaEye, FaCheck, FaXmark, FaUpload, FaStar } from "react-icons/fa6";

type PopupItem = {
  id: string;
  name: string;
  imageUrl: string;
  enabled: boolean;
  isActive: boolean;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PopupsAdminPage() {
  const [items, setItems] = useState<PopupItem[]>([]);
  const [preview, setPreview] = useState<PopupItem | null>(null);
  const [showEnabled, setShowEnabled] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [image64, setImage64] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await apiClient.get("/api/popups");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    const sres = await apiClient.get("/api/settings");
    const sdata = await sres.json();
    setShowEnabled(sdata?.showPopupEnabled !== undefined ? !!sdata.showPopupEnabled : true);
    setLoading(false);
  };
  
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name || !image64) { toast.error("Image and name are required"); return; }
    const res = await apiClient.post("/api/popups", { name, imageUrl: image64, enabled: true });
    if (res.status === 201) { 
      toast.success("Popup created"); 
      setName(""); 
      setImage64(""); 
      load(); 
    } else {
      toast.error("Failed to create popup");
    }
  };

  const setActive = async (id: string) => {
    const res = await apiClient.put(`/api/popups/${id}/activate`);
    if (res.ok) { 
      toast.success("Set as active popup"); 
      load(); 
    }
  };

  const toggleEnabled = async (item: PopupItem) => {
    const res = await apiClient.put(`/api/popups/${item.id}`, { enabled: !item.enabled });
    if (res.ok) { 
      toast.success(item.enabled ? "Disabled" : "Enabled");
      load(); 
    }
  };

  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/popups/${id}`);
    if (res.status === 204) { 
      toast.success("Deleted"); 
      load(); 
    }
  };

  const updateShowEnabled = async (value: boolean) => {
    setShowEnabled(value);
    const res = await apiClient.put("/api/settings", { showPopupEnabled: value });
    if (res.ok) {
      toast.success(value ? "Popups enabled" : "Popups disabled");
    } else {
      toast.error("Failed to update");
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
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FaRectangleAd className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Popup Messages</h1>
                <p className="text-gray-400 text-sm">{items.length} popup items</p>
              </div>
            </div>

            {/* Global Toggle */}
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
              <span className="text-sm font-medium text-gray-300">Show Popups</span>
              <button
                onClick={() => updateShowEnabled(!showEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showEnabled ? "bg-indigo-500" : "bg-gray-700"
                }`}
              >
                <motion.div
                  animate={{ x: showEnabled ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Create Popup Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaPlus className="text-indigo-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Create Popup</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Popup Image</label>
                  <label className="flex flex-col items-center gap-3 px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <FaUpload className="text-gray-500 text-3xl" />
                    <span className="text-sm text-gray-400">Click to upload image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={async (e: any) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const b64 = await fileToBase64(f);
                        setImage64(b64);
                      }}
                    />
                  </label>
                  {image64 && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                        <FaCheck />
                        <span>Image uploaded successfully</span>
                      </div>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image src={image64} alt="Preview" fill className="object-contain bg-gray-800" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Popup Name</label>
                  <input
                    placeholder="Enter popup name"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={create}
                  disabled={!name || !image64}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus className="text-sm" />
                  Create Popup
                </motion.button>
              </div>
            </motion.div>

            {/* Popups List Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaRectangleAd className="text-indigo-400 text-sm" />
                </div>
                <h2 className="text-lg font-semibold text-white">Popup Items</h2>
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
                    <p className="text-gray-400 font-medium">No popups yet</p>
                    <p className="text-gray-500 text-sm mt-1">Create your first popup</p>
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
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image 
                                src={item.imageUrl} 
                                alt={item.name} 
                                fill 
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-medium truncate">{item.name}</h3>
                                {item.isActive && (
                                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full">
                                    <FaStar className="text-[10px]" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.enabled 
                                  ? "bg-green-500/10 text-green-400" 
                                  : "bg-gray-500/10 text-gray-400"
                              }`}>
                                {item.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!item.isActive && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setActive(item.id)}
                                  className="p-2.5 bg-gray-800 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 rounded-lg transition-colors"
                                  title="Set as active"
                                >
                                  <FaStar className="text-sm" />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setPreview(item)}
                                className="p-2.5 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                                title="Preview"
                              >
                                <FaEye className="text-sm" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleEnabled(item)}
                                className="p-2.5 bg-gray-800 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 rounded-lg transition-colors"
                                title={item.enabled ? "Disable" : "Enable"}
                              >
                                {item.enabled ? <FaCheck className="text-sm" /> : <FaXmark className="text-sm" />}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => remove(item.id)}
                                className="p-2.5 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                                title="Delete"
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

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{preview.name}</h3>
                <button
                  onClick={() => setPreview(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <FaXmark className="text-xl" />
                </button>
              </div>
              <div className="p-6">
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-800">
                  <Image 
                    src={preview.imageUrl} 
                    alt={preview.name} 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPreview(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}