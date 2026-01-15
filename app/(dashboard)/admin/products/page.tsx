"use client";
import React, { useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import DashboardProductTable from "@/components/DashboardProductTable";
import DashboardCreateProductForm from "@/components/DashboardCreateProductForm";
import { FaBox, FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";

const AdminProductsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false); // Mobile toggle if needed, or stick to grid

  const handleProductCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Products</h1>
                <p className="text-gray-400">Manage your product inventory</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* LEFT: TABLE (Takes 2 columns on XL) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-2 space-y-6"
            >
              {/* Note: DashboardProductTable has its own internal search/filter UI. 
                   We might want to hide its header or customize it, but for now we render it as is. 
                   We should remove the 'Add Product' button from DashboardProductTable if possible, or ignore it.
                   The user can just use the form on the right. 
               */}
              <DashboardProductTable key={refreshKey} />
            </motion.div>

            {/* RIGHT: CREATE FORM (Takes 1 column on XL) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-0"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <FaPlus className="text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Add New Product</h2>
              </div>

              <DashboardCreateProductForm onSuccess={handleProductCreated} />

            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProductsPage;
