import React, { useState, useRef, useEffect } from "react";
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
import { useCreateSupportChatMutation } from "@/features/chat/chatApi";
import toast from "react-hot-toast";

function HelpsAndSupport({ isOpen, onOpenChange }) {
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
  const [chatId, setChatId] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // API mutation hook
  const [createSupportChat, { isLoading: isSendingMessage }] =
    useCreateSupportChatMutation();

  const handleOpenChange = (open) => {
    onOpenChange(open);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        }

        // Add support response if provided
        if (response.data.message) {
          const supportResponse = {
            id: Date.now() + 1,
            text: response.data.message,
            sender: "support",
            timestamp: new Date(),
            type: "text",
          };
          setMessages((prev) => [...prev, supportResponse]);
        }
      }

      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("❌ Failed to send support message:", error);

      // Show error message
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, there was an error sending your message. Please try again.",
        sender: "support",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorResponse]);

      toast.error(
        error?.data?.message || "Failed to send message. Please try again."
      );
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
          {messages.map((message) => (
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
