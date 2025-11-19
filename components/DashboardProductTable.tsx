// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table
// *********************

"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import toast from "react-hot-toast";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient.get("/api/products?mode=admin", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.error || "Failed to fetch products");
          setProducts([]);
          return;
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast.error("Network error while fetching products");
        setProducts([]);
      });
  }, []);

  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/products/${id}`);
    if (res.status === 204) {
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else if (res.status === 400) {
      toast.error("Cannot delete product due to order references");
    } else {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold text-center mb-5">All products</h1>
      <div className="flex justify-end mb-5">
        <Link href="/admin/products/new">
          <CustomButton
            buttonType="button"
            customWidth="110px"
            paddingX={10}
            paddingY={5}
            textSize="base"
            text="Add new product"
          />
        </Link>
      </div>

      <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Product</th>
              <th>Stock Availability</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {products &&
              products.map((product) => (
                <tr key={nanoid()}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <Image
                            width={48}
                            height={48}
                            src={
                              product?.mainImage
                                ? (product.mainImage.startsWith("data:") || product.mainImage.startsWith("http")
                                    ? product.mainImage
                                    : `/${product.mainImage}`)
                                : "/product_placeholder.jpg"
                            }
                            alt={sanitize(product?.title) || "Product image"}
                            className="w-auto h-auto"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{sanitize(product?.title)}</div>
                        <div className="text-sm opacity-50">
                          {sanitize(product?.manufacturer)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    { product?.inStock ? (<span className="badge badge-success text-white badge-sm">
                      In stock
                    </span>) : (<span className="badge badge-error text-white badge-sm">
                      Out of stock
                    </span>) }
                    
                  </td>
                  <td>${product?.price}</td>
                  <th className="space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(product.id)}
                      className="btn btn-error btn-outline btn-xs"
                    >
                      Delete
                    </button>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Stock Availability</th>
              <th>Price</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DashboardProductTable;
