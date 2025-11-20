// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdCategory } from "react-icons/md";
import { 
  FaTable,
  FaRegUser,
  FaGear,
  FaBagShopping,
  FaStore,
  FaImages,
  FaLayerGroup,
  FaUsers,
  FaTags,
  FaRectangleAd,
  FaUserShield
} from "react-icons/fa6";

const DashboardSidebar = () => {
  const pathname = usePathname();

  const nav = [
    { label: "Dashboard", href: "/admin", icon: <MdDashboard className="text-2xl" /> },
    { label: "Images Slider", href: "/admin/images-slider", icon: <FaImages className="text-2xl" /> },
    { label: "Pop-up Message", href: "/admin/popups", icon: <FaRectangleAd className="text-2xl" /> },
    { label: "Configurations", href: "/admin/settings", icon: <FaGear className="text-2xl" /> },
    { label: "Products", href: "/admin/products", icon: <FaTable className="text-2xl" /> },
    { label: "Categories", href: "/admin/categories", icon: <FaLayerGroup className="text-2xl" /> },
    { label: "Client Logos", href: "/admin/client-logos", icon: <FaUsers className="text-2xl" /> },
    { label: "Brands", href: "/admin/brands", icon: <FaTags className="text-2xl" /> },
    { label: "Banners", href: "/admin/banners", icon: <FaRectangleAd className="text-2xl" /> },
    { label: "Customers", href: "/admin/orders", icon: <FaBagShopping className="text-2xl" /> },
    { label: "Admins", href: "/admin/users", icon: <FaUserShield className="text-2xl" /> },
    { label: "Merchant", href: "/admin/merchant", icon: <FaStore className="text-2xl" /> },
  ];

  return (
    <aside className="xl:w-[280px] h-full max-xl:w-full bg-white border-r border-gray-200">
      <nav className="flex flex-col">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const base = "flex items-center gap-3 px-5 py-3 text-lg transition-all";
          const activeCls = "bg-red-600 text-white rounded-xl";
          const inactiveCls = "text-black hover:bg-gray-100";
          return (
            <Link key={item.href} href={item.href} className={`${base} ${active ? activeCls : inactiveCls}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
