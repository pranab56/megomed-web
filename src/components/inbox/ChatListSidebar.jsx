"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Demo data
const demoChats = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/images/avatar1.jpg",
    isOnline: true,
    lastMessage: "I'll send the files tomorrow",
    timestamp: "2:30 PM",
    unreadCount: 2,
    hasNewMessage: true,
    projectInfo: {
      title: "Website Redesign",
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },
  {
    id: "2",
    name: "Sarah Smith",
    avatar: "/images/avatar2.jpg",
    isOnline: false,
    lastMessage: "Thanks for the feedback!",
    timestamp: "Yesterday",
    unreadCount: 0,
    hasNewMessage: false,
    projectInfo: {
      title: "Mobile App Development",
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "/images/avatar3.jpg",
    isOnline: true,
    lastMessage: "Can we schedule a call?",
    timestamp: "10:15 AM",
    unreadCount: 1,
    hasNewMessage: true,
    projectInfo: {
      title: "Logo Design",
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },
  {
    id: "4",
    name: "Emily Wilson",
    avatar: "/images/avatar4.jpg",
    isOnline: true,
    lastMessage: "The design looks perfect!",
    timestamp: "9:45 AM",
    unreadCount: 0,
    hasNewMessage: false,
    projectInfo: {
      title: "Brand Identity",
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }
];

function ChatListSidebar() {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChatList(demoChats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChatSelect = (chatId) => {
    const chat = chatList.find(chat => chat.id === chatId);
    setSelectedChat(chat);

    // Notify parent component (ChatInterface) about selected chat
    if (window.React && window.React.setState) {
      // This would be handled differently in a real app - using context or props
      window.selectedChat = chat;
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredChatList = searchQuery.trim()
    ? chatList.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : chatList;

  return (
    <div className="lg:w-[30rem] bg-white flex flex-col ">
      {/* Mobile Header with Search */}
      <div className="p-4 border-b border-gray-200">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Mobile: Horizontal Scrollable Chat List */}
      <div className="flex-1 lg:hidden">
        <ScrollArea className="w-full h-full">
          <HorizontalChatList
            chats={filteredChatList}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            isLoading={isLoading}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: Vertical Chat List */}
      <div className="flex-1 overflow-y-auto hidden lg:block">
        <ScrollArea className="h-full">
          <ChatList
            chats={filteredChatList}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            isLoading={isLoading}
          />
        </ScrollArea>
      </div>
    </div>
  );
}

export default ChatListSidebar;

function TotalMessageCount({ chatList }) {
  const totalUnread = chatList.reduce(
    (sum, chat) => sum + (chat.unreadCount || 0),
    0
  );

  return (
    <div className="flex items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      {totalUnread > 0 && (
        <span className="ml-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          {totalUnread}+
        </span>
      )}
    </div>
  );
}

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search for ..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>
  );
}

function HorizontalChatList({ chats, selectedChat, onChatSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex space-x-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-2 min-w-[80px]"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <TotalMessageCount chatList={chats} />
      <div
        className="flex space-x-4 sm:pb-2"
        style={{ minWidth: "max-content" }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer transition-all duration-200`}
          >
            {/* Avatar with online status */}
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {chat.name.charAt(0)}
              </div>
              {chat.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Name */}
            <div className="text-center">
              <p
                className={`text-xs font-medium truncate max-w-[70px] ${selectedChat?.id === chat.id
                    ? "text-gray-900"
                    : "text-gray-700"
                  }`}
              >
                {chat.name}
              </p>
              {chat.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-1">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatList({ chats, selectedChat, onChatSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-4">
        <TotalMessageCount chatList={chats} />
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <TotalMessageCount chatList={chats} />
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${selectedChat?.id === chat.id
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-50"
            }`}
        >
          {/* Avatar with online status */}
          <div className="relative mr-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {chat.name.charAt(0)}
            </div>
            {chat.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Chat info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3
                className={`font-semibold text-sm truncate ${selectedChat?.id === chat.id ? "text-white" : "text-gray-900"
                  }`}
              >
                {chat.name}
              </h3>
              <span
                className={`text-xs ml-2 ${selectedChat?.id === chat.id
                    ? "text-blue-100"
                    : "text-gray-500"
                  }`}
              >
                {chat.timestamp}
              </span>
            </div>

            <p
              className={`text-sm truncate ${selectedChat?.id === chat.id ? "text-blue-100" : "text-gray-600"
                }`}
            >
              {chat.lastMessage || "No recent message"}
            </p>
          </div>

          {/* New message indicator */}
          {chat.hasNewMessage && selectedChat?.id !== chat.id && (
            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
          )}

          {/* Unread count */}
          {chat.unreadCount > 0 && selectedChat?.id !== chat.id && (
            <div className="ml-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
              {chat.unreadCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}