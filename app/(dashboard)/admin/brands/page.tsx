"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import Link from "next/link";

type Brand = { id: string; name: string };

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await apiClient.get("/api/brands");
    const data = await res.json();
    setBrands(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/brands/${id}`);
    if (res.status === 204) {
      toast.success("Brand deleted");
      setBrands((b) => b.filter((x) => x.id !== id));
    } else {
      toast.error("Failed to delete brand");
    }
  };

  return (
    <div className="bg-white flex max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Brands</h1>
          <Link href="/admin/brands/new" className="bg-blue-500 text-white px-6 py-2 rounded-md">Add Brand</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">{b.name}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Link href={`/admin/brands/${b.id}`} className="px-4 py-1 bg-gray-200 rounded">Edit</Link>
                    <button onClick={() => remove(b.id)} className="px-4 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}