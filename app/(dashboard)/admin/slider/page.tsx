"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import apiClient from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaImage, FaPlus, FaTrash, FaPen, FaCheck, FaXmark, FaArrowUp, FaArrowDown, FaUpload, FaSpinner } from "react-icons/fa6";
import toast from "react-hot-toast";
import Image from "next/image";

interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  active: boolean;
}

const AdminSliderPage = () => {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SliderItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/slider");
      const data = await res.json();
      setSlides(data || []);
    } catch (error) {
      toast.error("Failed to load slides");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleSave = async (slide: Partial<SliderItem>) => {
    try {
      if (slide.id) {
        // Update existing
        await fetch(`/api/slider/${slide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slide),
        });
        toast.success("Slide updated successfully!");
      } else {
        // Create new
        await fetch("/api/slider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slide),
        });
        toast.success("Slide created successfully!");
      }
      setEditingId(null);
      setShowAddForm(false);
      setEditForm({});
      loadSlides();
    } catch (error) {
      toast.error("Failed to save slide");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    try {
      await fetch(`/api/slider/${id}`, {
        method: "DELETE",
      });
      toast.success("Slide deleted successfully!");
      loadSlides();
    } catch (error) {
      toast.error("Failed to delete slide");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/slider/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      toast.success(`Slide ${!active ? "activated" : "deactivated"}!`);
      loadSlides();
    } catch (error) {
      toast.error("Failed to update slide");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = slides.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

    // Update orders
    try {
      await Promise.all(
        newSlides.map((slide, idx) =>
          fetch(`/api/slider/${slide.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: idx }),
          })
        )
      );
      toast.success("Order updated!");
      loadSlides();
    } catch (error) {
      toast.error("Failed to reorder slides");
    }
  };

  const startEdit = (slide: SliderItem) => {
    setEditingId(slide.id);
    setEditForm(slide);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditForm({
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "Shop Now",
      ctaHref: "/shop",
      order: slides.length,
      active: true,
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/slider/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      const imageUrl = data.url;
      
      setEditForm({ ...editForm, imageUrl });
      setImagePreview(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <FaImage className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Hero Slider</h1>
                  <p className="text-gray-400 text-sm">Manage homepage slider images and content</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startAdd}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
              >
                <FaPlus className="text-sm" />
                Add Slide
              </motion.button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add Form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Add New Slide</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Title"
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle"
                          value={editForm.subtitle || ""}
                          onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* Image Upload Section */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-400">Slide Image</label>
                        
                        {/* Upload Button */}
                        <label className="flex items-center justify-center gap-3 px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/70 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            disabled={uploading}
                          />
                          {uploading ? (
                            <>
                              <FaSpinner className="text-blue-400 text-xl animate-spin" />
                              <span className="text-gray-400">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <FaUpload className="text-gray-500 text-xl" />
                              <span className="text-gray-400">Click to upload image</span>
                              <span className="text-gray-600 text-sm">(Max 5MB)</span>
                            </>
                          )}
                        </label>

                        {/* Image Preview */}
                        {(editForm.imageUrl || imagePreview) && (
                          <div className="relative w-full h-48 bg-gray-800 rounded-xl overflow-hidden">
                            <Image
                              src={editForm.imageUrl || imagePreview || ""}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Manual URL Input */}
                        <input
                          type="text"
                          placeholder="Or paste image URL"
                          value={editForm.imageUrl || ""}
                          onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Button Text"
                          value={editForm.ctaText || ""}
                          onChange={(e) => setEditForm({ ...editForm, ctaText: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                        <input
                          type="text"
                          placeholder="Button Link"
                          value={editForm.ctaHref || ""}
                          onChange={(e) => setEditForm({ ...editForm, ctaHref: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setShowAddForm(false);
                            setEditForm({});
                          }}
                          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(editForm)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Create Slide
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slides List */}
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-900/50 border rounded-2xl overflow-hidden ${
                    slide.active ? "border-gray-800" : "border-gray-800/50 opacity-60"
                  }`}
                >
                  {editingId === slide.id ? (
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Title"
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle"
                          value={editForm.subtitle || ""}
                          onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* Image Upload Section */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-400">Slide Image</label>
                        
                        {/* Upload Button */}
                        <label className="flex items-center justify-center gap-3 px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/70 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            disabled={uploading}
                          />
                          {uploading ? (
                            <>
                              <FaSpinner className="text-blue-400 text-xl animate-spin" />
                              <span className="text-gray-400">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <FaUpload className="text-gray-500 text-xl" />
                              <span className="text-gray-400">Click to upload image</span>
                              <span className="text-gray-600 text-sm">(Max 5MB)</span>
                            </>
                          )}
                        </label>

                        {/* Image Preview */}
                        {editForm.imageUrl && (
                          <div className="relative w-full h-48 bg-gray-800 rounded-xl overflow-hidden">
                            <Image
                              src={editForm.imageUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Manual URL Input */}
                        <input
                          type="text"
                          placeholder="Or paste image URL"
                          value={editForm.imageUrl || ""}
                          onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Button Text"
                          value={editForm.ctaText || ""}
                          onChange={(e) => setEditForm({ ...editForm, ctaText: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                        <input
                          type="text"
                          placeholder="Button Link"
                          value={editForm.ctaHref || ""}
                          onChange={(e) => setEditForm({ ...editForm, ctaHref: e.target.value })}
                          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(editForm)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 p-6">
                      {/* Image Preview */}
                      <div className="relative w-48 h-32 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                        {slide.imageUrl && (
                          <Image
                            src={slide.imageUrl}
                            alt={slide.title || "Slide"}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{slide.title || "Untitled"}</h3>
                        <p className="text-sm text-gray-400 mt-1">{slide.subtitle}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs">
                            {slide.ctaText}
                          </span>
                          <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-lg text-xs">
                            → {slide.ctaHref}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReorder(slide.id, "up")}
                            disabled={index === 0}
                            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaArrowUp className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleReorder(slide.id, "down")}
                            disabled={index === slides.length - 1}
                            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaArrowDown className="text-sm" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleToggleActive(slide.id, slide.active)}
                          className={`p-2 rounded-lg transition-colors ${
                            slide.active
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {slide.active ? <FaCheck className="text-sm" /> : <FaXmark className="text-sm" />}
                        </button>
                        <button
                          onClick={() => startEdit(slide)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          <FaPen className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(slide.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {slides.length === 0 && !showAddForm && (
                <div className="text-center py-12 text-gray-500">
                  <FaImage className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No slides yet. Click "Add Slide" to create your first one!</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSliderPage;
