// *********************
// Role of the component: Modern Sidebar for admin dashboard
// Name of the component: DashboardSidebar.tsx
// *********************

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdDashboard } from "react-icons/md";
import { 
  FaGear,
  FaBagShopping,
  FaStore,
  FaImages,
  FaLayerGroup,
  FaUsers,
  FaTags,
  FaRectangleAd,
  FaUserShield,
  FaBox  // Changed from FaBoxes
} from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Navigation items with icons rendered inline
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <MdDashboard className="text-xl" />, group: "Overview" },
    { label: "Images Slider", href: "/admin/images-slider", icon: <FaImages className="text-xl" />, group: "Content" },
    { label: "Pop-up Message", href: "/admin/popups", icon: <FaRectangleAd className="text-xl" />, group: "Content" },
    { label: "Promotions", href: "/admin/banners", icon: <FaRectangleAd className="text-xl" />, group: "Content" },
    { label: "Products", href: "/admin/products", icon: <FaBox className="text-xl" />, group: "Catalog" },
    { label: "Categories", href: "/admin/categories", icon: <FaLayerGroup className="text-xl" />, group: "Catalog" },
    { label: "Brands", href: "/admin/brands", icon: <FaTags className="text-xl" />, group: "Catalog" },
    { label: "Customers", href: "/admin/orders", icon: <FaBagShopping className="text-xl" />, group: "People" },
    { label: "Admins", href: "/admin/users", icon: <FaUserShield className="text-xl" />, group: "People" },
    { label: "Client Logos", href: "/admin/client-logos", icon: <FaUsers className="text-xl" />, group: "People" },
    { label: "Merchant", href: "/admin/merchant", icon: <FaStore className="text-xl" />, group: "People" },
    { label: "Configurations", href: "/admin/settings", icon: <FaGear className="text-xl" />, group: "System" },
  ];

  // Group items
  const groups = ["Overview", "Content", "Catalog", "People", "System"];

  const renderContent = (collapsed: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">ASD Admin</span>
              <span className="text-gray-500 text-xs">Control Panel</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 pb-20 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {groups.map((group) => {
          const groupItems = navItems.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="mb-6">
              {!collapsed && (
                <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group}
                </div>
              )}
              <div className="space-y-1">
                {groupItems.map((item) => {
                  const active = pathname === item.href || 
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link key={item.href} href={item.href} prefetch={true}>
                      <div
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                          ${active 
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                          }
                        `}
                      >
                        {item.icon}
                        {!collapsed && (
                          <span className="font-medium text-sm">{item.label}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm truncate">Admin User</div>
              <div className="text-gray-500 text-xs truncate">admin@asdcamera.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="xl:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-lg"
      >
        {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="xl:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="xl:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 z-50 shadow-2xl"
          >
            {renderContent(false)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden xl:flex flex-col h-screen sticky top-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800/50"
      >
        {renderContent(isCollapsed)}
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-lg"
        >
          <span style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}>
            ‹
          </span>
        </button>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
