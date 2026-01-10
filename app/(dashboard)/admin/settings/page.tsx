"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdminHeader } from "@/components";
import apiClient from "@/lib/api";
import { navigation } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGear, FaImage, FaPhone, FaEnvelope, FaBell, FaLink, 
  FaLocationDot, FaPlus, FaTrash, FaCheck, FaXmark,
  FaFacebook, FaInstagram, FaGoogle, FaCreditCard, FaWhatsapp, FaFacebookMessenger
} from "react-icons/fa6";
import toast from "react-hot-toast";

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
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  messengerEnabled?: boolean;
  adminMessengerPsid?: string;
};

// Card component for settings sections
const SettingsCard = ({ title, icon: Icon, children, className = "" }: { 
  title: string; 
  icon: React.ComponentType<{className?: string}>; 
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden ${className}`}
  >
    <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
        <Icon className="text-red-400 text-sm" />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </motion.div>
);

// Input component
const Input = ({ label, value, onChange, placeholder = "", type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
    />
  </div>
);

// Textarea component
const Textarea = ({ label, value, onChange, placeholder = "" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-400">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
    />
  </div>
);

// Toggle component
const Toggle = ({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? "bg-red-500" : "bg-gray-700"
      }`}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  </div>
);

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("header");

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
      footerSale: data?.footerSale || navigation.sale,
      footerAbout: data?.footerAbout || navigation.about,
      footerBuy: data?.footerBuy || navigation.buy,
      footerHelp: data?.footerHelp || navigation.help,
      asdCameraTitle: data?.asdCameraTitle || "ASD Camera",
      asdCameraDescription: data?.asdCameraDescription || "",
      asdCameraLocations: Array.isArray(data?.asdCameraLocations) ? data.asdCameraLocations : [],
      socialLinks: data?.socialLinks || {},
      paymentMethods: Array.isArray(data?.paymentMethods) ? data.paymentMethods : [],
      whatsappNumber: data?.whatsappNumber || "",
      whatsappEnabled: Boolean(data?.whatsappEnabled) || false,
      messengerEnabled: Boolean(data?.messengerEnabled) || false,
      adminMessengerPsid: data?.adminMessengerPsid || "",
    });
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await apiClient.put("/api/settings", settings);
      window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { detail: settings }));
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
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

  const tabs = [
    { id: "header", label: "Header", icon: FaImage },
    { id: "hero", label: "Hero", icon: FaImage },
    { id: "footer", label: "Footer", icon: FaLink },
    { id: "locations", label: "Locations", icon: FaLocationDot },
    { id: "social", label: "Social & Payments", icon: FaFacebook },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FaGear className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 text-sm">Configure your store settings</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaCheck className="text-sm" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <tab.icon className="text-sm" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Header Tab */}
            {activeTab === "header" && (
              <motion.div
                key="header"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-6"
              >
                <SettingsCard title="Branding" icon={FaImage}>
                  <Input 
                    label="Logo URL" 
                    value={settings.logoUrl || ""} 
                    onChange={(v) => setSettings({...settings, logoUrl: v})}
                    placeholder="https://example.com/logo.png"
                  />
                </SettingsCard>
                
                <SettingsCard title="Contact Info" icon={FaPhone}>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Phone" 
                      value={settings.contactPhone || ""} 
                      onChange={(v) => setSettings({...settings, contactPhone: v})}
                      placeholder="+94 77 123 4567"
                    />
                    <Input 
                      label="Email" 
                      value={settings.contactEmail || ""} 
                      onChange={(v) => setSettings({...settings, contactEmail: v})}
                      placeholder="contact@example.com"
                      type="email"
                    />
                  </div>
                </SettingsCard>
                
                <SettingsCard title="Notice Bar" icon={FaBell} className="xl:col-span-2">
                  <Input 
                    label="Notice Text" 
                    value={settings.noticeBarText || ""} 
                    onChange={(v) => setSettings({...settings, noticeBarText: v})}
                    placeholder="Free shipping on orders over Rs. 5000!"
                  />
                  <Toggle 
                    label="Enable Notice Bar" 
                    checked={Boolean(settings.noticeBarEnabled)} 
                    onChange={(v) => setSettings({...settings, noticeBarEnabled: v})}
                  />
                </SettingsCard>

                <SettingsCard title="Chat Support" icon={FaWhatsapp} className="xl:col-span-2">
                  <Input 
                    label="WhatsApp Number" 
                    value={settings.whatsappNumber || ""} 
                    onChange={(v) => setSettings({...settings, whatsappNumber: v})}
                    placeholder="+94771234567"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Toggle 
                      label="Enable WhatsApp" 
                      checked={Boolean(settings.whatsappEnabled)} 
                      onChange={(v) => setSettings({...settings, whatsappEnabled: v})}
                    />
                    <Toggle 
                      label="Enable Messenger" 
                      checked={Boolean(settings.messengerEnabled)} 
                      onChange={(v) => setSettings({...settings, messengerEnabled: v})}
                    />
                  </div>
                </SettingsCard>
              </motion.div>
            )}

            {/* Hero Tab */}
            {activeTab === "hero" && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SettingsCard title="Hero Section" icon={FaImage}>
                  <Input 
                    label="Title" 
                    value={settings.heroTitle || ""} 
                    onChange={(v) => setSettings({...settings, heroTitle: v})}
                    placeholder="Welcome to ASD Camera Rent"
                  />
                  <Textarea 
                    label="Subtitle" 
                    value={settings.heroSubtitle || ""} 
                    onChange={(v) => setSettings({...settings, heroSubtitle: v})}
                    placeholder="Professional camera equipment for every occasion"
                  />
                  <Input 
                    label="Background Image URL" 
                    value={settings.heroImageUrl || ""} 
                    onChange={(v) => setSettings({...settings, heroImageUrl: v})}
                    placeholder="https://example.com/hero.jpg"
                  />
                  {settings.heroImageUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-700">
                      <img src={settings.heroImageUrl} alt="Hero preview" className="w-full h-48 object-cover" />
                    </div>
                  )}
                </SettingsCard>
              </motion.div>
            )}

            {/* Footer Tab */}
            {activeTab === "footer" && (
              <motion.div
                key="footer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {(["footerSale", "footerAbout", "footerBuy", "footerHelp"] as (keyof Settings)[]).map((sectionKey) => {
                  const label = sectionKey.replace("footer", "");
                  const arr = (settings[sectionKey] as LinkItem[]) || [];
                  return (
                    <SettingsCard key={sectionKey} title={`${label} Links`} icon={FaLink}>
                      <div className="space-y-3">
                        {arr.map((item, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 items-center"
                          >
                            <input
                              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 text-sm"
                              placeholder="Link Name"
                              value={item.name}
                              onChange={(e) => updateLink(sectionKey, idx, "name", e.target.value)}
                            />
                            <input
                              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 text-sm"
                              placeholder="URL"
                              value={item.href}
                              onChange={(e) => updateLink(sectionKey, idx, "href", e.target.value)}
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeLink(sectionKey, idx)}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                              <FaTrash className="text-sm" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addLink(sectionKey)}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <FaPlus />
                        Add Link
                      </motion.button>
                    </SettingsCard>
                  );
                })}
              </motion.div>
            )}

            {/* Locations Tab */}
            {activeTab === "locations" && (
              <motion.div
                key="locations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SettingsCard title="ASD Camera Locations" icon={FaLocationDot}>
                  <Input 
                    label="Section Title" 
                    value={settings.asdCameraTitle || ""} 
                    onChange={(v) => setSettings({...settings, asdCameraTitle: v})}
                  />
                  <Textarea 
                    label="Description" 
                    value={settings.asdCameraDescription || ""} 
                    onChange={(v) => setSettings({...settings, asdCameraDescription: v})}
                  />

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-400">Locations</h3>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addLocation}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <FaPlus className="text-xs" />
                        Add Location
                      </motion.button>
                    </div>

                    {(settings.asdCameraLocations || []).map((loc, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 space-y-3"
                      >
                        <div className="flex gap-3 items-center">
                          <input
                            className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 text-sm"
                            placeholder="City Name"
                            value={loc.city}
                            onChange={(e) => updateLocation(idx, "city", e.target.value)}
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeLocation(idx)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </motion.button>
                        </div>
                        
                        <div className="space-y-2">
                          {(loc.phones || []).map((ph, pIdx) => (
                            <div key={pIdx} className="flex gap-2 items-center">
                              <input
                                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 text-sm"
                                placeholder="Phone Number"
                                value={ph}
                                onChange={(e) => updateLocation(idx, "phones", e.target.value, pIdx)}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removePhone(idx, pIdx)}
                                className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                <FaXmark className="text-sm" />
                              </motion.button>
                            </div>
                          ))}
                          <button
                            onClick={() => addPhone(idx)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            + Add Phone
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </SettingsCard>
              </motion.div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-6"
              >
                <SettingsCard title="Social Links" icon={FaFacebook}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <FaFacebook className="text-blue-400" />
                      </div>
                      <input
                        className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
                        placeholder="Facebook URL"
                        value={settings.socialLinks?.facebook || ""}
                        onChange={(e) => setSettings({...settings, socialLinks: { ...(settings.socialLinks || {}), facebook: e.target.value }})}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center">
                        <FaInstagram className="text-pink-400" />
                      </div>
                      <input
                        className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 text-sm"
                        placeholder="Instagram URL"
                        value={settings.socialLinks?.instagram || ""}
                        onChange={(e) => setSettings({...settings, socialLinks: { ...(settings.socialLinks || {}), instagram: e.target.value }})}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                        <FaGoogle className="text-red-400" />
                      </div>
                      <input
                        className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 text-sm"
                        placeholder="Google URL"
                        value={settings.socialLinks?.google || ""}
                        onChange={(e) => setSettings({...settings, socialLinks: { ...(settings.socialLinks || {}), google: e.target.value }})}
                      />
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard title="Payment Methods" icon={FaCreditCard}>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-gray-500 transition-colors">
                      <FaPlus className="text-gray-500" />
                      <span className="text-sm text-gray-400">Upload Payment Logos</span>
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => handleUploadPaymentLogos(e.target.files)} 
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {(settings.paymentMethods || []).map((pm, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative bg-gray-800/50 rounded-xl p-3 border border-gray-700"
                        >
                          <img src={pm.imageUrl} alt={pm.name || "Payment"} className="h-12 w-full object-contain" />
                          <input
                            className="mt-2 w-full px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-xs"
                            placeholder="Label (optional)"
                            value={pm.name || ""}
                            onChange={(e) => {
                              const arr = (settings.paymentMethods || []).slice();
                              arr[idx] = { ...arr[idx], name: e.target.value };
                              setSettings({ ...settings, paymentMethods: arr });
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const arr = (settings.paymentMethods || []).slice();
                              arr.splice(idx, 1);
                              setSettings({ ...settings, paymentMethods: arr });
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            <FaXmark className="text-xs" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </SettingsCard>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
