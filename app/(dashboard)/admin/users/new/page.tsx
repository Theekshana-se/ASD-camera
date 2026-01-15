"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from "@/lib/form-sanitize";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserPlus, FaEnvelope, FaLock, FaUserShield, FaArrowRight, FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const addNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.email === "" || userInput.password === "") {
      toast.error("You must enter all input values to add a user");
      return;
    }

    // Sanitize form data before sending to API
    const sanitizedUserInput = sanitizeFormData(userInput);

    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.password.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("You entered invalid email address format");
        return;
      }

      if (userInput.password.length > 7) {
        setIsSubmitting(true);
        const requestOptions: any = {
          headers: { "Content-Type": "application/json" },
        };
        apiClient.post(`/api/users`, sanitizedUserInput, requestOptions)
          .then((response: Response) => {
            if (response.status === 201) {
              return response.json();
            } else {
              throw Error("Error while creating user");
            }
          })
          .then((data: any) => {
            toast.success("User added successfully");
            setUserInput({
              email: "",
              password: "",
              role: "user",
            });
            router.push("/admin/users");
          }).catch((error: unknown) => {
            toast.error("Error while creating user");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        toast.error("Password must be longer than 7 characters");
      }
    } else {
      toast.error("You must enter all input values to add a user");
    }
  };

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
                  Add New User
                </h1>
                <p className="text-gray-400 mt-1">Create a new account with specific permissions</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-800">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 text-xl">
                  <FaUserPlus />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Details</h2>
                  <p className="text-sm text-gray-500">Enter the credentials for the new user</p>
                </div>
              </div>

              <form onSubmit={addNewUser} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="name@example.com"
                      value={userInput.email}
                      onChange={(e) =>
                        setUserInput({ ...userInput, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <FaLock />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Min 8 characters"
                        value={userInput.password}
                        onChange={(e) =>
                          setUserInput({ ...userInput, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">User Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <FaUserShield />
                      </div>
                      <select
                        className="w-full pl-11 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
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

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create User Account <FaArrowRight />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
