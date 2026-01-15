"use client";
import React, { useEffect, useState, use } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck, FaTrash, FaBoxOpen, FaStore, FaEye } from "react-icons/fa6";

interface Product {
  id: string;
  title: string;
  price: number;
  inStock: number;
}

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  image: string | null;
  status: string;
  products: Product[];
}

interface MerchantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantDetailPage({
  params,
}: MerchantDetailPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    image: "",
    status: "ACTIVE",
  });

  const router = useRouter();

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/merchants/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/admin/merchant");
          return;
        }
        throw new Error("Failed to fetch merchant");
      }

      const data = await response.json();
      setMerchant(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        image: data.image || "",
        status: data.status || "ACTIVE",
      });
    } catch (error) {
      console.error("Error fetching merchant:", error);
      toast.error("Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [id]);

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
    setSaving(true);
    try {
      const response = await apiClient.put(`/api/merchants/${id}`, formData);

      if (!response.ok) {
        throw new Error("Failed to update merchant");
      }

      toast.success("Merchant updated successfully");
      fetchMerchant();
    } catch (error) {
      console.error("Error updating merchant:", error);
      toast.error("Failed to update merchant");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this merchant? This cannot be undone.")) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/merchants/${id}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete merchant");
      }

      toast.success("Merchant deleted successfully");
      router.push("/admin/merchant");
    } catch (error) {
      console.error("Error deleting merchant:", error);
      toast.error("Failed to delete merchant");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="flex min-h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 p-10 flex text-white font-bold items-center justify-center">
          Merchant not found
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/merchant"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors text-white"
                >
                  <FaArrowLeft />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                  <p className="text-gray-400 text-sm">Manage merchant details and products</p>
                </div>
              </div>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 font-medium rounded-xl hover:bg-red-500/20 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete Merchant
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Edit Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="xl:col-span-2 space-y-6"
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaStore className="text-blue-500" />
                    Merchant Information
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Merchant Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="h-20 w-auto rounded-lg object-contain bg-white/10 p-1" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Status</label>
                      <div className="relative">
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-400">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-400">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end border-t border-gray-800">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow disabled:opacity-50"
                    >
                      {saving ? "Saving..." : <><FaCheck /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Products List */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <FaBoxOpen className="text-purple-500" />
                  Merchant Products
                </h3>

                {merchant.products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800 bg-gray-800/50">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Title</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Price</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Stock</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {merchant.products.map((product) => (
                          <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                            <td className="py-3 px-4 text-sm text-white">{product.title}</td>
                            <td className="py-3 px-4 text-sm text-gray-300">${(product.price / 100).toFixed(2)}</td>
                            <td className="py-3 px-4 text-sm text-gray-300">{product.inStock}</td>
                            <td className="py-3 px-4">
                              <Link
                                href={`/admin/products/${product.id}`}
                                className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-colors inline-flex"
                                title="View Product"
                              >
                                <FaEye />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No products associated with this merchant.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar Info (optional) or just spacing */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-2">Merchant Summary</h4>
                <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Total Products</span>
                    <span className="text-white font-medium">{merchant.products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={merchant.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}>{merchant.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}