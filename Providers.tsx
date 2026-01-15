"use client";
import { Toaster } from "react-hot-toast";
import FirstVisitPopup from "@/components/FirstVisitPopup";
import React, { createContext, useContext, useMemo } from "react";

type Settings = {
  logoUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  noticeBarText?: string;
  noticeBarEnabled?: boolean;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

export const useSettings = () => {
  return useContext(SettingsContext);
};

const Providers = ({ children, settings }: { children: React.ReactNode; settings?: Settings }) => {
  const value = useMemo(() => settings, [settings]);
  return (
    <SettingsContext.Provider value={value}>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      <FirstVisitPopup />
      {children}
    </SettingsContext.Provider>
  );
};

export default Providers;
