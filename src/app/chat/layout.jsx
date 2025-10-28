"use client";

import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { usePathname } from "next/navigation";
import ChatList from "./components/ChatList";

const ChatLayout = ({ children }) => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [key, setKey] = useState(0);
  const pathname = usePathname();

  // Reset components when the route changes
  useEffect(() => {
    // Force re-render of the ChatList component when pathname changes
    setKey((prevKey) => prevKey + 1);

    // Set chat as active on mobile if we're in a specific chat route
    if (pathname !== "/chat") {
      setIsChatActive(true);
    }
  }, [pathname]);

  return (
    <div className="container mx-auto gap-3 my-10 flex flex-col lg:flex-row">
      <div
        className={`w-full lg:w-3/12 bg-white ${
          isChatActive ? "hidden lg:block" : ""
        }`}
      >
        <ChatList
          key={key}
          status={isChatActive}
          setIsChatActive={setIsChatActive}
        />
      </div>

      <div
        className={`${
          isChatActive ? "" : "hidden lg:block"
        } border rounded-lg shadow w-full lg:w-2/3 flex flex-col bg-gray-50 border-gray-200`}
      >
        <button
          className={`lg:hidden ${isChatActive ? "block" : ""}`}
          onClick={() => setIsChatActive(false)}
        >
          <IoIosArrowBack className="text-2xl m-2" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
