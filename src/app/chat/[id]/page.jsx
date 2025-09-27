'use client'
import { use } from 'react';
import ChatWindow from '../components/ChatWindow';

const Page = ({ params }) => {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  // console.log(resolvedParams.id);

  return (
    <div>
      <ChatWindow id={resolvedParams.id} />
    </div>
  );
};

export default Page;