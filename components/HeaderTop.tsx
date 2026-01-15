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
import { motion } from "framer-motion";

const HeaderTop = ({ noticeBarEnabled, noticeBarText, noticeBarAnimationEnabled = true }: { noticeBarEnabled?: boolean; noticeBarText?: string; noticeBarAnimationEnabled?: boolean }) => {
  useSession();
  if (!noticeBarEnabled) return null;
  return (
    <div className="h-10 text-white bg-red-600 overflow-hidden relative">
      <div className="max-w-screen-2xl mx-auto px-12 h-full flex items-center relative z-10 bg-red-600">
        <div className="flex items-center gap-x-2 font-semibold w-full">
          <FaRegCircleCheck className="text-white shrink-0" />
          <div className="relative flex-1 overflow-hidden h-6">
            {noticeBarAnimationEnabled ? (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
                initial={{ left: "100%" }}
                animate={{ left: "-100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 30,
                  ease: "linear",
                }}
              >
                <span>{noticeBarText || "Welcome to ASD Family...!"}</span>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-start">
                <span className="truncate">{noticeBarText || "Welcome to ASD Family...!"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
