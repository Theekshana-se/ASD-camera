"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";

type PopupItem = {
  id: string;
  name: string;
  imageUrl: string;
  enabled: boolean;
  isActive: boolean;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PopupsAdminPage() {
  const [items, setItems] = useState<PopupItem[]>([]);
  const [preview, setPreview] = useState<PopupItem | null>(null);
  const [showEnabled, setShowEnabled] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [image64, setImage64] = useState<string>("");

  const load = async () => {
    const res = await apiClient.get("/api/popups");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    const sres = await apiClient.get("/api/settings");
    const sdata = await sres.json();
    setShowEnabled(sdata?.showPopupEnabled !== undefined ? !!sdata.showPopupEnabled : true);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name || !image64) { toast.error("Image and name are required"); return; }
    const res = await apiClient.post("/api/popups", { name, imageUrl: image64, enabled: true });
    if (res.status === 201) { toast.success("Popup created"); setName(""); setImage64(""); load(); }
    else toast.error("Failed to create popup");
  };

  const setActive = async (id: string) => {
    const res = await apiClient.put(`/api/popups/${id}/activate`);
    if (res.ok) { toast.success("Set as active pop up message"); load(); }
  };

  const toggleEnabled = async (item: PopupItem) => {
    const res = await apiClient.put(`/api/popups/${item.id}`, { enabled: !item.enabled });
    if (res.ok) { load(); }
  };

  const remove = async (id: string) => {
    const res = await apiClient.delete(`/api/popups/${id}`);
    if (res.status === 204) { toast.success("Deleted"); load(); }
  };

  const updateShowEnabled = async (value: boolean) => {
    setShowEnabled(value);
    const res = await apiClient.put("/api/settings", { showPopupEnabled: value });
    if (!res.ok) toast.error("Failed to update show popup toggle");
  };

  return (
    <div className="bg-white flex max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <label className="flex items-center gap-2 text-sm">
            <span>Show Popup:</span>
            <input type="checkbox" className="toggle" checked={showEnabled} onChange={(e)=>updateShowEnabled(e.target.checked)} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Create Pop Up Message</h2>
            <div className="space-y-3">
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={async (e:any)=>{
                const f = e.target.files?.[0];
                if (!f) return; const b64 = await fileToBase64(f); setImage64(b64);
              }} />
              <input placeholder="Name" className="input input-bordered w-full" value={name} onChange={(e)=>setName(e.target.value)} />
              <button onClick={create} className="bg-gray-300 text-gray-700 px-6 py-2 rounded">Create</button>
            </div>
          </div>
          <div className="border p-4 rounded">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold mb-3">Message Images</h2>
            </div>
            <ul className="space-y-3">
              {items.map((it, idx)=> (
                <li key={it.id} className="flex items-center justify-between border p-3 rounded">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-8 text-center">{idx+1}</span>
                    <div className="w-16 h-16 relative overflow-hidden rounded">
                      {it.imageUrl && (
                        <Image src={it.imageUrl} alt={it.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs">{it.isActive ? <span className="badge badge-success">Active Popup</span> : <span className="badge">{it.enabled ? "Enabled" : "Disabled"}</span>}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setActive(it.id)} className="btn btn-success btn-sm">Set Active</button>
                    <button onClick={()=>setPreview(it)} className="btn btn-outline btn-sm">Preview</button>
                    <button onClick={()=>toggleEnabled(it)} className="btn btn-warning btn-sm">{it.enabled ? "Disable" : "Enable"}</button>
                    <button onClick={()=>remove(it.id)} className="btn btn-error btn-sm">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {preview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[90%] max-w-2xl p-4 shadow-xl relative">
              <button className="absolute right-4 top-4" onClick={()=>setPreview(null)}>✕</button>
              <div className="font-bold text-lg mb-4">{preview.name}</div>
              <div className="relative w-full h-[360px] rounded-lg overflow-hidden">
                <Image src={preview.imageUrl} alt={preview.name} fill className="object-contain" />
              </div>
              <div className="mt-6 text-center">
                <button className="btn btn-error" onClick={()=>setPreview(null)}>Got it!</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}