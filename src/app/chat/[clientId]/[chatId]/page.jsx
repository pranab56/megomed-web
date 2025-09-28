'use client';

import { use } from 'react';
import ChatWindow from '../../components/ChatWindow';

const Page = ({ params }) => {
  // unwrap the params (since it's a Promise)
  const { clientId, chatId } = use(params);

  console.log("client id:", clientId);
  console.log("chat Id:", chatId);

  return (
    <div>
      <ChatWindow clientId={clientId} chatId={chatId} />
    </div>
  );
};

export default Page;
