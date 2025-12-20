// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

const SearchInput = dynamic(() => import("./SearchInput"), { ssr: false, loading: () => <div className="h-10 bg-gray-100 rounded w-full" /> });
const CartElement = dynamic(() => import("./CartElement"), { ssr: false, loading: () => <div className="w-8 h-8 rounded bg-gray-100" /> });
const NotificationBell = dynamic(() => import("./NotificationBell"), { ssr: false, loading: () => <div className="w-8 h-8 rounded bg-gray-100" /> });
const HeartElement = dynamic(() => import("./HeartElement"), { ssr: false, loading: () => <div className="w-8 h-8 rounded bg-gray-100" /> });
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { categoryMenuList } from "@/lib/utils";
import { FaBars } from "react-icons/fa6";
const CategoryMegaMenu = dynamic(() => import("./CategoryMegaMenu"), { ssr: false, loading: () => <div className="h-12 border-t border-gray-200 bg-white" /> });

type Settings = {
  logoUrl?: string;
};

const Header = ({
  settings,
}: {
  settings?: { logoUrl?: string; contactPhone?: string; contactEmail?: string; noticeBarText?: string; noticeBarEnabled?: boolean };
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { setWishlist, wishQuantity } = useWishlistStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastY, setLastY] = useState(0);

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string;
      stockAvailabillity: number;
    }[] = [];

    return; // temporary disable wishlist fetching
    
    wishlist.map((item: any) =>
      productArray.push({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      })
    );

    setWishlist(productArray);
  };

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/register");
    router.prefetch("/admin");
  }, [router]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const goingDown = y > lastY;
      const threshold = 50;
      setHideHeader(goingDown && y > threshold);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Our Clients", href: "/clients" },
    { name: "Promotions", href: "/promotions" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className={`bg-white/90 backdrop-blur sticky top-0 z-50 transition-transform duration-200 ${hideHeader ? "-translate-y-full" : "translate-y-0"}`}>
      <HeaderTop
        noticeBarEnabled={settings?.noticeBarEnabled}
        noticeBarText={settings?.noticeBarText}
      />

      {/* Normal website header */}
      {pathname.startsWith("/admin") === false && (
        <div className="bg-transparent px-16 max-[1320px]:px-16 max-md:px-6 max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between py-3 gap-x-6">
            <Link href="/" prefetch className="flex items-center gap-x-3">
              <Image
                src={settings?.logoUrl || "/logo.png"}
                width={500}
                height={500}
                alt="ASD Camera Rent logo"
                className="h-14 w-auto object-contain"
                priority
                sizes="(max-width: 1023px) 224px, 300px"
              />
              <Image
                src="/Flag_of_Sri_Lanka.gif"
                alt="Sri Lankan flag"
                width={48}
                height={48}
                unoptimized
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div className="hidden lg:flex flex-1 items-center justify-end text-black/80">
              <div className="flex items-center gap-x-3 font-semibold">
                <span className="flex items-center rounded-full bg-red-50 px-3 py-1 text-red-700 ring-1 ring-red-200 transition hover:scale-[1.02]">24/7 Hotline</span>
                <span>{settings?.contactPhone || "+94 11 7253 111"}</span>
              </div>
            </div>

            <button
              className="lg:hidden p-2 rounded-full bg-red-600 text-white shadow"
              aria-label="Open menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <FaBars className="w-6 h-6" />
            </button>

            <div className="flex gap-x-6 items-center">
              <NotificationBell />
              <HeartElement wishQuantity={wishQuantity} />
              <CartElement />
              {!session && (
                <div className="hidden md:flex items-center gap-x-3">
                  <Link href="/login" prefetch className="text-sm font-semibold hover:text-red-600 transition">Login</Link>
                  <Link href="/register" prefetch className="text-sm font-semibold hover:text-red-600 transition">Register</Link>
                </div>
              )}
              {session && (
                <div className="hidden md:flex items-center gap-x-3">
                  <button onClick={handleLogout} className="text-sm font-semibold hover:text-red-600 transition">Logout</button>
                </div>
              )}
              {(session?.user as any)?.role === "admin" && (
                <Link
                  href="/admin"
                  prefetch
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-200 py-2">
              <div className="flex flex-wrap gap-2 justify-center px-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 rounded-full text-base font-semibold transition-all ${
                      pathname === l.href
                        ? "bg-red-600 text-white shadow"
                        : "bg-white text-black hover:text-red-600"
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="py-3">
            <div className="flex items-center gap-6">
              <nav className="hidden lg:flex items-center gap-x-3 flex-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    prefetch
                    className={`px-4 py-2 rounded-full text-base font-semibold transition-all ${
                      pathname === l.href
                        ? "bg-red-600 text-white shadow"
                        : "bg-white text-black hover:text-red-600 ring-1 ring-black/10"
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
              </nav>
              <div className="w-full lg:w-[480px] ml-auto">
                <SearchInput />
              </div>
            </div>
          </div>
        </div>
      )}

      {pathname.startsWith("/admin") === false && (
        <div>
          <CategoryMegaMenu />
        </div>
      )}

      {/* Admin dashboard header */}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-transparent items-center px-16 max-[1320px]:px-10 max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/" className="flex items-center gap-x-2">
            <Image
              src={settings?.logoUrl || "/logo.png"}
              width={130}
              height={130}
              alt="ASD Camera Rent logo"
              className="h-12 w-auto object-contain"
              priority
            />
            <Image
              src="/Flag_of_Sri_Lanka.gif"
              alt="Sri Lankan flag"
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10 object-contain"
            />
          </Link>

          <div className="flex gap-x-5 items-center">
            <NotificationBell />

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                />
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                  <a>Profile</a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
