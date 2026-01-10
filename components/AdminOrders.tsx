"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Updated with modern design
// Version: 2.0
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Modern table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaBagShopping, FaMagnifyingGlass, FaEye, FaTruck, FaBox, FaCheck, FaXmark, FaClock } from "react-icons/fa6";

const statusConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<{className?: string}> }> = {
  PENDING: { color: "text-amber-400", bg: "bg-amber-500/10", icon: FaClock },
  PROCESSING: { color: "text-blue-400", bg: "bg-blue-500/10", icon: FaBox },
  SHIPPED: { color: "text-purple-400", bg: "bg-purple-500/10", icon: FaTruck },
  DELIVERED: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: FaCheck },
  CANCELLED: { color: "text-red-400", bg: "bg-red-500/10", icon: FaXmark },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/orders");
        const data = await response.json();
        setOrders(data?.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <FaBagShopping className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-gray-400 text-sm">{orders.length} total orders</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-16 h-4 bg-gray-800 rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="w-28 h-4 bg-gray-800 rounded" />
                        <div className="w-20 h-3 bg-gray-800 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-800 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-6 bg-gray-800 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-4 bg-gray-800 rounded" /></td>
                    <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-800 rounded" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-8 bg-gray-800 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FaBagShopping className="text-gray-600 text-2xl" />
                      </div>
                      <p className="text-gray-400 font-medium">No orders found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredOrders.map((order, index) => {
                    const status = statusConfig[order?.status] || statusConfig.PENDING;
                    const StatusIcon = status.icon;
                    
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-white font-mono font-semibold">#{order?.id}</span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{order?.name}</p>
                            <p className="text-gray-500 text-sm">{order?.country}</p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${status.bg} ${status.color} text-xs font-medium rounded-full`}>
                            <StatusIcon className="text-[10px]" />
                            {order?.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                            {order?.fulfillmentMethod || "Delivery"}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">Rs.{Number(order?.total || 0).toLocaleString()}</span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(Date.parse(order?.dateTime)).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <Link href={`/admin/orders/${order?.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors text-sm font-medium"
                              >
                                <FaEye className="text-xs" />
                                Details
                              </motion.button>
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{filteredOrders.length}</span> of <span className="text-white font-medium">{orders.length}</span> orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
