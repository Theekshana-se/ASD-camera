"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from "@/components";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";

const DashboardProductDetails = () => {
  const { id } = useParams() as { id: string };

  type ProductExtended = Product & { brandId?: string; features?: string[]; availabilityStatus?: 'AVAILABLE' | 'UNDER_MAINTENANCE' | 'UNAVAILABLE' };
  const [product, setProduct] = useState<ProductExtended>();
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>();
  type ImageItem = { imageID: string; productID: string; image: string };
  const [otherImages, setOtherImages] = useState<ImageItem[]>([]);
  const router = useRouter();

  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error(
              "Cannot delete the product because of foreign key constraint"
            );
          } else {
            throw Error("There was an error while deleting product");
          }
        } else {
          toast.success("Product deleted successfully");
          router.push("/admin/products");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting product");
      });
  };

  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.price.toString() === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, product);

      if (response.status === 200) {
        await response.json();
        toast.success("Product successfully updated");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "There was an error while updating product"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("There was an error while updating product");
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.post("/api/main-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        toast.error("File upload unsuccessful.");
      }
    } catch (error) {
      console.error("There was an error while during request sending:", error);
      toast.error("There was an error during request sending");
    }
  };

  const fetchProductData = async () => {
    apiClient
      .get(`/api/products/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      });

    const imagesData = await apiClient.get(`/api/images/${id}`, {
      cache: "no-store",
    });
    const images = await imagesData.json();
    setOtherImages((currentImages) => images);
  };

  const fetchCategories = async () => {
    apiClient
      .get(`/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  const fetchBrands = async () => {
    apiClient
      .get(`/api/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(data));
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProductData();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Product Details</h1>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 lg:p-8 space-y-6 max-w-4xl">
          {/* Product name */}
          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-gray-400">Product name:</span>
              </div>
              <input
                type="text"
                className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                value={product?.title || ""}
                onChange={(e) =>
                  setProduct({ ...product!, title: e.target.value })
                }
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Product price:</span>
                </div>
                <input
                  type="number"
                  className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.price || ""}
                  onChange={(e) =>
                    setProduct({ ...product!, price: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Rating (0-5):</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={1}
                  className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.rating ?? 0}
                  onChange={(e) =>
                    setProduct({ ...product!, rating: Number(e.target.value) })
                  }
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Discount (%):</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={90}
                  step={1}
                  className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.discount ?? 0}
                  onChange={(e) =>
                    setProduct({ ...product!, discount: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4">
              <label className="label cursor-pointer flex-col items-start gap-2 border border-gray-800 rounded-lg p-3 bg-gray-800/30">
                <span className="label-text text-gray-400 text-xs uppercase font-bold">Offer Item</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-error"
                  checked={product?.isOfferItem ?? false}
                  onChange={(e) =>
                    setProduct({ ...product!, isOfferItem: e.target.checked })
                  }
                />
              </label>
              <label className="label cursor-pointer flex-col items-start gap-2 border border-gray-800 rounded-lg p-3 bg-gray-800/30">
                <span className="label-text text-gray-400 text-xs uppercase font-bold">Featured</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-error"
                  checked={product?.isFeatured ?? false}
                  onChange={(e) =>
                    setProduct({ ...product!, isFeatured: e.target.checked })
                  }
                />
              </label>
              <label className="label cursor-pointer flex-col items-start gap-2 border border-gray-800 rounded-lg p-3 bg-gray-800/30">
                <span className="label-text text-gray-400 text-xs uppercase font-bold">Hot Deal</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-error"
                  checked={product?.isHotDeal ?? false}
                  onChange={(e) =>
                    setProduct({ ...product!, isHotDeal: e.target.checked })
                  }
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Manufacturer:</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.manufacturer || ""}
                  onChange={(e) =>
                    setProduct({ ...product!, manufacturer: e.target.value })
                  }
                />
              </label>
            </div>
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Slug:</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={
                    product?.slug ? convertSlugToURLFriendly(product?.slug) : ""
                  }
                  onChange={(e) =>
                    setProduct({
                      ...product!,
                      slug: convertSlugToURLFriendly(e.target.value),
                    })
                  }
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">In Stock:</span>
                </div>
                <select
                  className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.inStock ?? 1}
                  onChange={(e) => {
                    setProduct({ ...product!, inStock: Number(e.target.value) });
                  }}
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </label>
            </div>
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Availability:</span>
                </div>
                <select
                  className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.availabilityStatus || "AVAILABLE"}
                  onChange={(e) => {
                    setProduct((prev) =>
                      prev ? { ...prev, availabilityStatus: e.target.value as 'AVAILABLE' | 'UNDER_MAINTENANCE' | 'UNAVAILABLE' } : prev
                    );
                  }}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Category:</span>
                </div>
                <select
                  className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.categoryId || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product!,
                      categoryId: e.target.value,
                    })
                  }
                >
                  {categories &&
                    categories.map((category: Category) => (
                      <option key={category?.id} value={category?.id}>
                        {formatCategoryName(category?.name)}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-gray-400">Brand:</span>
                </div>
                <select
                  className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                  value={product?.brandId || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product!,
                      brandId: e.target.value,
                    })
                  }
                >
                  {brands &&
                    brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="label"><span className="label-text text-gray-400">Main Image</span></label>
            <input
              type="file"
              className="file-input file-input-bordered bg-gray-800 border-gray-700 w-full max-w-sm"
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const selectedFile = input.files?.[0];

                if (selectedFile) {
                  uploadFile(selectedFile);
                  setProduct({ ...product!, mainImage: selectedFile.name });
                }
              }}
            />
            {product?.mainImage && (
              <div className="mt-4 border border-gray-700 rounded-lg p-2 w-fit bg-gray-800">
                <Image
                  src={
                    product.mainImage.startsWith("data:") || product.mainImage.startsWith("http")
                      ? product.mainImage
                      : `/${product.mainImage}`
                  }
                  alt={product?.title}
                  className="w-32 h-32 object-contain"
                  width={128}
                  height={128}
                />
              </div>
            )}
          </div>

          <div>
            <label className="label"><span className="label-text text-gray-400">Additional Images</span></label>
            <input
              type="file"
              multiple
              className="file-input file-input-bordered bg-gray-800 border-gray-700 w-full max-w-sm"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                const formData = new FormData();
                Array.from(files).forEach((f) => formData.append('file', f));
                const res = await fetch(`${apiClient.baseUrl}/api/product-images/upload?productId=${id}`, { method: 'POST', body: formData });
                const data = await res.json();
                if (res.ok) {
                  toast.success('Images uploaded');
                  fetchProductData();
                } else {
                  toast.error(String(data?.error || 'Upload failed'));
                }
              }}
            />
            <div className="mt-4 flex flex-wrap gap-4">
              {otherImages && otherImages.map((image) => (
                <div key={image.imageID} className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex flex-col items-center gap-2">
                  <Image src={`/${image.image}`} alt="product image" width={100} height={100} className="w-24 h-24 object-cover rounded" />
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-ghost text-gray-400 hover:text-white" onClick={async () => {
                      const res = await fetch(`${apiClient.baseUrl}/api/product-images/main/${image.imageID}`, { method: 'PUT' });
                      if (res.ok) { toast.success('Set as main'); fetchProductData(); } else { toast.error('Failed'); }
                    }}>Main</button>
                    <button className="btn btn-xs btn-ghost text-red-400 hover:text-red-300" onClick={async () => {
                      const res = await fetch(`${apiClient.baseUrl}/api/product-images/image/${image.imageID}`, { method: 'DELETE' });
                      if (res.status === 204) { toast.success('Deleted'); fetchProductData(); } else { toast.error('Delete failed'); }
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-gray-400">Product description:</span>
              </div>
              <textarea
                className="textarea textarea-bordered bg-gray-800 border-gray-700 text-white h-32"
                value={product?.description || ""}
                onChange={(e) =>
                  setProduct({ ...product!, description: e.target.value })
                }
              ></textarea>
            </label>
          </div>

          <div>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-gray-400">Features (comma separated):</span>
              </div>
              <input
                type="text"
                className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                value={(product?.features || []).join(", ")}
                onChange={(e) =>
                  setProduct({
                    ...product!,
                    features: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-800 flex gap-4 max-sm:flex-col">
            <button
              type="button"
              onClick={updateProduct}
              className="flex-1 uppercase bg-blue-600 hover:bg-blue-700 px-6 py-4 text-sm font-bold text-white rounded-xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Update Product
            </button>
            <button
              type="button"
              className="flex-1 uppercase bg-red-600 hover:bg-red-700 px-6 py-4 text-sm font-bold text-white rounded-xl transition-colors shadow-lg shadow-red-900/20"
              onClick={deleteProduct}
            >
              Delete Product
            </button>
          </div>
          <p className="text-sm text-red-400/70 text-center">
            Note: Deleting a product requires deleting all associated order records first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductDetails;