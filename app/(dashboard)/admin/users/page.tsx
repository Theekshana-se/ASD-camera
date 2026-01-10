"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import apiClient from "@/lib/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserShield, FaPlus, FaMagnifyingGlass, FaPen, FaTrash, FaUser, FaCrown } from "react-icons/fa6";
import toast from "react-hot-toast";

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient.get("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id: string) => {
    try {
      const res = await apiClient.delete(`/api/users/${id}`);
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted");
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Error deleting user");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <FaUserShield className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Users</h1>
              <p className="text-gray-400 text-sm">{adminCount} admins, {userCount} users</p>
            </div>
          </div>
          
          <Link href="/admin/users/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            >
              <FaPlus className="text-sm" />
              Add User
            </motion.button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full" />
                          <div className="w-40 h-4 bg-gray-800 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-800 rounded-full" /></td>
                      <td className="px-6 py-4"><div className="w-20 h-8 bg-gray-800 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <FaUserShield className="text-gray-600 text-2xl" />
                        </div>
                        <p className="text-gray-400 font-medium">No users found</p>
                        <p className="text-gray-500 text-sm mt-1">Create your first admin user</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              user.role === "admin" 
                                ? "bg-gradient-to-br from-violet-500 to-purple-600" 
                                : "bg-gradient-to-br from-gray-600 to-gray-700"
                            }`}>
                              {user.role === "admin" ? (
                                <FaCrown className="text-white text-sm" />
                              ) : (
                                <FaUser className="text-white text-sm" />
                              )}
                            </div>
                            <span className="text-white font-medium">{user?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-violet-500/10 text-violet-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}>
                            {user.role === "admin" ? <FaCrown className="text-[10px]" /> : <FaUser className="text-[10px]" />}
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/users/${user?.id}`}>
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
                              onClick={() => deleteUser(user.id)}
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
          
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-medium">{filteredUsers.length}</span> of <span className="text-white font-medium">{users.length}</span> users
              </p>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default DashboardUsers;
