"use client";
import React from "react";
import { DashboardSidebar } from "@/components";
import NotificationCard from "@/components/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";

const AdminNotificationsPage = () => {
  const {
    notifications,
    loading,
    error,
    selectedIds,
    markSelectedAsRead,
    deleteSelectedNotifications,
    markNotificationAsRead,
    deleteNotificationById,
  } = useNotifications();

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-3xl font-bold">Admin Notifications</h1>
        {loading && <div className="loading loading-spinner" />}
        {error && <div className="alert alert-error">{String(error)}</div>}
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <button className="btn btn-sm" onClick={markSelectedAsRead}>Mark as read</button>
            <button className="btn btn-sm btn-error" onClick={deleteSelectedNotifications}>Delete</button>
          </div>
        )}
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n as any}
              isSelected={selectedIds.includes(n.id)}
              onToggleSelect={() => {}}
              onMarkAsRead={() => markNotificationAsRead(n.id)}
              onDelete={() => deleteNotificationById(n.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;