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
import { getImageUrl } from "../../../utils/getImageUrl";

const ChatList = ({ setIsChatActive, status }) => {
  const router = useRouter();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionStates, setActionStates] = useState({});
  const [realTimeChats, setRealTimeChats] = useState([]);
  const chatListRef = useRef(null);

  const { data, isLoading, error } = useMyChatListQuery();

  console.log("chatlist data //////////////////////////", data);

  // Socket connection and real-time updates
  useEffect(() => {
    // Get current user ID from localStorage
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (currentUserId) {
      const socket = connectSocket(currentUserId);

      // Listen for new messages
      const handleNewMessage = (messageData) => {
        console.log("📨 ChatList: Received message:", messageData);
        console.log("👤 Current User ID:", currentUserId);
        console.log("💬 Chat ID:", messageData.chatId);
        console.log("👤 Sender:", messageData.sender);

        // First, check if this message is for a chat where current user is a participant
        // We need to verify this user should receive this message
        const isParticipantInChat = () => {
          // Check if this chat exists in our API data (meaning user is a participant)
          const existingApiChat = apiChats.find(
            (apiChat) => apiChat._id === messageData.chatId
          );
          if (existingApiChat) {
            console.log(
              "✅ User is participant in this chat (found in API data)"
            );
            return true;
          }

          // Check if this is a new chat and current user is the sender or receiver
          const senderId =
            typeof messageData.sender === "object"
              ? messageData.sender._id
              : messageData.sender;
          if (senderId === currentUserId) {
            console.log("✅ User is sender of this message");
            return true;
          }

          // For now, we'll be more restrictive and only allow messages from existing chats
          console.log(
            "❌ User is not a participant in this chat, ignoring message"
          );
          return false;
        };

        // Only process the message if user is a participant
        if (!isParticipantInChat()) {
          console.log("🚫 Ignoring message - user not participant in chat");
          return;
        }

        setRealTimeChats((prevChats) => {
          const existingChatIndex = prevChats.findIndex(
            (chat) => chat._id === messageData.chatId
          );

          if (existingChatIndex !== -1) {
            // Update existing chat
            const updatedChats = [...prevChats];
            const currentUnreadCount =
              updatedChats[existingChatIndex].unreadCount || 0;

            // Handle sender data - it might be an object or just an ID string
            let senderId = messageData.sender;
            if (
              typeof messageData.sender === "object" &&
              messageData.sender._id
            ) {
              senderId = messageData.sender._id;
            }

            const isFromOtherUser = senderId !== currentUserId;
            const newUnreadCount = isFromOtherUser
              ? currentUnreadCount + 1
              : currentUnreadCount;

            // Preserve existing participant data and only update message-related fields
            updatedChats[existingChatIndex] = {
              ...updatedChats[existingChatIndex],
              lastMessage: {
                _id: messageData._id,
                text: messageData.message,
                image: messageData.image,
                sender:
                  typeof messageData.sender === "object"
                    ? messageData.sender
                    : { _id: messageData.sender },
                createdAt: messageData.createdAt,
                seen: messageData.seen,
                replyTo: messageData.replyTo,
                isPinned: messageData.isPinned,
                reactionUsers: messageData.reactionUsers || [],
              },
              unreadCount: isFromOtherUser
                ? (updatedChats[existingChatIndex].unreadCount || 0) + 1
                : updatedChats[existingChatIndex].unreadCount,
              updatedAt: messageData.createdAt,
              // Keep existing participant data intact
              participants: updatedChats[existingChatIndex].participants,
            };
            return updatedChats;
          } else {
            // Handle sender data - it might be an object or just an ID string
            let senderData = messageData.sender;
            if (typeof senderData === "string") {
              // If sender is just an ID, we need to get the full sender data
              // For now, create a basic sender object with the ID
              senderData = { _id: senderData };
            }

            // Try to find participant data from API data
            let participantData = [{ _id: senderData._id, ...senderData }];

            // Look for this chat in the original API data to get complete participant info
            const originalApiChat = apiChats.find(
              (apiChat) => apiChat._id === messageData.chatId
            );
            if (originalApiChat && originalApiChat.participants?.[0]) {
              participantData = originalApiChat.participants;
              console.log(
                "✅ Found participant data from API:",
                participantData
              );
            } else {
              console.log(
                "⚠️ No API participant data found, using sender data:",
                participantData
              );
            }

            // Add new chat if it doesn't exist
            return [
              ...prevChats,
              {
                _id: messageData.chatId,
                participants: participantData,
                lastMessage: {
                  _id: messageData._id,
                  text: messageData.message,
                  image: messageData.image,
                  sender: senderData,
                  createdAt: messageData.createdAt,
                  seen: messageData.seen,
                  replyTo: messageData.replyTo,
                  isPinned: messageData.isPinned,
                  reactionUsers: messageData.reactionUsers || [],
                },
                unreadCount: senderData._id !== currentUserId ? 1 : 0,
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

      socket.on("new-message", handleNewMessage);

      // Also listen for specific chat events (new-message::chatid pattern)
      socket.onAny((eventName, ...args) => {
        if (eventName.startsWith("new-message::")) {
          handleNewMessage(args[0]);
        }
      });

      // Log all available socket events

      // Test socket connection by emitting a test event

      socket.emit("test-connection", {
        message: "Hello from client",
        userId: currentUserId,
      });

      // Listen for test response
      socket.on("test-response", (data) => {});

      // Cleanup on unmount
      return () => {
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
    // Merge API chats with real-time updates
    const mergedChats = [...apiChats];

    // Update with real-time data
    realTimeChats.forEach((realTimeChat) => {
      const existingIndex = mergedChats.findIndex(
        (chat) => chat._id === realTimeChat._id
      );
      if (existingIndex !== -1) {
        // Merge real-time data with existing API data to preserve participant info
        mergedChats[existingIndex] = {
          ...mergedChats[existingIndex], // Keep API participant data
          lastMessage: realTimeChat.lastMessage,
          unreadCount: realTimeChat.unreadCount,
          updatedAt: realTimeChat.updatedAt,
        };
      } else {
        mergedChats.push(realTimeChat);
      }
    });

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

        socket.emit("chat-selected", {
          chatId: chat._id,
          userId: currentUserId,
        });
      }

      // You might want to call an API to mark messages as read here
      // Example: await markMessagesAsRead(chat._id);
    } catch (error) {
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
      return "Just now";
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const testSocketConnection = () => {
    const socket = getSocket();
    if (socket) {
      // Emit test event
      socket.emit("test-connection", {
        message: "Manual test from client",
        timestamp: new Date().toISOString(),
      });
    } else {
    }
  };

  const getParticipantInfo = (chat) => {
    // Get the first participant (assuming it's the other user)
    const participant = chat.participants?.[0];

    // If participant exists but has incomplete data, try to get it from the last message sender
    if (
      participant &&
      (!participant.fullName || participant.fullName === "Unknown User")
    ) {
      const lastMessageSender = chat.lastMessage?.sender;
      if (lastMessageSender && typeof lastMessageSender === "object") {
        return {
          ...participant,
          fullName:
            lastMessageSender.fullName ||
            participant.fullName ||
            "Unknown User",
          email: lastMessageSender.email || participant.email || "",
          profile: lastMessageSender.profile || participant.profile || null,
          role: lastMessageSender.role || participant.role || "",
        };
      }
    }

    // If we still don't have good data, try to find it from the original API data
    if (
      !participant ||
      !participant.fullName ||
      participant.fullName === "Unknown User"
    ) {
      // Look for this chat in the original API data
      const originalChat = apiChats.find((apiChat) => apiChat._id === chat._id);
      if (originalChat && originalChat.participants?.[0]) {
        return originalChat.participants[0];
      }
    }

    return (
      participant || {
        fullName: "Unknown User",
        email: "",
        profile: null,
        role: "",
      }
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
                        <AvatarImage src={getImageUrl(participant?.profile)} />
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
