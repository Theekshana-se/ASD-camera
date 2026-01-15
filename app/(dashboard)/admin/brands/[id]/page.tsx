"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState, use } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaArrowLeft, FaTags, FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface Props { params: Promise<{ id: string }> }

export default function EditBrandPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Assuming get all strategy since unsure if getById exists
      const res = await apiClient.get(`/api/brands`);
      const data = await res.json();
      const b = Array.isArray(data) ? data.find((x: any) => x.id === id) : null;
      if (b) {
        setName(b.name);
        setImageUrl(b.imageUrl || "");
      } else {
        toast.error("Brand not found");
        router.push("/admin/brands");
      }
    } catch {
      toast.error("Error loading brand");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const save = async () => {
    if (!name.trim()) { toast.error("Enter brand name"); return; }
    const payload: any = { name: name.trim() };
    payload.imageUrl = imageUrl.trim() || null;
    try {
      const res = await apiClient.put(`/api/brands/${id}`, payload);
      if (res.ok) {
        toast.success("Brand updated");
        router.push("/admin/brands");
      } else {
        toast.error("Failed to update brand");
      }
    } catch {
      toast.error("Error updating brand");
    }
  };

  const deleteBrand = async () => {
    if (!confirm("Delete this brand?")) return;
    try {
      const res = await apiClient.delete(`/api/brands/${id}`);
      if (res.status === 204) {
        toast.success("Brand deleted");
        router.push("/admin/brands");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete brand");
      }
    } catch {
      toast.error("Error deleting brand");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/brands" className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Brand</h1>
              <p className="text-gray-400 text-sm">Update brand details</p>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 lg:p-8">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
              <div className="max-w-md">
                <div className="form-control w-full mb-4">
                  <label className="label"><span className="label-text text-gray-400">Brand Name</span></label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered bg-gray-800 border-gray-700 text-white w-full focus:outline-none focus:border-cyan-500" />
                </div>

                <div className="form-control w-full mb-6">
                  <label className="label"><span className="label-text text-gray-400">Logo URL (HTTPS)</span></label>
                  <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input input-bordered bg-gray-800 border-gray-700 text-white w-full focus:outline-none focus:border-cyan-500" placeholder="https://..." />
                  {imageUrl && (
                    <div className="mt-2 text-xs text-gray-500">
                      Preview: <div className="inline-block align-middle w-8 h-8 ml-2 bg-white rounded overflow-hidden border border-gray-600"><img src={imageUrl} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} /></div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button onClick={save} className="btn flex-1 bg-cyan-600 hover:bg-cyan-700 text-white border-none">Save Changes</button>
                  <button onClick={deleteBrand} className="btn bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border-red-900/30 hover:border-red-600">
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}