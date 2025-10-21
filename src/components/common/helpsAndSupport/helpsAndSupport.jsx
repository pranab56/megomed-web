import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  HelpCircle,
  Send,
  Image as ImageIcon,
  Paperclip,
  X,
  User,
  Bot,
  Loader2,
} from "lucide-react";
import {
  useCreateSupportChatMutation,
  useGetSupportChatQuery,
  useGetSupportChatByIdQuery,
} from "@/features/chat/chatApi";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/getImageUrl";
import { connectSocket, getSocket } from "@/utils/socket";

function HelpsAndSupport({ isOpen, onOpenChange }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "support",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // API hooks
  const [createSupportChat, { isLoading: isSendingMessage }] =
    useCreateSupportChatMutation();

  // First, get the chat ID from the user's support chat list
  const {
    data: supportChatByIdData,
    isLoading: isLoadingChatById,
    error: chatByIdError,
  } = useGetSupportChatByIdQuery();

  // Then, get the actual chat messages using the chat ID
  const {
    data: supportChatData,
    isLoading: isLoadingChat,
    error: chatError,
    refetch: refetchChat,
  } = useGetSupportChatQuery(chatId, { skip: !chatId });

  const handleOpenChange = (open) => {
    onOpenChange(open);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("loginToken");
      if (token) {
        // You might need to decode the JWT token to get user ID
        // For now, we'll use a placeholder - adjust based on your auth system
        return "68e1e75ac082eb0c840ce0b1"; // Replace with actual user ID logic
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
    return null;
  };

  // Combine API messages with real-time messages
  const combinedMessages = useMemo(() => {
    // Get all API messages except the welcome message
    const apiMessages = messages.filter((msg) => msg.id !== 1);

    console.log("🔍 API Messages Debug:", {
      totalMessages: messages.length,
      apiMessagesCount: apiMessages.length,
      realTimeMessagesCount: realTimeMessages.length,
    });

    // Convert real-time messages to the same format
    const realTimeFormatted = realTimeMessages.map((msg) => {
      const currentUserId = getCurrentUserId();

      // Handle both string and object sender formats
      const senderId =
        typeof msg.sender === "string" ? msg.sender : msg.sender?._id;

      console.log("🔄 Processing real-time message:", {
        messageId: msg._id,
        messageText: msg.message,
        sender: msg.sender,
        senderId: senderId,
        currentUserId: currentUserId,
        isUser: senderId === currentUserId,
      });

      return {
        id: msg._id,
        text: msg.message || "",
        sender: senderId === currentUserId ? "user" : "support",
        timestamp: new Date(msg.createdAt),
        type: msg.image ? "image" : "text",
        image: msg.image ? getImageUrl(msg.image) : null,
      };
    });

    // Combine and sort all messages
    const allMessages = [...apiMessages, ...realTimeFormatted];
    const sortedMessages = allMessages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Remove duplicates based on message ID
    const uniqueMessages = sortedMessages.filter(
      (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
    );

    console.log("📊 Combined Messages Debug:", {
      apiMessagesCount: apiMessages.length,
      realTimeMessagesCount: realTimeMessages.length,
      realTimeFormattedCount: realTimeFormatted.length,
      allMessagesCount: allMessages.length,
      uniqueMessagesCount: uniqueMessages.length,
      finalMessagesCount: uniqueMessages.length + 1,
    });

    return [
      {
        id: 1,
        text: "Hello! How can I help you today?",
        sender: "support",
        timestamp: new Date(),
        type: "text",
      },
      ...uniqueMessages,
    ];
  }, [messages, realTimeMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [combinedMessages]);

  // Auto-scroll when real-time messages are added
  useEffect(() => {
    if (realTimeMessages.length > 0) {
      console.log(
        "📜 Help & Support: Auto-scrolling for new real-time message"
      );
      scrollToBottom();
    }
  }, [realTimeMessages]);

  // Socket connection for real-time messages
  useEffect(() => {
    if (!chatId) return;

    console.log("🔌 Help & Support: Setting up socket connection");
    console.log("💬 Chat ID:", chatId);

    // Use existing socket connection instead of creating new one
    let socket = getSocket();
    if (!socket || !socket.connected) {
      console.log(
        "❌ Help & Support: No socket found or not connected, creating new connection"
      );
      const currentUserId =
        localStorage.getItem("user") || localStorage.getItem("userId");
      socket = connectSocket(currentUserId);
    } else {
      console.log("✅ Help & Support: Using existing socket connection");
      console.log("🔌 Socket Connected:", socket.connected);
      console.log("🆔 Socket ID:", socket.id);
    }

    // Listen for new messages in this specific chat
    const handleNewMessage = (messageData) => {
      console.log("📨 Help & Support: New message received:", messageData);

      // Only process messages for this chat
      if (messageData.chatId === chatId) {
        console.log(
          "✅ Help & Support: Message is for this chat, adding to real-time messages"
        );

        setRealTimeMessages((prevMessages) => {
          // Check if message already exists to avoid duplicates
          const exists = prevMessages.some(
            (msg) => msg._id === messageData._id
          );
          if (exists) {
            console.log("⚠️ Help & Support: Message already exists, skipping");
            return prevMessages;
          }

          console.log(
            "➕ Help & Support: Adding new message to real-time messages"
          );
          const newMessage = {
            _id: messageData._id,
            message: messageData.message,
            image: messageData.image,
            sender: messageData.sender,
            createdAt: messageData.createdAt,
            seen: messageData.seen,
            replyTo: messageData.replyTo,
            isPinned: messageData.isPinned,
            reactionUsers: messageData.reactionUsers || [],
          };

          const updatedMessages = [...prevMessages, newMessage];
          console.log("📝 Help & Support: Real-time messages updated:", {
            previousCount: prevMessages.length,
            newCount: updatedMessages.length,
            newMessage: newMessage,
          });

          return updatedMessages;
        });

        // Show toast notification for new message (outside of state setter)
        toast.success("New message received!");

        // Trigger chat refetch after a short delay to get the latest messages
        setTimeout(() => {
          if (chatId) {
            console.log(
              "🔄 Help & Support: Refetching chat after real-time message"
            );
            refetchChat();
          }
        }, 500);
      } else {
        console.log(
          "❌ Help & Support: Message is for different chat, ignoring"
        );
      }
    };

    // Listen for support chat specific events
    const supportChatEvent = `support-message::${chatId}`;
    const generalSupportEvent = "support-message";
    const newSupportMessageEvent = `new-support-message::${chatId}`;
    const generalNewSupportEvent = "new-support-message";

    console.log("👂 Help & Support: Setting up listeners for:");
    console.log("  - Specific chat:", supportChatEvent);
    console.log("  - General support:", generalSupportEvent);
    console.log("  - New support specific:", newSupportMessageEvent);
    console.log("  - New support general:", generalNewSupportEvent);

    // Listen for specific support chat messages
    socket.on(supportChatEvent, handleNewMessage);

    // Listen for general support messages (fallback)
    socket.on(generalSupportEvent, handleNewMessage);

    // Listen for new-support-message events (the actual event being received)
    socket.on(newSupportMessageEvent, handleNewMessage);
    socket.on(generalNewSupportEvent, handleNewMessage);

    // Listen for new-message events (general chat events)
    socket.on("new-message", handleNewMessage);

    // Listen for any support-related events
    socket.onAny((eventName, ...args) => {
      console.log("📡 Help & Support: Received Socket Event:", eventName, args);

      // Check for support-specific events
      if (
        eventName.startsWith("support-message::") &&
        eventName.includes(chatId)
      ) {
        console.log(
          "🎯 Help & Support: Matched support-message:: pattern for this chat:",
          eventName
        );
        handleNewMessage(args[0]);
      }

      // Check for general new-message events for this chat
      if (eventName.startsWith("new-message::") && eventName.includes(chatId)) {
        console.log(
          "🎯 Help & Support: Matched new-message:: pattern for this chat:",
          eventName
        );
        handleNewMessage(args[0]);
      }
    });

    // Test socket connection by emitting a test event
    console.log("🧪 Help & Support: Testing socket connection...");
    socket.emit("test-support-chat", {
      message: "Help & Support test",
      chatId: chatId,
      userId: localStorage.getItem("user"),
    });

    // Cleanup on unmount or chat change
    return () => {
      console.log("🧹 Help & Support: Cleaning up socket listeners");
      socket.off("new-message", handleNewMessage);
      socket.off(supportChatEvent, handleNewMessage);
      socket.off(generalSupportEvent, handleNewMessage);
      socket.off(newSupportMessageEvent, handleNewMessage);
      socket.off(generalNewSupportEvent, handleNewMessage);
    };
  }, [chatId]);

  // Set chatId when we get the support chat data (only if admin is participant)
  useEffect(() => {
    if (supportChatByIdData?.data?._id && !chatId) {
      const chatData = supportChatByIdData.data;
      const hasAdmin = chatData.participants?.some(
        (participant) => participant.role === "admin"
      );

      if (hasAdmin) {
        console.log(
          "📥 Setting chatId from support chat data (admin found):",
          chatData._id
        );
        console.log("📥 Participants:", chatData.participants);
        setChatId(chatData._id);
      } else {
        console.log("📥 No admin found in participants, skipping chat");
      }
    }
  }, [supportChatByIdData, chatId]);

  // Get support user ID (admin from the chat participants)
  const getSupportUserId = () => {
    if (supportChatByIdData?.data?.participants) {
      const adminParticipant = supportChatByIdData.data.participants.find(
        (participant) => participant.role === "admin"
      );
      return adminParticipant?._id;
    }
    return null;
  };

  // Load existing chat messages when chatId is available
  useEffect(() => {
    if (
      supportChatData?.data?.resultAll &&
      Array.isArray(supportChatData.data.resultAll)
    ) {
      const currentUserId = getCurrentUserId();
      const supportUserId = getSupportUserId();
      const formattedMessages = supportChatData.data.resultAll.map(
        (msg, index) => ({
          id: msg._id || `msg-${index}`,
          text: msg.message || "",
          sender: msg.sender === currentUserId ? "user" : "support",
          timestamp: new Date(msg.createdAt),
          type: msg.image ? "image" : "text",
          image: msg.image ? getImageUrl(msg.image) : null,
        })
      );

      console.log("📥 Current User ID:", currentUserId);
      console.log("📥 Support User ID (Admin):", supportUserId);

      console.log("📥 Loading chat messages:", supportChatData.data.resultAll);
      console.log("📥 Formatted messages:", formattedMessages);

      // Sort messages by timestamp (oldest first - 4PM at top, 5PM at bottom)
      const sortedMessages = formattedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      console.log("📥 Sorted messages by time (4PM → 5PM):");
      sortedMessages.forEach((msg, index) => {
        console.log(
          `  ${index + 1}. ${msg.timestamp.toLocaleTimeString()} - ${msg.text}`
        );
      });

      // Replace messages with loaded chat history
      setMessages([
        {
          id: 1,
          text: "Hello! How can I help you today?",
          sender: "support",
          timestamp: new Date(),
          type: "text",
        },
        ...sortedMessages,
      ]);
    }
  }, [supportChatData]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    // Create FormData for API call
    const formData = new FormData();

    // Add message text if provided
    if (newMessage.trim()) {
      formData.append("message", newMessage);
    }

    // Add image if provided
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Add chatId if available (for continuing conversation)
    if (chatId) {
      formData.append("chatId", chatId);
    }

    // Debug: Log FormData contents
    console.log("📤 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    // Additional debugging
    console.log("📤 FormData keys:", Array.from(formData.keys()));
    console.log("📤 FormData values:", Array.from(formData.values()));
    console.log("📤 FormData has message:", formData.has("message"));
    console.log("📤 FormData has image:", formData.has("image"));
    console.log("📤 FormData has chatId:", formData.has("chatId"));

    // Add user message to UI immediately
    const messageData = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      type: selectedImage ? "image" : "text",
      image: selectedImage ? imagePreview : null,
    };

    setMessages((prev) => [...prev, messageData]);

    // Clear form
    setNewMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      // Send to API
      console.log("📤 Sending FormData to API...");
      console.log(
        "📤 FormData size:",
        formData.get("message")?.length || 0,
        "characters"
      );
      console.log("📤 Has image:", !!formData.get("image"));
      console.log("📤 Has chatId:", !!formData.get("chatId"));

      const response = await createSupportChat(formData).unwrap();

      console.log("📤 Support message sent successfully:", response);

      // Handle response
      if (response?.data) {
        // Update chatId if this is a new conversation
        if (response.data.chatId && !chatId) {
          setChatId(response.data.chatId);
        } else if (response.data.chatId && chatId) {
          // For existing conversations, we need to refetch to get the latest messages
          // Add a small delay to ensure the query is ready
          setTimeout(() => {
            if (chatId) {
              refetchChat();
            }
          }, 100);
        }
      }

      // Emit socket event for real-time updates
      const socket = getSocket();
      if (socket && socket.connected) {
        console.log(
          "📡 Help & Support: Emitting support-message event for real-time updates"
        );

        const messageData = {
          _id: response.data._id,
          message: newMessage,
          image: selectedImage ? response.data.image : null,
          sender: getCurrentUserId(), // Send as string ID to match server format
          chatId: chatId,
          createdAt: response.data.createdAt,
          seen: false,
        };

        // Emit support-specific events
        socket.emit("support-message", messageData);
        socket.emit(`support-message::${chatId}`, messageData);
        socket.emit("new-support-message", messageData);
        socket.emit(`new-support-message::${chatId}`, messageData);

        // Also emit general new-message for compatibility
        socket.emit("new-message", messageData);
      }

      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("❌ Failed to send support message:", error);

      // Extract error message from the response
      let errorMessage =
        "Sorry, there was an error sending your message. Please try again.";

      if (error?.data) {
        // Handle different error response formats
        if (error.data.message) {
          errorMessage = error.data.message;
        } else if (
          error.data.errorSources &&
          error.data.errorSources.length > 0
        ) {
          errorMessage = error.data.errorSources[0].message;
        } else if (error.data.err && error.data.err.statusCode) {
          switch (error.data.err.statusCode) {
            case 401:
              errorMessage = "You are not authorized. Please log in again.";
              break;
            case 403:
              errorMessage =
                "Access denied. You don't have permission to perform this action.";
              break;
            case 404:
              errorMessage = "Service not found. Please try again later.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage =
                error.data.message || "An error occurred. Please try again.";
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show error message in chat
      const errorResponse = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: "support",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorResponse]);

      // Show toast with the specific error message
      toast.error(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] flex flex-col"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </SheetTitle>
          <SheetDescription>
            Chat with our support team for assistance.
          </SheetDescription>
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {isLoadingChatById && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-sm text-gray-500">
                Loading chat info...
              </span>
            </div>
          )}

          {isLoadingChat && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-sm text-gray-500">
                Loading messages...
              </span>
            </div>
          )}

          {chatByIdError && (
            <div className="flex justify-center items-center py-4">
              <div className="text-center">
                <span className="text-sm text-red-500">
                  {chatByIdError?.data?.message ||
                    chatByIdError?.data?.errorSources?.[0]?.message ||
                    "Failed to load chat info"}
                </span>
                {chatByIdError?.data?.err?.statusCode === 401 && (
                  <p className="text-xs text-red-400 mt-1">
                    Please log in again to continue <br />
                    or
                    <br />
                    You need to puschase subscription plan to continue
                  </p>
                )}
              </div>
            </div>
          )}

          {chatError && (
            <div className="flex justify-center items-center py-4">
              <div className="text-center">
                <span className="text-sm text-red-500">
                  {chatError?.data?.message ||
                    chatError?.data?.errorSources?.[0]?.message ||
                    "Failed to load chat messages"}
                </span>
                {chatError?.data?.err?.statusCode === 401 && (
                  <p className="text-xs text-red-400 mt-1">
                    Please log in again to continue <br />
                    or
                    <br />
                    You need to puschase subscription plan to continue
                  </p>
                )}
              </div>
            </div>
          )}

          {!isLoadingChatById &&
            !isLoadingChat &&
            !chatByIdError &&
            !chatError &&
            !chatId && (
              <div className="flex justify-center items-center py-4">
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    No support chat found with admin
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Please contact support to start a conversation
                  </p>
                </div>
              </div>
            )}

          {/* Debug: Show real-time messages count */}
          {realTimeMessages.length > 0 && (
            <div className="bg-blue-100 p-2 rounded text-sm text-blue-800 mb-2">
              Debug: {realTimeMessages.length} real-time messages received
            </div>
          )}

          {combinedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.type === "image" && message.image && (
                    <div className="mb-2">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-[200px] max-h-[200px] rounded object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Image selected</p>
                <p className="text-xs text-gray-500">{selectedImage?.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t bg-white">
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 p-0"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={sendMessage}
                disabled={
                  (!newMessage.trim() && !selectedImage) || isSendingMessage
                }
                className="h-10 w-10 p-0"
              >
                {isSendingMessage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default HelpsAndSupport;
