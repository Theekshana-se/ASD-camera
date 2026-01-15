"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";
import apiClient from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldHalved,
  FaFloppyDisk,
  FaTrash
} from "react-icons/fa6";

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    const toastId = toast.loading("Deleting user...");
    const requestOptions = {
      method: "DELETE",
    };

    try {
      const response = await apiClient.delete(`/api/users/${id}`, requestOptions);
      if (response.status === 204) {
        toast.success("User deleted successfully", { id: toastId });
        router.push("/admin/users");
      } else {
        throw Error("There was an error while deleting user");
      }
    } catch (error) {
      toast.error("There was an error while deleting user", { id: toastId });
    }
  };

  const updateUser = async () => {
    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("You entered invalid email address format");
        return;
      }

      // Password valid only if entered
      if (userInput.newPassword.length > 0 && userInput.newPassword.length < 8) {
        toast.error("Password must be longer than 7 characters");
        return;
      }

      const toastId = toast.loading("Updating user...");

      try {
        const payload: any = {
          email: userInput.email,
          role: userInput.role,
        };
        // Only sending password if it changed
        if (userInput.newPassword.length > 0) {
          payload.password = userInput.newPassword;
        }

        const response = await apiClient.put(`/api/users/${id}`, payload);

        if (response.status === 200) {
          await response.json();
          toast.success("User successfully updated", { id: toastId });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Error while updating user", { id: toastId });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("There was an error while updating user", { id: toastId });
      }
    } else {
      toast.error("Please fill in email and role");
      return;
    }
  };

  useEffect(() => {
    setLoading(true);
    // sending API request for a single user
    apiClient
      .get(`/api/users/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserInput({
          email: data?.email,
          newPassword: "",
          role: data?.role,
        });
      })
      .catch((err) => {
        toast.error("Failed to load user");
        router.push("/admin/users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 overflow-auto flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/users" className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
                <FaArrowLeft />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  Edit User
                </h1>
                <p className="text-gray-400 mt-1">Manage user account details and permissions</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 text-xl">
                    <FaUser />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{userInput.email}</h2>
                    <span className="capitalize px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700">
                      {userInput.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={deleteUser}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <FaTrash /> Delete Account
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      value={userInput.email}
                      onChange={(e) =>
                        setUserInput({ ...userInput, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      New Password <span className="text-gray-600 text-xs font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <FaLock />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Leave blank to keep current"
                        value={userInput.newPassword}
                        onChange={(e) =>
                          setUserInput({ ...userInput, newPassword: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">User Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <FaShieldHalved />
                      </div>
                      <select
                        className="w-full pl-11 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none"
                        value={userInput.role}
                        onChange={(e) =>
                          setUserInput({ ...userInput, role: e.target.value })
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Administrator</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={updateUser}
                    className="flex-[2] py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <FaFloppyDisk /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSingleUserPage;
