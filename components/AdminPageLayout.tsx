"use client";
import React from "react";
import { DashboardSidebar } from "@/components";
import { motion } from "framer-motion";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  actions 
}) => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPageLayout;
