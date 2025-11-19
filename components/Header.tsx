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
import SearchInput from "./SearchInput";
import Link from "next/link";

import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { categoryMenuList } from "@/lib/utils";
import { FaBars } from "react-icons/fa6";

type Settings = {
  logoUrl?: string;
};

const Header = ({
  settings,
}: {
  settings?: { logoUrl?: string; contactPhone?: string; contactEmail?: string };
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { setWishlist, wishQuantity } = useWishlistStore();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    [
      "/",
      "/about",
      "/blog",
      "/clients",
      "/promotions",
      "/contact",
      "/search",
      "/wishlist",
      "/cart",
      "/checkout",
    ].forEach((p) => router.prefetch(p));
    // Prefetch category routes
    categoryMenuList.forEach((c) => router.prefetch(c.href));
  }, [router]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Our Clients", href: "/clients" },
    { name: "Promotions", href: "/promotions" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50">
      <HeaderTop
        phone={settings?.contactPhone}
        email={settings?.contactEmail}
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
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-x-8 fade-down">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className={`group relative px-4 py-2 rounded-full text-lg md:text-xl font-semibold transition-all ${
                    pathname === l.href
                      ? "bg-red-600 text-white shadow"
                      : "text-black hover:text-red-600"
                  } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full`}
                >
                  {l.name}
                </Link>
              ))}
            </nav>

            <button
              className="lg:hidden p-2 rounded-full bg-red-600 text-white shadow"
              aria-label="Open menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <FaBars className="w-6 h-6" />
            </button>

            <div className="flex gap-x-8 items-center">
              <NotificationBell />
              <HeartElement wishQuantity={wishQuantity} />
              <CartElement />
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
          <div className="py-3 flex justify-center">
            <div className="w-full max-w-3xl">
              <SearchInput />
            </div>
          </div>
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
              className="h-10 w-auto object-contain"
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
