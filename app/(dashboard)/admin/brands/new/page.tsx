"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewBrandPage() {
  const [name, setName] = useState("");
  const submit = async () => {
    if (!name.trim()) { toast.error("Enter brand name"); return; }
    const res = await apiClient.post("/api/brands", { name: name.trim() });
    if (res.status === 201) {
      toast.success("Brand created");
      setName("");
    } else {
      toast.error("Failed to create brand");
    }
  };

  return (
    <div className="bg-white flex max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add Brand</h1>
          <Link href="/admin/brands" className="bg-gray-500 text-white px-6 py-2 rounded-md">Back</Link>
        </div>
        <label className="block mb-4">
          <span className="block mb-2">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-sm" />
        </label>
        <button onClick={submit} className="bg-blue-500 text-white px-6 py-2 rounded-md">Create</button>
      </div>
    </div>
  );
}