// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

const HeaderTop = ({ noticeBarEnabled, noticeBarText }: { noticeBarEnabled?: boolean; noticeBarText?: string }) => {
  useSession();
  if (!noticeBarEnabled) return null;
  return (
    <div className="h-10 text-white bg-red-600">
      <div className="max-w-screen-2xl mx-auto px-12 h-full flex items-center">
        <div className="flex items-center gap-x-2 font-semibold animate-fade-in">
          <FaRegCircleCheck className="text-white" />
          <span className="truncate">{noticeBarText || "Welcome to ASD Family...!"}</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
