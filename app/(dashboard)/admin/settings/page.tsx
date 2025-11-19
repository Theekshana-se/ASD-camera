"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";

type LinkItem = { name: string; href: string };
type Settings = {
  logoUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  footerSale?: LinkItem[] | null;
  footerAbout?: LinkItem[] | null;
  footerBuy?: LinkItem[] | null;
  footerHelp?: LinkItem[] | null;
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    const res = await apiClient.get("/api/settings", { cache: "no-store" });
    const data = await res.json();
    setSettings({
      logoUrl: data?.logoUrl || "",
      contactPhone: data?.contactPhone || "",
      contactEmail: data?.contactEmail || "",
      heroTitle: data?.heroTitle || "",
      heroSubtitle: data?.heroSubtitle || "",
      heroImageUrl: data?.heroImageUrl || "",
      footerSale: data?.footerSale || [],
      footerAbout: data?.footerAbout || [],
      footerBuy: data?.footerBuy || [],
      footerHelp: data?.footerHelp || [],
    });
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    await apiClient.put("/api/settings", settings);
    setSaving(false);
  };

  const updateLink = (section: keyof Settings, index: number, field: keyof LinkItem, value: string) => {
    const arr = (settings[section] as LinkItem[])?.slice() || [];
    arr[index] = { ...arr[index], [field]: value };
    setSettings({ ...settings, [section]: arr });
  };

  const addLink = (section: keyof Settings) => {
    const arr = (settings[section] as LinkItem[])?.slice() || [];
    arr.push({ name: "", href: "#" });
    setSettings({ ...settings, [section]: arr });
  };

  const removeLink = (section: keyof Settings, index: number) => {
    const arr = (settings[section] as LinkItem[])?.slice() || [];
    arr.splice(index, 1);
    setSettings({ ...settings, [section]: arr });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        {loading ? (
          <div className="loading loading-spinner loading-lg" />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">Header</h2>
                <label className="form-control w-full">
                  <span className="label-text">Logo URL</span>
                  <input className="input input-bordered w-full" value={settings.logoUrl || ""} onChange={(e)=>setSettings({...settings, logoUrl: e.target.value})} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="form-control">
                    <span className="label-text">Contact Phone</span>
                    <input className="input input-bordered" value={settings.contactPhone || ""} onChange={(e)=>setSettings({...settings, contactPhone: e.target.value})} />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Contact Email</span>
                    <input className="input input-bordered" value={settings.contactEmail || ""} onChange={(e)=>setSettings({...settings, contactEmail: e.target.value})} />
                  </label>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">Hero</h2>
                <label className="form-control w-full">
                  <span className="label-text">Title</span>
                  <input className="input input-bordered w-full" value={settings.heroTitle || ""} onChange={(e)=>setSettings({...settings, heroTitle: e.target.value})} />
                </label>
                <label className="form-control w-full">
                  <span className="label-text">Subtitle</span>
                  <textarea className="textarea textarea-bordered w-full" value={settings.heroSubtitle || ""} onChange={(e)=>setSettings({...settings, heroSubtitle: e.target.value})} />
                </label>
                <label className="form-control w-full">
                  <span className="label-text">Image URL</span>
                  <input className="input input-bordered w-full" value={settings.heroImageUrl || ""} onChange={(e)=>setSettings({...settings, heroImageUrl: e.target.value})} />
                </label>
              </div>
            </div>

            <div className="card bg-base-100 shadow xl:col-span-2">
              <div className="card-body">
                <h2 className="card-title">Footer Sections</h2>
                {(["footerSale","footerAbout","footerBuy","footerHelp"] as (keyof Settings)[]).map((sectionKey)=>{
                  const label = sectionKey.replace("footer"," ");
                  const arr = (settings[sectionKey] as LinkItem[]) || [];
                  return (
                    <div key={sectionKey} className="mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{label}</h3>
                        <button className="btn btn-sm" onClick={()=>addLink(sectionKey)}>Add Link</button>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {arr.map((item, idx)=> (
                          <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                            <input className="input input-bordered col-span-2" placeholder="Name" value={item.name} onChange={(e)=>updateLink(sectionKey, idx, "name", e.target.value)} />
                            <input className="input input-bordered col-span-2" placeholder="Href" value={item.href} onChange={(e)=>updateLink(sectionKey, idx, "href", e.target.value)} />
                            <button className="btn btn-error btn-outline btn-sm" onClick={()=>removeLink(sectionKey, idx)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="xl:col-span-2 flex justify-end">
              <button className={`btn btn-primary ${saving?"loading":""}`} onClick={saveSettings}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;