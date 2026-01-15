"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaLayerGroup, FaPlus, FaMagnifyingGlass, FaPen, FaTrash } from "react-icons/fa6";
import toast from "react-hot-toast";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient.get("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteCategory = async (id: string) => {
    try {
      const res = await apiClient.delete(`/api/categories/${id}`);
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        toast.success("Category deleted");
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Error deleting category");
    }
  };

  const filteredCategories = categories.filter((c) =>
    formatCategoryName(c.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <FaLayerGroup className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-gray-400 text-sm">{categories.length} total categories</p>
            </div>
          </div>
          
          <Link href="/admin/categories/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
            >
              <FaPlus className="text-sm" />
              Add Category
            </motion.button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="w-32 h-4 bg-gray-800 rounded" /></td>
                      <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-800 rounded" /></td>
                      <td className="px-6 py-4"><div className="w-20 h-8 bg-gray-800 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <FaLayerGroup className="text-gray-600 text-2xl" />
                        </div>
                        <p className="text-gray-400 font-medium">No categories found</p>
                        <p className="text-gray-500 text-sm mt-1">Create your first category to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredCategories.map((category, index) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                              <FaLayerGroup className="text-amber-400" />
                            </div>
                            <span className="text-white font-medium">{formatCategoryName(category?.name)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 font-mono text-sm">{category?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/categories/${category?.id}`}>
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
                              onClick={() => deleteCategory(category.id)}
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
          
          {filteredCategories.length > 0 && (
            <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-medium">{filteredCategories.length}</span> of <span className="text-white font-medium">{categories.length}</span> categories
              </p>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default DashboardCategory;
