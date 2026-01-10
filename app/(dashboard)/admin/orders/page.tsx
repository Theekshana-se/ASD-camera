"use client";
import { AdminOrders, DashboardSidebar, AdminHeader } from "@/components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
          <AdminOrders />
        </main>
      </div>
    </div>
  );
};

export default DashboardOrdersPage;
