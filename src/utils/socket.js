import { io } from "socket.io-client";
import { baseURL } from "./BaseURL";

let socket = null;

export const connectSocket = (userId = null) => {
  if (socket && socket.connected) {
    return socket;
  }

  const socketConfig = {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: true,
  };

  // Only add auth if userId is provided
  if (userId) {
    socketConfig.auth = { userId };
  }

  socket = io(baseURL, socketConfig);

  socket.on("connect", () => {
    // console.log("🔌 Socket Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {});

  socket.on("connect_error", (error) => {
    console.error("🚨 Socket Connect Error:", error.message);
  });

  socket.on("reconnect", (attemptNumber) => {});

  socket.on("reconnect_attempt", (attemptNumber) => {});

  socket.on("reconnect_error", (error) => {
    console.error("🚨 Socket Reconnect Error:", error.message);
  });

  return socket;
};

export const getSocket = () => socket;
