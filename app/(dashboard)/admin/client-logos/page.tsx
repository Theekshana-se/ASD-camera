"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

type Logo = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  href?: string | null;
  order: number;
  active: boolean;
};

export default function ClientLogosAdminPage() {
  const [items, setItems] = useState<Logo[]>([]);
  const [form, setForm] = useState<Partial<Logo>>({ active: true, order: 0 });

  const load = async () => {
    const res = await apiClient.get("/api/client-logos");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.imageUrl) { toast.error("imageUrl required"); return; }
    const res = await apiClient.post("/api/client-logos", form);
    if (res.status === 201) { toast.success("Logo added"); setForm({ active: true, order: 0 }); load(); }
    else toast.error("Failed to add");
  };

  const update = async (id: string, patch: Partial<Logo>) => {
    const res = await apiClient.put(`/api/client-logos/${id}`, patch);
    if (res.ok) { load(); }
  };
  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/client-logos/${id}`);
    if (res.status === 204) { toast.success("Deleted"); load(); }
  };

  return (
    <div className="bg-white flex max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Client Logos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Add Logo</h2>
            <div className="space-y-3">
              <input placeholder="Image URL" className="input input-bordered w-full" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <input placeholder="Alt" className="input input-bordered w-full" value={form.alt || ""} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
              <input placeholder="Href" className="input input-bordered w-full" value={form.href || ""} onChange={(e) => setForm({ ...form, href: e.target.value })} />
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