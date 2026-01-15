"use client";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaCloudArrowUp, FaTrash } from "react-icons/fa6";

interface DashboardCreateProductFormProps {
    onSuccess?: () => void;
}

const DashboardCreateProductForm: React.FC<DashboardCreateProductFormProps> = ({ onSuccess }) => {
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
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
    const [createdProductId, setCreatedProductId] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ imageID: string; image: string }[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [mainIdx, setMainIdx] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

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
        } catch (e) {
            console.error(e);
            setMerchants([]);
        }
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
        } catch (e) {
            console.error(e);
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
        } catch (e) {
            console.error(e);
            setBrands([]);
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

    useEffect(() => {
        fetchCategories();
        fetchMerchants();
        fetchBrands();
    }, []);

    const addProduct = async () => {
        if (
            !product.merchantId ||
            product.title === "" ||
            product.manufacturer === "" ||
            product.description == "" ||
            product.slug === ""
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            // Sanitize form data before sending to API
            const sanitizedProduct = sanitizeFormData(product);
            const payload: any = { ...sanitizedProduct };
            if (!payload.brandId) delete payload.brandId;
            if (!payload.coverPhoto) delete payload.coverPhoto;
            if (!Array.isArray(payload.features) || payload.features.length === 0) delete payload.features;

            // If no explicit main image set, use first pending file as main
            if (!payload.mainImage && pendingFiles[0]) {
                try {
                    payload.mainImage = await fileToBase64(pendingFiles[0]);
                    setMainIdx(0);
                } catch { }
            }

            const response = await apiClient.post(`/api/products`, payload);

            if (response.status === 201) {
                const data = await response.json();
                toast.success("Product added successfully");
                setCreatedProductId(data?.id || null);

                // Reset form
                setProduct({
                    merchantId: merchants[0]?.id || "",
                    title: "",
                    price: 0,
                    deposit: 0,
                    isOfferItem: false,
                    isFeatured: false,
                    isHotDeal: false,
                    discount: 0,
                    rating: 5,
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
                setPendingFiles([]);
                setMainIdx(null);
                setUploadedImages([]);

                if (onSuccess) onSuccess();

            } else {
                const errorData = await response.json();
                toast.error(`${errorData.error || errorData.message || "Failed to add product"}`);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const uploadAdditionalImages = async (files: FileList | null) => {
        if (!files || files.length === 0 || !createdProductId) return;
        const formData = new FormData();
        Array.from(files).forEach((f) => formData.append('file', f));
        try {
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
        } catch {
            toast.error('Upload failed');
        }
    };

    return (
        <div className="space-y-6">

            {/* SECTION 1: BASIC INFO */}
            <div className="space-y-4">
                <h3 className="text-white font-medium border-b border-gray-700 pb-2">Basic Info</h3>

                <div className="form-control w-full">
                    <label className="label"><span className="label-text text-gray-400">Product Name *</span></label>
                    <input
                        type="text"
                        className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                        value={product.title}
                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Slug *</span></label>
                        <input
                            type="text"
                            className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                            value={convertSlugToURLFriendly(product.slug)}
                            onChange={(e) => setProduct({ ...product, slug: convertSlugToURLFriendly(e.target.value) })}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Manufacturer *</span></label>
                        <input
                            type="text"
                            className="input input-bordered bg-gray-800 border-gray-700 text-white w-full"
                            value={product.manufacturer}
                            onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label"><span className="label-text text-gray-400">Description *</span></label>
                    <textarea
                        className="textarea textarea-bordered bg-gray-800 border-gray-700 text-white w-full h-24"
                        placeholder="Product description..."
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                </div>
            </div>

            {/* SECTION 2: CLASSIFICATION */}
            <div className="space-y-4">
                <h3 className="text-white font-medium border-b border-gray-700 pb-2">Classification</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Merchant *</span></label>
                        <select
                            className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                            value={product.merchantId}
                            onChange={(e) => setProduct({ ...product, merchantId: e.target.value })}
                        >
                            {merchants.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        {!merchants.length && <span className="text-xs text-red-400 mt-1">No merchants found. Create one first.</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text text-gray-400">Category</span></label>
                            <select
                                className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                                value={product.categoryId}
                                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                            >
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text text-gray-400">Brand</span></label>
                            <select
                                className="select select-bordered bg-gray-800 border-gray-700 text-white w-full"
                                value={product.brandId}
                                onChange={(e) => setProduct({ ...product, brandId: e.target.value })}
                            >
                                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: PRICING & STOCK */}
            <div className="space-y-4">
                <h3 className="text-white font-medium border-b border-gray-700 pb-2">Pricing & Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Price (Daily)</span></label>
                        <input type="number" className="input input-bordered bg-gray-800 border-gray-700 text-white"
                            value={product.price} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Deposit</span></label>
                        <input type="number" className="input input-bordered bg-gray-800 border-gray-700 text-white"
                            value={product.deposit} onChange={(e) => setProduct({ ...product, deposit: Number(e.target.value) })} />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Discount %</span></label>
                        <input type="number" className="input input-bordered bg-gray-800 border-gray-700 text-white"
                            value={product.discount} onChange={(e) => setProduct({ ...product, discount: Number(e.target.value) })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">In Stock?</span></label>
                        <select className="select select-bordered bg-gray-800 border-gray-700 text-white"
                            value={product.inStock} onChange={(e) => setProduct({ ...product, inStock: Number(e.target.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text text-gray-400">Availability</span></label>
                        <select className="select select-bordered bg-gray-800 border-gray-700 text-white"
                            value={product.availabilityStatus} onChange={(e: any) => setProduct({ ...product, availabilityStatus: e.target.value })}>
                            <option value="AVAILABLE">Available</option>
                            <option value="UNDER_MAINTENANCE">Maintenance</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION 4: MEDIA */}
            <div className="space-y-4">
                <h3 className="text-white font-medium border-b border-gray-700 pb-2">Media</h3>

                {/* Main Image Input */}
                <div className="form-control w-full">
                    <label className="label"><span className="label-text text-gray-400">Main Image</span></label>
                    <input type="file" accept="image/*" className="file-input file-input-bordered bg-gray-800 border-gray-700 w-full"
                        onChange={async (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const base64 = await fileToBase64(file);
                                setProduct({ ...product, mainImage: base64 });
                            }
                        }}
                    />
                    {product.mainImage && (
                        <div className="mt-2 w-24 h-24 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <Image src={product.mainImage} alt="Preview" width={96} height={96} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Additional Images Drag & Drop */}
                <div className="form-control w-full">
                    <label className="label"><span className="label-text text-gray-400">Additional Images (Drag & Drop)</span></label>
                    <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-gray-500 transition-colors bg-gray-800/30"
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
                            if (files.length) {
                                setPendingFiles((prev) => [...prev, ...files]);
                                if (mainIdx === null) setMainIdx(0);
                            }
                        }}
                    >
                        <FaCloudArrowUp className="mx-auto text-3xl text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400">Drag files here or click to upload</p>
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const files = e.target.files ? Array.from(e.target.files) : [];
                                if (files.length) {
                                    setPendingFiles((prev) => [...prev, ...files]);
                                    if (mainIdx === null) setMainIdx(0);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Pending Files Preview */}
                {pendingFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {pendingFiles.map((f, i) => (
                            <div key={i} className={`relative w-20 h-20 rounded border ${mainIdx === i ? 'border-amber-500' : 'border-gray-700'}`}>
                                <Image src={URL.createObjectURL(f)} alt="pending" fill className="object-cover rounded" />
                                <button className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                                    onClick={() => {
                                        setPendingFiles(prev => prev.filter((_, idx) => idx !== i));
                                        if (mainIdx === i) setMainIdx(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SUBMIT */}
            <div className="pt-4">
                <button
                    onClick={addProduct}
                    disabled={loading}
                    className="btn w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
                >
                    {loading ? <span className="loading loading-spinner" /> : <><FaPlus /> Add Product</>}
                </button>
            </div>
        </div>
    );
};

export default DashboardCreateProductForm;
