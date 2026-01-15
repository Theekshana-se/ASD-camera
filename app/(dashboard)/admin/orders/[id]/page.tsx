"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaBox,
  FaUser,
  FaTruck,
  FaCreditCard,
  FaTrash,
  FaFloppyDisk,
  FaCheck,
  FaArrowLeft,
  FaCopy,
  FaLocationDot,
  FaPhone,
  FaEnvelope
} from "react-icons/fa6";
import { motion } from "framer-motion";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
    deposit: number;
  };
}

interface Order {
  id: string;
  adress: string;
  apartment: string;
  company: string;
  dateTime: string;
  email: string;
  lastname: string;
  name: string;
  phone: string;
  postalCode: string;
  city: string;
  country: string;
  orderNotice: string;
  status: "processing" | "delivered" | "canceled";
  rentalDurationDays: number;
  fulfillmentMethod: string;
  total: number;
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    rentalDurationDays: 1,
    fulfillmentMethod: "delivery",
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, productsRes] = await Promise.all([
          apiClient.get(`/api/orders/${params?.id}`),
          apiClient.get(`/api/order-product/${params?.id}`)
        ]);

        const orderData = await orderRes.json();
        const productsData = await productsRes.json();

        setOrder(orderData);
        setOrderProducts(productsData);
      } catch (error) {
        toast.error("Failed to load order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchData();
    }
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      !order.name || !order.lastname || !order.phone || !order.email ||
      !order.adress || !order.city || !order.country || !order.postalCode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isValidNameOrLastname(order.name)) {
      toast.error("Invalid name format");
      return;
    }
    if (!isValidNameOrLastname(order.lastname)) {
      toast.error("Invalid lastname format");
      return;
    }
    if (!isValidEmailAddressFormat(order.email)) {
      toast.error("Invalid email format");
      return;
    }

    const toastId = toast.loading("Updating order...");
    try {
      const response = await apiClient.put(`/api/orders/${order.id}`, {
        ...order
      });

      if (response.ok) {
        toast.success("Order updated successfully", { id: toastId });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update order", { id: toastId });
    }
  };

  const deleteOrder = async () => {
    // if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting order...");
    try {
      // First delete products association
      await apiClient.delete(`/api/order-product/${order.id}`);
      // Then delete order
      await apiClient.delete(`/api/orders/${order.id}`);

      toast.success("Order deleted successfully", { id: toastId });
      router.push("/admin/orders");
    } catch (error) {
      toast.error("Failed to delete order", { id: toastId });
    }
  };

  const copySummary = () => {
    const summary = (orderProducts || []).map((p) => `${p.product.title} x${p.quantity}`).join("; ");
    const txt = `Order ${order.id}\nCustomer: ${order.name} ${order.lastname}\nItems: ${summary}\nTotal: $${order.total}`;
    navigator.clipboard.writeText(txt);
    toast.success("Order summary copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "canceled": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans selection:bg-amber-500/30">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-lg text-amber-500"></span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto space-y-6"
            >
              {/* Header Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <FaArrowLeft className="text-gray-400" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                      Order #{order.id.slice(-6)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                        {order.status}
                      </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{new Date(order.dateTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={copySummary}
                    className="btn btn-sm bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <FaCopy className="mr-2" /> Summary
                  </button>
                  <button
                    onClick={updateOrder}
                    className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-600 border-none text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                  >
                    <FaFloppyDisk className="mr-2" /> Save Changes
                  </button>
                  <button
                    onClick={deleteOrder}
                    className="btn btn-sm bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT COLUMN - Order Info */}
                <div className="xl:col-span-2 space-y-6">

                  {/* Order Items */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FaBox className="text-amber-500" /> Order Items
                    </h2>
                    <div className="space-y-4">
                      {orderProducts?.map((product) => (
                        <div key={product.id} className="flex gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                          <div className="w-20 h-20 bg-white rounded-lg p-2 shrink-0">
                            <Image
                              src={product?.product?.mainImage ? `/${product?.product?.mainImage}` : "/product_placeholder.jpg"}
                              alt={product?.product?.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={`/product/${product?.product?.slug}`} className="font-medium text-lg hover:text-amber-500 transition-colors line-clamp-1">
                              {product?.product?.title}
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span className="bg-gray-800 px-2 py-1 rounded">Qty: {product.quantity}</span>
                              <span>${product.product.price.toLocaleString()} / unit</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-lg text-white">
                              ${(product.product.price * product.quantity).toLocaleString()}
                            </div>
                            {product.product.deposit > 0 && (
                              <div className="text-xs text-amber-500">
                                + ${product.product.deposit * product.quantity} deposit
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col gap-2 items-end">
                      <div className="flex justify-between w-full max-w-xs text-gray-400">
                        <span>Subtotal</span>
                        <span>${(orderProducts || []).reduce((acc, p) => acc + (p?.product?.price || 0) * (p?.quantity || 0), 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between w-full max-w-xs text-gray-400">
                        <span>Deposit</span>
                        <span>${(orderProducts || []).reduce((acc, p) => acc + (p?.product?.deposit || 0) * (p?.quantity || 0), 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between w-full max-w-xs text-xl font-bold text-white mt-2 pt-2 border-t border-gray-800">
                        <span>Total</span>
                        <span className="text-amber-500">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Form */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FaUser className="text-blue-500" /> Customer Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">First Name</label>
                        <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-blue-500"
                          value={order.name} onChange={(e) => setOrder({ ...order, name: e.target.value })} />
                      </div>
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Last Name</label>
                        <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-blue-500"
                          value={order.lastname} onChange={(e) => setOrder({ ...order, lastname: e.target.value })} />
                      </div>
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Email</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="email" className="input input-bordered bg-gray-800 border-gray-700 focus:border-blue-500 pl-10 w-full"
                            value={order.email} onChange={(e) => setOrder({ ...order, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Phone</label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-blue-500 pl-10 w-full"
                            value={order.phone} onChange={(e) => setOrder({ ...order, phone: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-control md:col-span-2">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Company (Optional)</label>
                        <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-blue-500"
                          value={order.company} onChange={(e) => setOrder({ ...order, company: e.target.value })} />
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN - Shipping & Status */}
                <div className="space-y-6">

                  {/* Status Card */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FaCreditCard className="text-purple-500" /> Order Status
                    </h2>
                    <select
                      className="select select-bordered w-full bg-gray-800 border-gray-700"
                      value={order.status}
                      onChange={(e) => setOrder({ ...order, status: e.target.value as any })}
                    >
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <label className="label text-gray-400 text-xs uppercase font-bold">Order Notes</label>
                      <textarea
                        className="textarea textarea-bordered w-full bg-gray-800 border-gray-700 h-32"
                        placeholder="Add internal notes..."
                        value={order.orderNotice}
                        onChange={(e) => setOrder({ ...order, orderNotice: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FaTruck className="text-green-500" /> Delivery Details
                    </h2>
                    <div className="flex items-center gap-2 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                      <FaCheck /> Method: <span className="font-bold uppercase">{order.fulfillmentMethod || "Delivery"}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Address</label>
                        <div className="relative">
                          <FaLocationDot className="absolute left-3 top-3 text-gray-500" />
                          <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-green-500 pl-10 w-full"
                            value={order.adress} onChange={(e) => setOrder({ ...order, adress: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Apartment / Suite</label>
                        <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-green-500"
                          value={order.apartment} onChange={(e) => setOrder({ ...order, apartment: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="form-control">
                          <label className="label text-gray-400 text-xs uppercase font-bold">City</label>
                          <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-green-500"
                            value={order.city} onChange={(e) => setOrder({ ...order, city: e.target.value })} />
                        </div>
                        <div className="form-control">
                          <label className="label text-gray-400 text-xs uppercase font-bold">Postal Code</label>
                          <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-green-500"
                            value={order.postalCode} onChange={(e) => setOrder({ ...order, postalCode: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label text-gray-400 text-xs uppercase font-bold">Country</label>
                        <input type="text" className="input input-bordered bg-gray-800 border-gray-700 focus:border-green-500"
                          value={order.country} onChange={(e) => setOrder({ ...order, country: e.target.value })} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
