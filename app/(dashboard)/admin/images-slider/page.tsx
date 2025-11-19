"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

type Item = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaHref?: string | null;
  order: number;
  active: boolean;
};

export default function ImagesSliderAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Partial<Item>>({ active: true, order: 0 });

  const load = async () => {
    const res = await apiClient.get("/api/slider");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.imageUrl) { toast.error("imageUrl required"); return; }
    const res = await apiClient.post("/api/slider", form);
    if (res.status === 201) { toast.success("Slider item created"); setForm({ active: true, order: 0 }); load(); }
    else toast.error("Failed to create");
  };

  const update = async (id: string, patch: Partial<Item>) => {
    const res = await apiClient.put(`/api/slider/${id}`, patch);
    if (res.ok) { load(); }
  };
  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/slider/${id}`);
    if (res.status === 204) { toast.success("Deleted"); load(); }
  };

  return (
    <div className="bg-white flex max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Images Slider</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Add Item</h2>
            <div className="space-y-3">
              <input placeholder="Image URL" className="input input-bordered w-full" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <input placeholder="Title" className="input input-bordered w-full" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input placeholder="Subtitle" className="input input-bordered w-full" value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <input placeholder="CTA Text" className="input input-bordered w-full" value={form.ctaText || ""} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
              <input placeholder="CTA Href" className="input input-bordered w-full" value={form.ctaHref || ""} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} />
              <input placeholder="Order" type="number" className="input input-bordered w-full" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
              <button onClick={create} className="bg-blue-500 text-white px-6 py-2 rounded">Create</button>
            </div>
          </div>
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Items</h2>
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-center justify-between border p-3 rounded">
                  <div className="flex-1">
                    <div className="font-semibold">{it.title || "Untitled"}</div>
                    <div className="text-sm text-gray-600">{it.imageUrl}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => update(it.id, { active: !it.active })} className="px-3 py-1 bg-gray-200 rounded">{it.active ? "Disable" : "Enable"}</button>
                    <button onClick={() => remove(it.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}