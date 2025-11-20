"use client";
import { Toaster } from "react-hot-toast";
import FirstVisitPopup from "@/components/FirstVisitPopup";

import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      <FirstVisitPopup />
      {children}
    </>
  );
};

export default Providers;
