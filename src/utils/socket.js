import { io } from "socket.io-client";
import { baseURL } from "./BaseURL";

let socket = null;

export const connectSocket = (userId) => {
  console.log("🔌 Connecting to socket...");
  console.log("🌐 Base URL:", baseURL);
  console.log("👤 User ID:", userId);

  if (socket && socket.connected) {
    console.log("♻️ Reusing existing socket connection");
    return socket;
  }

  console.log("🆕 Creating new socket connection");
  socket = io(baseURL, {
    auth: { userId },
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("🔌 Socket Connected:", socket.id);
    console.log("📡 Socket URL:", baseURL);
    console.log("👤 User ID:", userId);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("🚨 Socket Connect Error:", error.message);
    console.error("🔗 Socket URL:", baseURL);
    console.error("👤 User ID:", userId);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("🔄 Socket Reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log("🔄 Socket Reconnect Attempt:", attemptNumber);
  });

  socket.on("reconnect_error", (error) => {
    console.error("🚨 Socket Reconnect Error:", error.message);
  });

  return socket;
};

export const getSocket = () => socket;
