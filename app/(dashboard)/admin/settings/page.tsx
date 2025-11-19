"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  noticeBarText?: string;
  noticeBarEnabled?: boolean;
  footerSale?: LinkItem[] | null;
  footerAbout?: LinkItem[] | null;
  footerBuy?: LinkItem[] | null;
  footerHelp?: LinkItem[] | null;
  asdCameraTitle?: string;
  asdCameraDescription?: string;
  asdCameraLocations?: { city: string; phones: string[] }[] | null;
  socialLinks?: { facebook?: string; instagram?: string; google?: string } | null;
  paymentMethods?: { name?: string; imageUrl: string }[] | null;
};

const AdminSettingsPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{type: 'success'|'error'|'info', msg: string}|null>(null);

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
      noticeBarText: data?.noticeBarText || "",
      noticeBarEnabled: Boolean(data?.noticeBarEnabled) || false,
      footerSale: data?.footerSale || [],
      footerAbout: data?.footerAbout || [],
      footerBuy: data?.footerBuy || [],
      footerHelp: data?.footerHelp || [],
      asdCameraTitle: data?.asdCameraTitle || "ASD Camera",
      asdCameraDescription: data?.asdCameraDescription || "",
      asdCameraLocations: Array.isArray(data?.asdCameraLocations) ? data.asdCameraLocations : [],
      socialLinks: data?.socialLinks || {},
      paymentMethods: Array.isArray(data?.paymentMethods) ? data.paymentMethods : [],
    });
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await apiClient.put("/api/settings", settings);
      window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { detail: settings }));
      setStatus({ type: 'success', msg: 'Footer updated successfully' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to update footer' });
    }
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

  const addLocation = () => {
    const arr = (settings.asdCameraLocations || []).slice();
    arr.push({ city: "", phones: [""] });
    setSettings({ ...settings, asdCameraLocations: arr });
  };

  const updateLocation = (index: number, field: "city" | "phones", value: any, phoneIndex?: number) => {
    const arr = (settings.asdCameraLocations || []).slice();
    if (field === "city") arr[index].city = value;
    if (field === "phones") {
      const phones = (arr[index].phones || []).slice();
      phones[phoneIndex || 0] = value;
      arr[index].phones = phones;
    }
    setSettings({ ...settings, asdCameraLocations: arr });
  };

  const addPhone = (index: number) => {
    const arr = (settings.asdCameraLocations || []).slice();
    const phones = (arr[index].phones || []).slice();
    phones.push("");
    arr[index].phones = phones;
    setSettings({ ...settings, asdCameraLocations: arr });
  };

  const removePhone = (index: number, phoneIndex: number) => {
    const arr = (settings.asdCameraLocations || []).slice();
    const phones = (arr[index].phones || []).slice();
    phones.splice(phoneIndex, 1);
    arr[index].phones = phones;
    setSettings({ ...settings, asdCameraLocations: arr });
  };

  const removeLocation = (index: number) => {
    const arr = (settings.asdCameraLocations || []).slice();
    arr.splice(index, 1);
    setSettings({ ...settings, asdCameraLocations: arr });
  };

  const handleUploadPaymentLogos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    const res = await fetch(`${apiClient.baseUrl}/api/payment-methods/upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    const urls: string[] = data?.urls || [];
    const pm = (settings.paymentMethods || []).slice();
    urls.forEach((u) => pm.push({ imageUrl: u }));
    setSettings({ ...settings, paymentMethods: pm });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        {status && (
          <div className={`alert ${status.type==='success'?'alert-success':status.type==='error'?'alert-error':'alert-info'} mb-4`}>
            <span>{status.msg}</span>
          </div>
        )}
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
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <label className="form-control">
                    <span className="label-text">Top Notice Text</span>
                    <input className="input input-bordered" value={settings.noticeBarText || ""} onChange={(e)=>setSettings({...settings, noticeBarText: e.target.value})} />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Enable Notice Bar</span>
                    <input type="checkbox" className="toggle" checked={Boolean(settings.noticeBarEnabled)} onChange={(e)=>setSettings({...settings, noticeBarEnabled: e.target.checked})} />
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

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">ASD Camera Section</h2>
                <label className="form-control w-full">
                  <span className="label-text">Title</span>
                  <input className="input input-bordered w-full" value={settings.asdCameraTitle || ""} onChange={(e)=>setSettings({...settings, asdCameraTitle: e.target.value})} />
                </label>
                <label className="form-control w-full">
                  <span className="label-text">Description</span>
                  <textarea className="textarea textarea-bordered w-full" value={settings.asdCameraDescription || ""} onChange={(e)=>setSettings({...settings, asdCameraDescription: e.target.value})} />
                </label>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Locations</h3>
                    <button className="btn btn-sm" onClick={addLocation}>Add Location</button>
                  </div>
                  {(settings.asdCameraLocations || []).map((loc, idx)=> (
                    <div key={idx} className="mt-3 border rounded p-3 space-y-2">
                      <div className="flex gap-2 items-center">
                        <input className="input input-bordered flex-1" placeholder="City" value={loc.city} onChange={(e)=>updateLocation(idx, "city", e.target.value)} />
                        <button className="btn btn-error btn-outline btn-sm" onClick={()=>removeLocation(idx)}>Remove</button>
                      </div>
                      <div className="space-y-2">
                        {(loc.phones || []).map((ph, pIdx)=> (
                          <div key={pIdx} className="flex gap-2 items-center">
                            <input className="input input-bordered flex-1" placeholder="Phone" value={ph} onChange={(e)=>updateLocation(idx, "phones", e.target.value, pIdx)} />
                            <button className="btn btn-outline btn-sm" onClick={()=>removePhone(idx, pIdx)}>Remove</button>
                          </div>
                        ))}
                        <button className="btn btn-sm" onClick={()=>addPhone(idx)}>Add Phone</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">Social Links & Payment Methods</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="form-control">
                    <span className="label-text">Facebook URL</span>
                    <input className="input input-bordered" value={settings.socialLinks?.facebook || ""} onChange={(e)=>setSettings({...settings, socialLinks: { ...(settings.socialLinks||{}), facebook: e.target.value }})} />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Instagram URL</span>
                    <input className="input input-bordered" value={settings.socialLinks?.instagram || ""} onChange={(e)=>setSettings({...settings, socialLinks: { ...(settings.socialLinks||{}), instagram: e.target.value }})} />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Google URL</span>
                    <input className="input input-bordered" value={settings.socialLinks?.google || ""} onChange={(e)=>setSettings({...settings, socialLinks: { ...(settings.socialLinks||{}), google: e.target.value }})} />
                  </label>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Payment Logos</h3>
                    <input type="file" multiple onChange={(e)=>handleUploadPaymentLogos(e.target.files)} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(settings.paymentMethods || []).map((pm, idx)=> (
                      <div key={idx} className="border rounded p-2 space-y-2">
                        <img src={pm.imageUrl} alt={pm.name || "logo"} className="h-16 w-full object-contain" />
                        <input className="input input-bordered w-full" placeholder="Name (optional)" value={pm.name || ""} onChange={(e)=>{
                          const arr = (settings.paymentMethods || []).slice();
                          arr[idx] = { ...arr[idx], name: e.target.value };
                          setSettings({ ...settings, paymentMethods: arr });
                        }} />
                        <button className="btn btn-outline btn-sm w-full" onClick={()=>{
                          const arr = (settings.paymentMethods || []).slice();
                          arr.splice(idx, 1);
                          setSettings({ ...settings, paymentMethods: arr });
                        }}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
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