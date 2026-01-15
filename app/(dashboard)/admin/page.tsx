"use client";
import { DashboardSidebar, AdminHeader } from "@/components";
import React from "react";
import dynamic from "next/dynamic";
import apiClient from "@/lib/api";
import { motion } from "framer-motion";
import { 
  FaBox, FaCartShopping, FaBell, FaTag,
  FaArrowUp, FaArrowDown, FaCalendarDay, FaChartLine
} from "react-icons/fa6";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type CountsResponse = {
  products: { total: number; offerActive: number };
  orders: { total: number; byStatus: Record<string, number> };
  notifications: { total: number };
};

type TrendsResponse = {
  ordersPerDay: { date: string; count: number }[];
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (hasAnimated || target === 0) return;
    setHasAnimated(true);
    
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, hasAnimated, duration]);

  return <>{count.toLocaleString()}</>;
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
          apiClient.get("/api/stats/trends?days=60", { cache: "no-store" }),
        ]);
        const cdata = await cres.json();
        const tdata = await tres.json();
        setCounts(cdata);
        setTrends(tdata);
      } catch (error) {
        console.error(error);
        setCounts(null);
        setTrends(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderSeries = React.useMemo(() => trends?.ordersPerDay?.map((d) => d.count) || [], [trends]);
  const orderCategories = React.useMemo(() => trends?.ordersPerDay?.map((d) => d.date) || [], [trends]);

  const { orderTrendPercent, orderTrendUp } = React.useMemo(() => {
    const series = Array.isArray(orderSeries) ? orderSeries : [];
    const last30 = series.slice(-30);
    const prev30 = series.slice(-60, -30);
    const lastSum = last30.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
    const prevSum = prev30.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
    if (prevSum === 0) {
      return { orderTrendPercent: lastSum === 0 ? 0 : 100, orderTrendUp: lastSum >= prevSum };
    }
    const pct = ((lastSum - prevSum) / prevSum) * 100;
    return { orderTrendPercent: Math.round(pct), orderTrendUp: pct >= 0 };
  }, [orderSeries]);

  const orderTrendLabel = React.useMemo(() => {
    const abs = Math.abs(orderTrendPercent);
    return `${orderTrendUp ? "+" : "-"}${abs}%`;
  }, [orderTrendPercent, orderTrendUp]);

  const statsCards = [
    {
      title: "Total Products",
      value: counts?.products?.total ?? 0,
      subtitle: `${counts?.products?.offerActive ?? 0} active offers`,
      icon: FaBox,
      color: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/30",
      trendLabel: null as string | null,
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: counts?.orders?.total ?? 0,
      subtitle: `${counts?.orders?.byStatus?.PENDING ?? 0} pending`,
      icon: FaCartShopping,
      color: "from-emerald-500 to-emerald-600",
      shadowColor: "shadow-emerald-500/30",
      trendLabel: orderTrendLabel,
      trendUp: orderTrendUp,
    },
    {
      title: "Notifications",
      value: counts?.notifications?.total ?? 0,
      subtitle: "Total messages",
      icon: FaBell,
      color: "from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/30",
      trendLabel: null as string | null,
      trendUp: true,
    },
    {
      title: "Offer Items",
      value: counts?.products?.offerActive ?? 0,
      subtitle: "Available for rent",
      icon: FaTag,
      color: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/30",
      trendLabel: null as string | null,
      trendUp: true,
    },
  ];

  const chartOptions = {
    chart: {
      id: "orders-chart",
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    xaxis: {
      categories: orderCategories,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px" },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px" },
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#EF4444"],
    grid: {
      borderColor: "#374151",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark",
      x: { format: "MMM dd" },
    },
    markers: {
      size: 0,
      hover: { size: 6 },
    },
  };

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
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back! Here&apos;s your overview</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400"
            >
              <FaCalendarDay />
              <span className="text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 overflow-hidden">
                {/* Background decoration */}
                <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 blur-2xl`} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg ${stat.shadowColor}`}>
                    <stat.icon className="text-white text-xl" />
                  </div>
                  {stat.trendLabel ? (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        stat.trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {stat.trendUp ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                      {stat.trendLabel}
                    </div>
                  ) : null}
                </div>
                
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? (
                    <div className="h-9 w-20 bg-gray-800 rounded animate-pulse" />
                  ) : (
                    <AnimatedCounter target={stat.value} />
                  )}
                </div>
                <div className="text-sm text-gray-400">{stat.title}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaChartLine className="text-red-500" />
                  Orders Overview
                </h3>
                <p className="text-sm text-gray-400 mt-1">Last 30 days performance</p>
              </div>
              <div className="flex gap-2">
                {["7D", "30D", "90D"].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      period === "30D"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {!loading && orderSeries.length > 0 ? (
              <ReactApexChart
                type="area"
                height={350}
                series={[{ name: "Orders", data: orderSeries }]}
                options={chartOptions}
              />
            ) : (
              <div className="h-[350px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <FaChartLine className="text-gray-600 text-2xl" />
                  </div>
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Order Status</h3>
            
            <div className="space-y-4">
              {[
                { label: "Pending", count: counts?.orders?.byStatus?.PENDING ?? 0, color: "bg-amber-500" },
                { label: "Processing", count: counts?.orders?.byStatus?.PROCESSING ?? 0, color: "bg-blue-500" },
                { label: "Shipped", count: counts?.orders?.byStatus?.SHIPPED ?? 0, color: "bg-purple-500" },
                { label: "Delivered", count: counts?.orders?.byStatus?.DELIVERED ?? 0, color: "bg-emerald-500" },
                { label: "Cancelled", count: counts?.orders?.byStatus?.CANCELLED ?? 0, color: "bg-red-500" },
              ].map((status) => (
                <motion.div
                  key={status.label}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span className="text-gray-300 text-sm">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{status.count}</span>
                    <span className="text-gray-500 group-hover:text-red-400 transition-colors">→</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href="/admin/products/new"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 hover:border-red-500/40 transition-colors"
                >
                  <FaBox className="text-red-400 text-xl" />
                  <span className="text-xs text-gray-300">Add Product</span>
                </motion.a>
                <motion.a
                  href="/admin/orders"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                >
                  <FaCartShopping className="text-blue-400 text-xl" />
                  <span className="text-xs text-gray-300">View Orders</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
