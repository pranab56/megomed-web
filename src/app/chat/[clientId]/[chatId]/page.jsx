"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatWindow from "../../components/ChatWindow";

const Page = ({ params: serverParams }) => {
  // Get params from both server and client side
  const clientParams = useParams();

  // Use client-side params as they're more reliable after navigation
  const clientId = clientParams?.clientId || serverParams?.clientId;
  const chatId = clientParams?.chatId || serverParams?.chatId;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Force a re-render when the component mounts to ensure params are available
    setIsLoaded(true);
    console.log("Chat page mounted with params:", { clientId, chatId });
  }, [clientId, chatId]);

  // Log for debugging
  console.log("Client ID:", clientId);
  console.log("Chat ID:", chatId);

  return (
    <div>
      {isLoaded && clientId && chatId ? (
        <ChatWindow
          clientId={clientId}
          chatId={chatId}
          key={`${clientId}-${chatId}`}
        />
      ) : (
        <div className="flex items-center justify-center h-[500px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Page;
