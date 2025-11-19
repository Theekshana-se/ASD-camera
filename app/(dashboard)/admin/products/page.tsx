"use client";
import { DashboardSidebar } from "@/components";
import React from "react";
import DashboardProductTable from "@/components/DashboardProductTable";

const AdminProductsPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <DashboardProductTable />
      </div>
    </div>
  );
};

export default AdminProductsPage;
