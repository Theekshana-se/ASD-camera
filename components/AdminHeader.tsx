"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import apiClient from "@/lib/api";
import { FaBell, FaRightFromBracket, FaGear } from "react-icons/fa6";
import { useProductStore } from "@/app/_zustand/store";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
};

const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const { clearCart } = useProductStore();

  const { data: session } = useSession();

  const userId = (session?.user as any)?.id as string | undefined;
  const userEmail = (session?.user as any)?.email as string | undefined;
  const userRole = (session?.user as any)?.role as string | undefined;

  const avatarLetter = useMemo(() => {
    const base = (userEmail || "A").trim();
    return base ? base[0]?.toUpperCase() : "A";
  }, [userEmail]);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    setLoadingNotifications(true);
    try {
      const res = await apiClient.get(`/api/notifications/${userId}?page=1&limit=5`, { cache: "no-store" });
      if (!res.ok) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data?.notifications) ? data.notifications : [];
      setNotifications(list);
      setUnreadCount(typeof data?.unreadCount === "number" ? data.unreadCount : 0);
    } finally {
      setLoadingNotifications(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!userId) return;
      const target = notifications.find((n) => n.id === notificationId);
      if (!target || target.isRead) return;

      const res = await apiClient.put(`/api/notifications/${notificationId}`, { isRead: true });
      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [notifications, userId]
  );

  const onLogout = useCallback(() => {
    clearCart();
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side - can add breadcrumbs or page title here if needed */}
        <div className="flex-1">
          {/* Placeholder for dynamic content */}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
                if (!showNotifications) {
                  loadNotifications();
                }
              }}
              className="relative p-2.5 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
            >
              <FaBell className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                              !notif.isRead ? "bg-red-500/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm">{notif.title}</p>
                                <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                                <p className="text-gray-600 text-xs mt-1">
                                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link href="/admin/notifications">
                      <div className="p-3 text-center text-sm text-red-400 hover:text-red-300 hover:bg-gray-800/50 transition-colors border-t border-gray-800">
                        View all notifications
                      </div>
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-2 pr-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/30">
                {avatarLetter}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-white font-medium text-sm">{userRole === "admin" ? "Admin" : "User"}</div>
                <div className="text-gray-500 text-xs">{userEmail || ""}</div>
              </div>
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfile(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/30">
                          {avatarLetter}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{userRole === "admin" ? "Admin" : "User"}</div>
                          <div className="text-gray-500 text-xs">{userEmail || ""}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link href="/admin/settings">
                        <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                          <FaGear className="text-sm" />
                          <span className="text-sm font-medium">Settings</span>
                        </div>
                      </Link>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <FaRightFromBracket className="text-sm" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
