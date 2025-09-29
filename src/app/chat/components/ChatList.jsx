"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsCheckAll, BsSearch } from "react-icons/bs";
import { useMyChatListQuery } from "../../../features/chat/chatApi";
import { connectSocket, getSocket } from "../../../utils/socket";

const ChatList = ({ setIsChatActive, status }) => {
  const router = useRouter();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionStates, setActionStates] = useState({});
  const [realTimeChats, setRealTimeChats] = useState([]);
  const chatListRef = useRef(null);

  const { data, isLoading, error } = useMyChatListQuery();

  // Socket connection and real-time updates
  useEffect(() => {
    // Get current user ID from localStorage
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    console.log("🚀 Initializing Socket Connection...");
    console.log("👤 Current User ID:", currentUserId);

    if (currentUserId) {
      const socket = connectSocket(currentUserId);
      console.log("🔌 Socket Instance Created:", socket);

      // Listen for new messages
      const handleNewMessage = (messageData) => {
        console.log("📨 NEW MESSAGE RECEIVED:");
        console.log("📋 Message Data:", messageData);
        console.log("💬 Message Text:", messageData.message);
        console.log("👤 Sender:", messageData.sender);
        console.log("🆔 Chat ID:", messageData.chatId);
        console.log("⏰ Created At:", messageData.createdAt);
        console.log("👁️ Seen:", messageData.seen);
        console.log("🖼️ Has Image:", !!messageData.image);

        setRealTimeChats((prevChats) => {
          console.log("📊 Previous Chats Count:", prevChats.length);
          console.log(
            "🔍 Looking for existing chat with ID:",
            messageData.chatId
          );

          const existingChatIndex = prevChats.findIndex(
            (chat) => chat._id === messageData.chatId
          );

          console.log("🔍 Existing Chat Index:", existingChatIndex);

          if (existingChatIndex !== -1) {
            console.log("✅ UPDATING EXISTING CHAT");
            // Update existing chat
            const updatedChats = [...prevChats];
            const currentUnreadCount =
              updatedChats[existingChatIndex].unreadCount || 0;
            const isFromOtherUser = messageData.sender._id !== currentUserId;
            const newUnreadCount = isFromOtherUser
              ? currentUnreadCount + 1
              : currentUnreadCount;

            console.log("📈 Unread Count Update:");
            console.log("  - Current:", currentUnreadCount);
            console.log("  - Is from other user:", isFromOtherUser);
            console.log("  - New count:", newUnreadCount);

            updatedChats[existingChatIndex] = {
              ...updatedChats[existingChatIndex],
              lastMessage: {
                _id: messageData._id,
                text: messageData.message,
                image: messageData.image,
                sender: messageData.sender,
                createdAt: messageData.createdAt,
                seen: messageData.seen,
                replyTo: messageData.replyTo,
                isPinned: messageData.isPinned,
                reactionUsers: messageData.reactionUsers || [],
              },
              unreadCount:
                messageData.sender._id !== currentUserId
                  ? (updatedChats[existingChatIndex].unreadCount || 0) + 1
                  : updatedChats[existingChatIndex].unreadCount,
              updatedAt: messageData.createdAt,
            };
            return updatedChats;
          } else {
            console.log("🆕 CREATING NEW CHAT");
            console.log("👤 New Chat Sender:", messageData.sender);
            console.log("🆔 New Chat ID:", messageData.chatId);

            // Add new chat if it doesn't exist
            return [
              ...prevChats,
              {
                _id: messageData.chatId,
                participants: [
                  { _id: messageData.sender._id, ...messageData.sender },
                ],
                lastMessage: {
                  _id: messageData._id,
                  text: messageData.message,
                  image: messageData.image,
                  sender: messageData.sender,
                  createdAt: messageData.createdAt,
                  seen: messageData.seen,
                  replyTo: messageData.replyTo,
                  isPinned: messageData.isPinned,
                  reactionUsers: messageData.reactionUsers || [],
                },
                unreadCount: messageData.sender._id !== currentUserId ? 1 : 0,
                status: "active",
                isPinned: false,
                createdAt: messageData.createdAt,
                updatedAt: messageData.createdAt,
              },
            ];
          }
        });
      };

      // Listen for new-message events for all chats
      console.log("👂 Setting up 'new-message' event listener");
      socket.on("new-message", handleNewMessage);

      // Also listen for specific chat events (new-message::chatid pattern)
      socket.onAny((eventName, ...args) => {
        console.log("📡 Received Socket Event:", eventName, args);
        if (eventName.startsWith("new-message::")) {
          console.log("🎯 Matched new-message:: pattern:", eventName);
          handleNewMessage(args[0]);
        }
      });

      // Log all available socket events
      console.log(
        "📡 Socket Events Available:",
        Object.keys(socket._callbacks || {})
      );
      console.log("🔌 Socket Connected Status:", socket.connected);
      console.log("🆔 Socket ID:", socket.id);

      // Test socket connection by emitting a test event
      console.log("🧪 Testing socket connection...");
      socket.emit("test-connection", {
        message: "Hello from client",
        userId: currentUserId,
      });

      // Listen for test response
      socket.on("test-response", (data) => {
        console.log("✅ Test response received:", data);
      });

      // Cleanup on unmount
      return () => {
        console.log("🧹 Cleaning up socket listeners");
        socket.off("new-message", handleNewMessage);
      };
    }
  }, []);

  // Extract chats from API response
  const apiChats = useMemo(() => {
    if (!data?.data) return [];

    // Combine pinned and unpinned chats
    const allChats = [
      ...(data.data.pinned || []),
      ...(data.data.unpinned || []),
    ];

    return allChats.map((chatItem) => ({
      _id: chatItem.chat._id,
      participants: chatItem.chat.participants || [],
      lastMessage: chatItem.message._id
        ? {
            _id: chatItem.message._id,
            text: chatItem.message.message || chatItem.message.text,
            image: chatItem.message.image,
            sender: chatItem.message.sender,
            createdAt: chatItem.message.createdAt,
            seen: chatItem.message.seen,
            replyTo: chatItem.message.replyTo,
            isPinned: chatItem.message.isPinned,
            reactionUsers: chatItem.message.reactionUsers || [],
          }
        : null,
      unreadCount: chatItem.unreadMessageCount || 0,
      status: chatItem.chat.status,
      isPinned: chatItem.chat.isPinned,
      createdAt: chatItem.chat.createdAt,
      updatedAt: chatItem.chat.updatedAt,
    }));
  }, [data]);

  const chatsToShow = useMemo(() => {
    console.log("🔄 MERGING CHATS:");
    console.log("📊 API Chats Count:", apiChats.length);
    console.log("⚡ Real-time Chats Count:", realTimeChats.length);

    // Merge API chats with real-time updates
    const mergedChats = [...apiChats];

    // Update with real-time data
    realTimeChats.forEach((realTimeChat) => {
      const existingIndex = mergedChats.findIndex(
        (chat) => chat._id === realTimeChat._id
      );
      if (existingIndex !== -1) {
        console.log("🔄 Updating existing chat:", realTimeChat._id);
        mergedChats[existingIndex] = realTimeChat;
      } else {
        console.log("➕ Adding new real-time chat:", realTimeChat._id);
        mergedChats.push(realTimeChat);
      }
    });

    console.log("📊 Final Merged Chats Count:", mergedChats.length);

    if (!mergedChats.length) return [];

    let filteredChats = mergedChats;

    // Apply search filter
    if (searchTerm) {
      filteredChats = mergedChats.filter((chat) => {
        const participant = chat.participants?.find(
          (p) => p._id !== "currentUser"
        );
        const fullName = participant?.fullName?.toLowerCase() || "";
        const email = participant?.email?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();

        return fullName.includes(searchLower) || email.includes(searchLower);
      });
    }

    // Sort by last message time or chat update time
    return [...filteredChats].sort((a, b) => {
      const timeA = a.lastMessage?.createdAt || a.updatedAt || a.createdAt;
      const timeB = b.lastMessage?.createdAt || b.updatedAt || b.createdAt;
      return new Date(timeB) - new Date(timeA);
    });
  }, [searchTerm, apiChats, realTimeChats]);

  useEffect(() => {
    if (chatListRef.current) {
      const savedPosition = sessionStorage.getItem("chatListScrollPosition");
      if (savedPosition) {
        chatListRef.current.scrollTop = parseInt(savedPosition, 10);
      }
    }
  }, [chatsToShow]);

  const handleScroll = useCallback(() => {
    if (chatListRef.current) {
      sessionStorage.setItem(
        "chatListScrollPosition",
        chatListRef.current.scrollTop
      );
    }
  }, []);

  const handleSelectChat = async (chat) => {
    if (actionStates[chat._id]?.loading) return;
    setActionStates((prev) => ({
      ...prev,
      [chat._id]: { loading: true, action: "select" },
    }));

    try {
      router.push(`/chat/${chat.participants[0]._id}/${chat._id}`);
      if (setIsChatActive) setIsChatActive(true);

      // Mark messages as read in real-time state
      setRealTimeChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex((c) => c._id === chat._id);
        if (chatIndex !== -1) {
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            unreadCount: 0,
            lastMessage: updatedChats[chatIndex].lastMessage
              ? {
                  ...updatedChats[chatIndex].lastMessage,
                  seen: true,
                }
              : null,
          };
        }
        return updatedChats;
      });

      // Emit socket event to notify other components about chat selection
      const socket = getSocket();
      if (socket && socket.connected) {
        const currentUserId =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;
        console.log("📡 ChatList: Emitting chat-selected event");
        socket.emit("chat-selected", {
          chatId: chat._id,
          userId: currentUserId,
        });
      }

      // You might want to call an API to mark messages as read here
      // Example: await markMessagesAsRead(chat._id);
    } catch (error) {
      console.error("Error selecting chat:", error);
    } finally {
      setActionStates((prev) => ({
        ...prev,
        [chat._id]: { loading: false, action: "" },
      }));
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      return moment(timestamp).fromNow();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Just now";
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const testSocketConnection = () => {
    const socket = getSocket();
    if (socket) {
      console.log("🧪 Manual Socket Test:");
      console.log("🔌 Socket Connected:", socket.connected);
      console.log("🆔 Socket ID:", socket.id);
      console.log("📡 Socket URL:", socket.io.uri);

      // Emit test event
      socket.emit("test-connection", {
        message: "Manual test from client",
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log("❌ No socket instance found");
    }
  };

  const getParticipantInfo = (chat) => {
    // Get the first participant (assuming it's the other user)
    const participant = chat.participants?.[0];
    return (
      participant || { fullName: "Unknown User", email: "", profile: null }
    );
  };

  const getAvatarFallback = (name) => {
    if (!name) return "U";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const renderLoadingState = () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="rounded-full bg-muted h-12 w-12 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-32 text-muted-foreground p-4"
    >
      <p className="text-sm text-center">
        {searchTerm ? "No matching chats found" : "No chats yet"}
      </p>
      <p className="text-xs mt-1 text-center">
        {searchTerm
          ? "Try a different search term"
          : "Start a conversation to see chats here"}
      </p>
    </motion.div>
  );

  return (
    <div className="w-full h-[80vh] rounded-lg flex flex-col shadow-lg border bg-background">
      <div className="p-4">
        <div className="relative">
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search chats..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {/* <button
          onClick={testSocketConnection}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Socket
        </button> */}
      </div>

      <div
        ref={chatListRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {isLoading ? (
          renderLoadingState()
        ) : error ? (
          <div className="flex items-center justify-center h-32 text-destructive p-4">
            <p className="text-sm text-center">
              Error loading chats. Please try again.
            </p>
          </div>
        ) : chatsToShow?.length > 0 ? (
          <AnimatePresence>
            {chatsToShow.map((chat) => {
              const isActionLoading = actionStates[chat._id]?.loading;
              const participant = getParticipantInfo(chat);
              const isRead = chat.lastMessage?.seen || chat.unreadCount === 0;
              const isActiveChat = chat._id === id;
              const hasMessage = chat.lastMessage && chat.lastMessage._id;

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    onClick={() => !isActionLoading && handleSelectChat(chat)}
                    className={`flex items-center gap-3 p-4 border-b cursor-pointer transition-colors ${
                      isActiveChat ? "bg-muted" : "hover:bg-muted/50"
                    } ${
                      isActionLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={participant?.profile} />
                        <AvatarFallback>
                          {getAvatarFallback(participant?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      {participant?.role && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full px-1 text-xs">
                          {participant.role.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3
                          className={`font-medium truncate text-sm ${
                            isRead ? "" : "font-semibold"
                          }`}
                        >
                          {participant?.fullName || "Unknown User"}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground truncate">
                            {hasMessage
                              ? formatTime(chat.lastMessage.createdAt)
                              : formatTime(chat.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm truncate text-muted-foreground ${
                            isRead ? "" : "font-medium text-foreground"
                          }`}
                        >
                          {hasMessage
                            ? chat.lastMessage.image
                              ? "📷 Image"
                              : chat.lastMessage.text?.slice(0, 30) +
                                (chat.lastMessage.text?.length > 30
                                  ? "..."
                                  : "")
                            : "No messages yet"}
                        </p>
                        {isRead && hasMessage && chat.lastMessage.sender && (
                          <BsCheckAll className="text-muted-foreground h-3 w-3" />
                        )}
                      </div>

                      {participant?.email && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {participant.email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {chat.unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs min-w-[20px] text-center"
                        >
                          {chat.unreadCount}
                        </motion.span>
                      )}
                      {chat.isPinned && (
                        <div className="text-muted-foreground">📌</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default ChatList;
