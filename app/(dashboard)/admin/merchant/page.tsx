"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaStore, FaPlus, FaEye, FaPen, FaCheck, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa6";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  image: string | null;
  status: string;
  products: any[];
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    image: "",
    status: "ACTIVE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/merchants");
      if (!response.ok) {
        throw new Error("Failed to fetch merchants");
      }
      const data = await response.json();
      setMerchants(data);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Merchant name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post("/api/merchants", formData);

      if (!response.ok) {
        throw new Error("Failed to create merchant");
      }

      toast.success("Merchant created successfully");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        image: "",
        status: "ACTIVE",
      });
      // Refresh list
      fetchMerchants();
    } catch (error) {
      console.error("Error creating merchant:", error);
      toast.error("Failed to create merchant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FaStore className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Merchants</h1>
                <p className="text-gray-400 text-sm">Manage seller accounts and create new ones</p>
              </div>
            </div>
          </motion.div>

          {/* Main Grid: Left = List, Right = Form */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* Left Column: Merchant List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-200px)]">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaStore className="text-blue-500" />
                    Active / Inactive Merchants
                  </h2>
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                    {merchants.length} Total
                  </span>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  ) : merchants.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No merchants found.</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {merchants.map((merchant) => (
                        <motion.div
                          key={merchant.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 hover:border-blue-500/30 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-700">
                              {merchant.image ? (
                                <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                  <FaStore className="text-xl" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-white font-semibold truncate pr-2">{merchant.name}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${merchant.status === 'ACTIVE'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}>
                                  {merchant.status}
                                </span>
                              </div>

                              <div className="text-sm text-gray-400 mb-2 truncate">{merchant.email || 'No email'}</div>

                              <div className="flex items-center justify-between mt-2">
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaPlus className="text-[10px]" />
                                  {merchant.products.length} Products
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Link
                                    href={`/admin/merchant/${merchant.id}`}
                                    className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                    title="View Details"
                                  >
                                    <FaEye className="text-xs" />
                                  </Link>
                                  <Link
                                    href={`/admin/merchant/${merchant.id}`}
                                    className="p-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                                    title="Edit"
                                  >
                                    <FaPen className="text-xs" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Add New Merchant Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden sticky top-8">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaPlus className="text-blue-500" />
                    Add New Merchant
                  </h2>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Basic Fields */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Merchant Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="e.g. Camera House"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="+94 77..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Merchant Logo</label>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaPlus className="w-6 h-6 text-gray-400 mb-1" />
                              <p className="text-xs text-gray-500">Click to upload</p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </label>
                        </div>
                        {formData.image && (
                          <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Street address..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        placeholder="Brief description..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow disabled:opacity-50 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Create Merchant
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}