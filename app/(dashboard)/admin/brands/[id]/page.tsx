"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState, use } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props { params: Promise<{ id: string }> }

export default function EditBrandPage({ params }: Props) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const load = async () => {
    const res = await apiClient.get(`/api/brands`);
    const data = await res.json();
    const b = Array.isArray(data) ? data.find((x: any) => x.id === id) : null;
    if (b) {
      setName(b.name);
      setImageUrl(b.imageUrl || "");
    }
  };

  useEffect(() => { load(); }, [id]);

  const save = async () => {
    if (!name.trim()) { toast.error("Enter brand name"); return; }
    const payload: any = { name: name.trim() };
    payload.imageUrl = imageUrl.trim() || null;
    const res = await apiClient.put(`/api/brands/${id}`, payload);
    if (res.ok) {
      toast.success("Brand updated");
    } else {
      toast.error("Failed to update brand");
    }
  };

  return (
    <div className="bg-white flex max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Brand</h1>
          <Link href="/admin/brands" className="bg-gray-500 text-white px-6 py-2 rounded-md">Back</Link>
        </div>
        <label className="block mb-4">
          <span className="block mb-2">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-sm" />
        </label>
        <label className="block mb-4">
          <span className="block mb-2">Logo URL (HTTPS)</span>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input input-bordered w-full max-w-sm" placeholder="https://..." />
        </label>
        <button onClick={save} className="bg-blue-500 text-white px-6 py-2 rounded-md">Save</button>
      </div>
    </div>
  );
}