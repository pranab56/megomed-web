import React from "react";
import ChatListSidebar from "./ChatListSidebar";
import ChatInterface from "./ChatBoxLayout";

function InboxLayout() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)] md:h-[calc(100vh-90px)] sm:h-auto min-h-[500px]">
      <ChatListSidebar />
      <ChatInterface />
    </div>
  );
}

export default InboxLayout;