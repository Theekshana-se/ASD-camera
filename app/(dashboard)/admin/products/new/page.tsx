"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    deposit: number;
    isOfferItem: boolean;
    isFeatured: boolean;
    isHotDeal: boolean;
    discount?: number;
    rating?: number;
    manufacturer: string;
    brandId?: string;
    features?: string[];
    availabilityStatus: "AVAILABLE" | "UNDER_MAINTENANCE" | "UNAVAILABLE";
    inStock: number;
    mainImage: string;
    coverPhoto?: string;
    description: string;
    slug: string;
    categoryId: string;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    deposit: 0,
    isOfferItem: false,
    isFeatured: false,
    isHotDeal: false,
    discount: 0,
    rating: 5,
    manufacturer: "",
    brandId: "",
    features: [],
    availabilityStatus: "AVAILABLE",
    inStock: 1,
    mainImage: "",
    coverPhoto: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [brands, setBrands] = useState<{id: string; name: string}[]>([]);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ imageID: string; image: string }[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [mainIdx, setMainIdx] = useState<number | null>(null);
  const addProduct = async () => {
    if (
      !product.merchantId ||
      product.title === "" ||
      product.manufacturer === "" ||
      product.description == "" ||
      product.slug === ""
    ) {
      toast.error("Please enter values in input fields");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedProduct = sanitizeFormData(product);
      const payload: any = { ...sanitizedProduct };
      if (!payload.brandId) delete payload.brandId;
      if (!payload.coverPhoto) delete payload.coverPhoto;
      if (!Array.isArray(payload.features) || payload.features.length === 0) delete payload.features;

      console.log("Sending product data:", sanitizedProduct);

      // If no explicit main image set, use first pending file as main
      if (!payload.mainImage && pendingFiles[0]) {
        try {
          payload.mainImage = await fileToBase64(pendingFiles[0]);
          setMainIdx(0);
        } catch {}
      }

      const response = await apiClient.post(`/api/products`, payload);

      if (response.status === 201) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        toast.success("Product added successfully");
        setCreatedProductId(data?.id || null);
        setProduct({
          merchantId: "",
          title: "",
          price: 0,
          deposit: 0,
          isOfferItem: false,
          isFeatured: false,
          isHotDeal: false,
          manufacturer: "",
          brandId: brands[0]?.id || "",
          features: [],
          availabilityStatus: "AVAILABLE",
          inStock: 1,
          mainImage: "",
          coverPhoto: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
        });
        if (data?.id) {
          const imgsRes = await apiClient.get(`/api/images/${data.id}`, { cache: 'no-store' });
          const imgs = await imgsRes.json();
          setUploadedImages(Array.isArray(imgs) ? imgs : []);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        toast.error(`${errorData.error || errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data: any = await res.json();
      const list: Merchant[] = Array.isArray(data) ? data : (data?.merchants || []);
      setMerchants(list);
      setProduct((prev) => ({
        ...prev,
        merchantId: prev.merchantId || list?.[0]?.id || "",
      }));
      if (!Array.isArray(data) && !Array.isArray(data?.merchants)) {
        toast.error("Failed to load merchants");
      }
    } catch (e) {
      toast.error("Failed to load merchants");
      setMerchants([]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data: any = await res.json();
      const list: Category[] = Array.isArray(data) ? data : (data?.categories || []);
      setCategories(list);
      setProduct((prev) => ({
        ...prev,
        categoryId: list[0]?.id || prev.categoryId || "",
      }));
      if (!Array.isArray(data) && !Array.isArray(data?.categories)) {
        toast.error("Failed to load categories");
      }
    } catch (e) {
      toast.error("Failed to load categories");
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await apiClient.get(`/api/brands`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setBrands(list);
      setProduct((prev) => ({ ...prev, brandId: list[0]?.id || prev.brandId || "" }));
      if (!Array.isArray(data)) {
        toast.error("Failed to load brands");
      }
    } catch (e) {
      toast.error("Failed to load brands");
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
    fetchBrands();
  }, []);

  const uploadAdditionalImages = async (files: FileList | null) => {
    if (!files || files.length === 0 || !createdProductId) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('file', f));
    const res = await fetch(`${apiClient.baseUrl}/api/product-images/upload?productId=${createdProductId}`, { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      toast.success('Images uploaded');
      const imgsRes = await apiClient.get(`/api/images/${createdProductId}`, { cache: 'no-store' });
      const imgs = await imgsRes.json();
      setUploadedImages(Array.isArray(imgs) ? imgs : []);
    } else {
      toast.error(String(data?.error || 'Upload failed'));
    }
  };

  const uploadAdditionalImagesFromArray = async (files: File[]) => {
    if (!files || files.length === 0 || !createdProductId) return;
    const formData = new FormData();
    files.forEach((f) => formData.append('file', f));
    const res = await fetch(`${apiClient.baseUrl}/api/product-images/upload?productId=${createdProductId}`, { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      const imgsRes = await apiClient.get(`/api/images/${createdProductId}`, { cache: 'no-store' });
      const imgs = await imgsRes.json();
      setUploadedImages(Array.isArray(imgs) ? imgs : []);
      setPendingFiles([]);
    } else {
      toast.error(String(data?.error || 'Upload failed'));
    }
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new product</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Merchant Info:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.merchantId}
              onChange={(e) =>
                setProduct({ ...product, merchantId: e.target.value })
              }
            >
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
            {merchants.length === 0 && (
              <span className="text-xs text-red-500 mt-1">
                Please create a merchant first.
              </span>
            )}
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product slug:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) =>
                setProduct({
                  ...product,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
            >
              {categories &&
                categories.map((category: any) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Brand:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.brandId}
              onChange={(e) =>
                setProduct({ ...product, brandId: e.target.value })
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

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Rent price / day:</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Discount (%):</span>
            </div>
            <input
              type="number"
              min={0}
              max={90}
              step={1}
              className="input input-bordered w-full max-w-xs"
              value={product?.discount ?? 0}
              onChange={(e) =>
                setProduct({ ...product, discount: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Rating (0-5):</span>
            </div>
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              className="input input-bordered w-full max-w-xs"
              value={product?.rating ?? 5}
              onChange={(e) =>
                setProduct({ ...product, rating: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Security deposit:</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.deposit}
              onChange={(e) =>
                setProduct({ ...product, deposit: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div>
          <label className="label cursor-pointer">
            <span className="label-text mr-3">Mark as offer item</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={product?.isOfferItem}
              onChange={(e) =>
                setProduct({ ...product, isOfferItem: e.target.checked })
              }
            />
          </label>
        </div>
        <div>
          <label className="label cursor-pointer">
            <span className="label-text mr-3">Mark as featured product</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={product?.isFeatured}
              onChange={(e) =>
                setProduct({ ...product, isFeatured: e.target.checked })
              }
            />
          </label>
        </div>
        <div>
          <label className="label cursor-pointer">
            <span className="label-text mr-3">Mark as hot deal</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={product?.isHotDeal}
              onChange={(e) =>
                setProduct({ ...product, isHotDeal: e.target.checked })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Is product in stock?</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.inStock}
              onChange={(e) =>
                setProduct({ ...product, inStock: Number(e.target.value) })
              }
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Availability status:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.availabilityStatus}
              onChange={(e) =>
                setProduct({ ...product, availabilityStatus: e.target.value as any })
              }
            >
              <option value="AVAILABLE">Available</option>
              <option value="UNDER_MAINTENANCE">Under maintenance</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </label>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={async (e: any) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const base64 = await fileToBase64(file);
              setProduct({ ...product, mainImage: base64 });
            }}
          />
          {product?.mainImage && (
            <Image
              src={product?.mainImage}
              alt={product?.title}
              className="w-auto h-auto"
              width={100}
              height={100}
            />
          )}
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Cover photo (optional):</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-lg w-full max-w-sm"
              onChange={async (e: any) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const base64 = await fileToBase64(file);
                setProduct({ ...product, coverPhoto: base64 });
              }}
            />
            {product?.coverPhoto && (
              <Image
                src={product?.coverPhoto}
                alt="Cover photo"
                className="w-auto h-auto"
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Product description:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Features (comma separated):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-sm"
              value={(product?.features || []).join(", ")}
              onChange={(e) =>
                setProduct({ ...product, features: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })
              }
            />
          </label>
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={addProduct}
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Add product
          </button>
        </div>

        {/* Drag & Drop Images (pre-create collection) */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Add product images (drag & drop)</h2>
          <div
            className="mt-3 border-dashed border-2 border-gray-300 rounded-lg p-6 text-center bg-gray-50"
            onDragOver={(e)=>{e.preventDefault();}}
            onDrop={async (e)=>{
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files || []).filter((f)=>f.type.startsWith('image/'));
              if (files.length) {
                setPendingFiles((prev)=>[...prev, ...files]);
                if (mainIdx === null) setMainIdx(0);
              }
            }}
          >
            <p className="mb-3">Drag and drop images here or select files</p>
            <input type="file" multiple accept="image/*" className="file-input file-input-bordered" onChange={(e)=>{
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length) {
                setPendingFiles((prev)=>[...prev, ...files]);
                if (mainIdx === null) setMainIdx(0);
              }
            }} />
          </div>
          {pendingFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {pendingFiles.map((f, i)=> (
                <div key={`${f.name}-${i}`} className={`border rounded p-2 ${i===mainIdx?'ring-2 ring-red-600':''}`}>
                  <Image src={URL.createObjectURL(f)} alt="pending" width={100} height={100} className="w-auto h-auto" />
                  <div className="mt-2 flex gap-2">
                    <button className="btn btn-sm" onClick={()=>setMainIdx(i)}>Set main</button>
                    <button className="btn btn-sm btn-outline btn-error" onClick={()=>{
                      setPendingFiles((prev)=> prev.filter((_,idx)=> idx!==i));
                      if (mainIdx === i) setMainIdx(null);
                    }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {createdProductId && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Upload product images</h2>
            <input type="file" multiple accept="image/*" className="file-input file-input-bordered w-full max-w-md mt-3" onChange={(e)=>uploadAdditionalImages(e.target.files)} />
            {pendingFiles.length > 0 && (
              <div className="mt-3">
                <button className="btn btn-primary" onClick={()=>uploadAdditionalImagesFromArray(pendingFiles)}>Upload pending images</button>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              {uploadedImages.map((img) => (
                <div key={img.imageID} className="border rounded p-2">
                  <Image src={`/${img.image}`} alt="product" width={100} height={100} className="w-auto h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProduct;
