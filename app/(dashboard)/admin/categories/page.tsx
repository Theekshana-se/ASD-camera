"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLayerGroup,
  FaPlus,
  FaMagnifyingGlass,
  FaPen,
  FaTrash,
  FaArrowRight
} from "react-icons/fa6";
import toast from "react-hot-toast";
// Adjust import path as needed - using existing relative path pattern or alias if available
// Previous files used: "../../../../utils/categoryFormating" or "@/utils/categoryFormating"
// Safe bet is to try @/utils if configured, but let's stick to the relative one found in existing if we can't be sure, 
// OR define the helper inline if it's small, but better to import.
// Using @/utils based on other files usually having clean imports, if not I'll fix.
import { formatCategoryName, convertCategoryNameToURLFriendly } from "@/utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    console.log("Attempting to delete category:", id);
    const toastId = toast.loading("Deleting category...");

    try {
      // Direct fetch to backend to rule out config issues
      const res = await fetch(`http://localhost:3002/api/categories/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", res.status);

      if (res.status === 204) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        toast.success("Category deleted", { id: toastId });
      } else {
        const text = await res.text();
        console.error("Delete failed response:", text);
        let errorMsg = "Failed to delete category";
        try {
          const json = JSON.parse(text);
          errorMsg = json.error || json.message || errorMsg;
        } catch { }
        toast.error(errorMsg, { id: toastId });
      }
    } catch (error) {
      console.error("Delete network error:", error);
      toast.error("Network error deleting category", { id: toastId });
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post(`/api/categories`, {
        name: convertCategoryNameToURLFriendly(newCategoryName),
      });

      if (response.status === 201) {
        toast.success("Category created successfully");
        setNewCategoryName("");
        fetchCategories(); // Refresh list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
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
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FaLayerGroup className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-gray-400">Manage product categories</p>
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
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              {/* Categories Grid/List */}
              <div className="grid gap-3">
                <AnimatePresence>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800" />
                    ))
                  ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800 border-dashed">
                      <FaLayerGroup className="mx-auto text-3xl text-gray-600 mb-3" />
                      <p className="text-gray-400">No categories found</p>
                    </div>
                  ) : (
                    filteredCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-amber-500/30 rounded-xl p-4 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                              <span className="font-bold text-lg">
                                {formatCategoryName(category.name).charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {formatCategoryName(category.name)}
                              </h3>
                              <code className="text-xs text-gray-500 mt-1 block">
                                {category.name}
                              </code>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/admin/categories/${category.id}`}>
                              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                <FaPen className="text-sm" />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteCategory(category.id)}
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
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <FaPlus className="text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Add New Category</h2>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-gray-400">Category Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., DSLRs"
                    className="input input-bordered bg-gray-800 border-gray-700 text-white focus:outline-none focus:border-amber-500"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">
                      Slug will be generated automatically: <span className="text-amber-500/70">{newCategoryName ? convertCategoryNameToURLFriendly(newCategoryName) : "..."}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-none"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    <>
                      Create Category <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Tips/Info */}
              <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-800/50">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Did you know?</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Categories are used to organize products and help customers filter their search.
                  Try to keep category names simple and distinct.
                </p>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCategory;
