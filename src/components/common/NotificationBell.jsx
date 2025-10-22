"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoNotificationsOutline } from "react-icons/io5";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { connectSocket } from "@/utils/socket";
import toast from "react-hot-toast";

function NotificationBell({ className = "" }) {
  // console.log("🚀 NotificationBell component mounted");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user ID from Redux or localStorage
  const currentUser = useSelector((state) => state.currentUser?.currentUser);

  // Try to get userId from different possible sources with better error handling
  let currentUserId;
  try {
    // First try Redux state
    if (currentUser && currentUser._id) {
      currentUserId = currentUser._id;
      // console.log("✅ Got userId from Redux:", currentUserId);
    }
    // Then try localStorage
    else if (typeof window !== "undefined" && localStorage) {
      const storedUser = localStorage.getItem("user");
      // console.log("📂 Raw localStorage user value:", storedUser);

      // Try to parse if it's JSON
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          currentUserId = parsedUser._id || parsedUser;
          // console.log(
          //   "✅ Got userId from localStorage (parsed):",
          //   currentUserId
          // );
        } catch (e) {
          // Not JSON, use as is
          currentUserId = storedUser;
          // console.log("✅ Got userId from localStorage (raw):", currentUserId);
        }
      }
    }
  } catch (err) {
    // console.error("❌ Error getting user ID:", err);
  }

  // Fallback to hardcoded ID for testing if we couldn't get one
  if (!currentUserId) {
    currentUserId = "68edd15fecd0337731822725";
    // console.log("⚠️ Using fallback userId:", currentUserId);
  }

  // Ensure we have string format for comparison
  const userIdString =
    typeof currentUserId === "object"
      ? currentUserId.toString()
      : currentUserId;

  // console.log("🔑 Final userIdString:", userIdString);
  // Fetch existing notifications when component mounts
  useEffect(() => {
    if (!userIdString) {
      // console.log("⚠️ No user ID found, skipping notifications fetch");
      setIsLoading(false);
      return;
    }

    // For now, just initialize with empty notifications
    setNotifications([]);
    setUnreadCount(0);
    setIsLoading(false);
  }, [userIdString]);

  // Socket connection and notification handling
  useEffect(() => {
    // Connect to socket with userId for notifications
    //  console.log("🔌 Connecting to socket for notifications...");

    // Make sure userIdString is defined
    if (!userIdString) {
      // console.error("❌ Cannot connect to socket - no userId available");
      return;
    }

    // Create a new socket connection with error handling
    let socket;
    try {
      socket = connectSocket(userIdString);
      // console.log(
      //   "🔌 Socket connection attempt made with userId:",
      //   userIdString
      // );
    } catch (err) {
      // console.error("❌ Error connecting to socket:", err);
      return;
    }

    // Listen for all notification events with more debugging
    // console.log("🎧 Setting up notification listeners for user:", userIdString);

    // Channel-specific notification for this user
    const userChannel = `notification::${userIdString}`;
    // console.log("📡 Setting up listener for user channel:", userChannel);

    socket.on(userChannel, (data) => {
      // console.log("🔔 User-specific notification received:", data);
      handleNotifications(data);
    });

    // General notification event
    socket.on("notification", (data) => {
      // console.log("🔔 General notification received:", data);
      handleNotifications(data);
    });

    // Helper function to process notifications
    function handleNotifications(data) {
      // console.log("🔄 Processing notification data:", data);

      // Handle both array and single notification formats
      const notificationsArray = Array.isArray(data) ? data : [data];
      // console.log("📦 Processing notifications array:", notificationsArray);

      // If we received any notifications at all, make sure badge updates
      if (notificationsArray && notificationsArray.length > 0) {
        // Count unread notifications in the array
        const newUnreadCount = notificationsArray.filter(
          (n) => !n.isRead
        ).length;
        //  console.log(
        //   "📊 New unread notifications in this batch:",
        //   newUnreadCount
        // );

        if (newUnreadCount > 0) {
          // Update badge count immediately
          setUnreadCount((prev) => {
            const newCount = prev + newUnreadCount;
            // console.log("🔔 Updating badge count from", prev, "to", newCount);
            return newCount;
          });
        }
      }

      // Add ALL notifications to the state at once
      const validNotifications = notificationsArray.filter((notification) => {
        if (!notification) {
          // console.log("⚠️ Empty notification object, skipping");
          return false;
        }

        // console.log("🔄 Processing notification:", notification);

        // Check user ID if available
        if (notification.userId) {
          // console.log("🔄 Notification userId:", notification.userId);
          // console.log("🔄 Current userId (string):", userIdString);

          // Convert notification userId to string for comparison
          const notificationUserId =
            typeof notification.userId === "object"
              ? notification.userId.toString()
              : notification.userId;

          // Only include notifications for the current user
          if (
            userIdString &&
            notificationUserId &&
            notificationUserId !== userIdString
          ) {
            // console.log("⏭️ Notification not for current user, skipping");
            return false;
          }
        }

        return true;
      });

      // If we have valid notifications, add them all to state
      if (validNotifications.length > 0) {
        // console.log("✅ Adding notifications to state:", validNotifications);
        setNotifications((prev) => [...validNotifications, ...prev]);

        // Show toast notifications for each valid notification
        validNotifications.forEach((notification) => {
          // Show toast notification
          if (notification.type === "success") {
            toast.success(notification.message);
          } else if (notification.type === "error") {
            toast.error(notification.message);
          } else if (notification.type === "info") {
            toast(notification.message);
          } else {
            toast(notification.message);
          }
        });
      }
    }

    socket.on("connect_error", (error) => {
      // console.error("🚨 Socket connection error:", error.message);
    });

    // Also listen for any other relevant events
    socket.on("reconnect", () => {
      // console.log("🔄 Socket reconnected");
    });

    // Cleanup on unmount
    return () => {
      // console.log("🧹 Cleaning up socket listeners");
      socket.off("notification");
      socket.off(`notification::${userIdString}`);
    };
  }, [userIdString]);

  // Notification helper functions
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Badge count is working, debug mode disabled
  const shouldShowBadge = false; // Debug mode disabled
  const badgeCount = unreadCount || (shouldShowBadge ? 1 : 0);

  // console.log("🏷️ Current badge count:", unreadCount);
  // console.log("🏷️ Badge will be shown:", badgeCount > 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`relative w-12 h-12 rounded-full p-2 shadow-lg border flex items-center justify-center hover:bg-gray-50 transition-colors ${className}`}
        >
          <IoNotificationsOutline className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors" />
          {badgeCount > 0 && (
            <Badge
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute -top-1 -right-1"
              variant={
                shouldShowBadge && unreadCount === 0
                  ? "secondary"
                  : "destructive"
              }
            >
              {badgeCount > 9 ? "9+" : badgeCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Notifications</h4>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <div
                  key={notification._id || index}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    !notification.isRead &&
                    markAsRead(notification._id || index)
                  }
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
