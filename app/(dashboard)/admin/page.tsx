"use client";
import { DashboardSidebar } from "@/components";
import React from "react";
import dynamic from "next/dynamic";
import apiClient from "@/lib/api";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type CountsResponse = {
  products: { total: number; offerActive: number };
  orders: { total: number; byStatus: Record<string, number> };
  notifications: { total: number };
};

type TrendsResponse = {
  ordersPerDay: { date: string; count: number }[];
};

const AdminDashboardPage = () => {
  const [counts, setCounts] = React.useState<CountsResponse | null>(null);
  const [trends, setTrends] = React.useState<TrendsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [cres, tres] = await Promise.all([
          apiClient.get("/api/stats/counts", { cache: "no-store" }),
          apiClient.get("/api/stats/trends?days=30", { cache: "no-store" }),
        ]);
        const cdata = await cres.json();
        const tdata = await tres.json();
        setCounts(cdata);
        setTrends(tdata);
      } catch {
        setCounts(null);
        setTrends(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderSeries = trends?.ordersPerDay?.map((d) => d.count) || [];
  const orderCategories = trends?.ordersPerDay?.map((d) => d.date) || [];

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="text-sm text-gray-500">Products</div>
              <div className="text-3xl font-bold">{counts?.products?.total ?? (loading ? "…" : 0)}</div>
              <div className="text-xs text-gray-600">Active offers: {counts?.products?.offerActive ?? (loading ? "…" : 0)}</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="text-sm text-gray-500">Orders</div>
              <div className="text-3xl font-bold">{counts?.orders?.total ?? (loading ? "…" : 0)}</div>
              <div className="text-xs text-gray-600">Pending: {counts?.orders?.byStatus?.PENDING ?? (loading ? "…" : 0)}</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="text-sm text-gray-500">Notifications</div>
              <div className="text-3xl font-bold">{counts?.notifications?.total ?? (loading ? "…" : 0)}</div>
              <div className="text-xs text-gray-600">Total messages</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="text-sm text-gray-500">Offer Items</div>
              <div className="text-3xl font-bold">{counts?.products?.offerActive ?? (loading ? "…" : 0)}</div>
              <div className="text-xs text-gray-600">Available for rent</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="text-lg font-semibold mb-2">Orders (Last 30 Days)</div>
            {!loading && orderSeries.length > 0 ? (
              <ReactApexChart
                type="line"
                height={300}
                series={[{ name: "Orders", data: orderSeries }]}
                options={{
                  chart: { id: "orders" },
                  xaxis: { categories: orderCategories },
                  stroke: { curve: "smooth" },
                }}
              />
            ) : (
              <div className="text-gray-500">Loading…</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
