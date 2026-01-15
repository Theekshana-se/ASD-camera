"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { formatCategoryName, convertCategoryNameToURLFriendly } from "@/utils/categoryFormating";
import apiClient from "@/lib/api";
import { FaLayerGroup, FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [categoryInput, setCategoryInput] = useState<{ name: string }>({
    name: "",
  });
  const router = useRouter();

  const deleteCategory = async () => {
    if (!confirm("Are you sure you want to delete this category? This will affect all associated products.")) return;

    console.log("Attempting to delete category from details page:", id);
    const toastId = toast.loading("Deleting category...");

    try {
      // Direct fetch to rule out client config
      const response = await fetch(`http://localhost:3002/api/categories/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);

      if (response.status === 204) {
        toast.success("Category deleted successfully", { id: toastId });
        router.push("/admin/categories");
      } else {
        const text = await response.text();
        console.error("Delete failed response:", text);
        let errorMsg = "Error deleting category";
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

  const updateCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.put(`/api/categories/${id}`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
        });

        if (response.status === 200) {
          await response.json();
          toast.success("Category successfully updated");
          router.push("/admin/categories");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Error updating a category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("There was an error while updating a category");
      }
    } else {
      toast.error("For updating a category you must enter all values");
      return;
    }
  };

  useEffect(() => {
    // sending API request for getting single categroy
    apiClient
      .get(`/api/categories/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategoryInput({
          name: data?.name,
        });
      });
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/categories" className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Category</h1>
              <p className="text-gray-400 text-sm">Update category details</p>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 lg:p-8">
            <div className="max-w-md">
              <label className="form-control w-full mb-6">
                <div className="label">
                  <span className="label-text text-gray-400">Category name</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered bg-gray-800 border-gray-700 text-white w-full focus:outline-none focus:border-amber-500"
                  value={formatCategoryName(categoryInput.name)}
                  onChange={(e) =>
                    setCategoryInput({ ...categoryInput, name: e.target.value })
                  }
                />
                <div className="label">
                  <span className="label-text-alt text-gray-500">Slug: {convertCategoryNameToURLFriendly(categoryInput.name)}</span>
                </div>
              </label>

              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  type="button"
                  className="btn flex-1 bg-blue-600 hover:bg-blue-700 text-white border-none"
                  onClick={updateCategory}
                >
                  Update Category
                </button>
                <button
                  type="button"
                  className="btn flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border-red-900/30 hover:border-red-600 transition-all"
                  onClick={deleteCategory}
                >
                  Delete Category
                </button>
              </div>

              <div className="mt-6 p-4 bg-red-900/10 border border-red-900/20 rounded-xl">
                <p className="text-sm text-red-400">
                  <span className="font-bold">Warning:</span> Deleting this category will remove all associated products. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleCategory;
