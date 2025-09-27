"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BsCheckAll,
  BsSearch
} from 'react-icons/bs';

const ChatList = ({ setIsChatActive, status }) => {
  const router = useRouter();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionStates, setActionStates] = useState({});
  const [localChats, setLocalChats] = useState([]);
  const chatListRef = useRef(null);

  // Demo data
  const demoChats = [
    {
      _id: '1',
      participants: [
        { _id: 'user1', name: 'John Doe', userName: 'johndoe', profile: null },
        { _id: 'currentUser', name: 'You', userName: 'you' }
      ],
      lastMessage: {
        text: 'Hello there! How are you doing?',
        sender: 'user1',
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
        read: false,
        type: 'text'
      },
      unreadCount: 2,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      participants: [
        { _id: 'user2', name: 'Alice Smith', userName: 'alicesmith', profile: null },
        { _id: 'currentUser', name: 'You', userName: 'you' }
      ],
      lastMessage: {
        text: 'Meeting at 3 PM tomorrow',
        sender: 'currentUser',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      participants: [
        { _id: 'user3', name: 'Bob Johnson', userName: 'bobjohnson', profile: null },
        { _id: 'currentUser', name: 'You', userName: 'you' }
      ],
      lastMessage: {
        text: 'Check out this image!',
        sender: 'user3',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        read: false,
        type: 'image'
      },
      unreadCount: 1,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      participants: [
        { _id: 'user4', name: 'Emma Wilson', userName: 'emmawilson', profile: null },
        { _id: 'currentUser', name: 'You', userName: 'you' }
      ],
      lastMessage: {
        text: 'Thanks for your help!',
        sender: 'user4',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setLocalChats(demoChats);
  }, []);

  const chatsToShow = useMemo(() => {
    const chats = localChats || [];

    if (searchTerm) {
      return chats.filter(chat => {
        const participant = chat.participants?.find(p => p._id !== 'currentUser');
        return participant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      return [...chats].sort((a, b) => {
        const timeA = a.lastMessage?.createdAt || a.updatedAt || a.createdAt;
        const timeB = b.lastMessage?.createdAt || b.updatedAt || b.createdAt;
        return new Date(timeB) - new Date(timeA);
      });
    }
  }, [searchTerm, localChats]);

  const memoizedChats = useMemo(() => chatsToShow, [chatsToShow]);

  useEffect(() => {
    if (chatListRef.current) {
      const savedPosition = sessionStorage.getItem('chatListScrollPosition');
      if (savedPosition) {
        chatListRef.current.scrollTop = parseInt(savedPosition, 10);
      }
    }
  }, [memoizedChats]);

  const handleScroll = useCallback(() => {
    if (chatListRef.current) {
      sessionStorage.setItem('chatListScrollPosition', chatListRef.current.scrollTop);
    }
  }, []);

  const handleSelectChat = async (chat) => {
    if (actionStates[chat._id]?.loading) return;
    setActionStates(prev => ({ ...prev, [chat._id]: { loading: true, action: 'select' } }));

    try {
      router.push(`/chat/${chat._id}`);
      if (setIsChatActive) setIsChatActive(true);

      // Mark as read locally
      if (chat.unreadCount > 0) {
        setLocalChats(prevChats =>
          prevChats.map(c => {
            if (c._id === chat._id) {
              return {
                ...c,
                unreadCount: 0,
                lastMessage: c.lastMessage ? { ...c.lastMessage, read: true } : null
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error('Error selecting chat:', error);
    } finally {
      setActionStates(prev => ({ ...prev, [chat._id]: { loading: false, action: '' } }));
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      return moment(timestamp).fromNow();
    } catch (error) {
      console.error('Error formatting time:', error);
      return "Just now";
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getParticipantInfo = (chat) => {
    const participant = chat.participants?.find(p => p._id !== 'currentUser');
    return participant || { userName: 'User', profile: null };
  };

  const getAvatarFallback = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const renderLoadingState = () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="rounded-full bg-muted h-12 w-12" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
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
      </div>

      <div
        ref={chatListRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {memoizedChats?.length > 0 ? (
          <AnimatePresence>
            {memoizedChats.map((chat) => {
              const isActionLoading = actionStates[chat._id]?.loading;
              const participant = getParticipantInfo(chat);
              const isRead = chat.lastMessage?.read || chat.unreadCount === 0;
              const isActiveChat = chat._id === id;

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
                    className={`flex items-center gap-3 p-4 border-b cursor-pointer transition-colors ${isActiveChat
                      ? 'bg-muted'
                      : 'hover:bg-muted/50'
                      } ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={participant?.profile} />
                        <AvatarFallback>
                          {getAvatarFallback(participant?.name || participant?.userName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-medium truncate text-sm ${isRead ? '' : 'font-semibold'}`}>
                          {participant?.name || participant?.userName}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground truncate">
                            {formatTime(chat?.lastMessage?.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate text-muted-foreground ${isRead ? '' : 'font-medium text-foreground'
                          }`}>
                          {chat?.lastMessage?.type === "image" ? '📷 Image' :
                            chat?.lastMessage?.type === "both" ? '📷 Image' :
                              chat?.lastMessage?.text?.slice(0, 30) || 'No messages yet'}
                        </p>
                        {isRead && chat.lastMessage?.sender === 'currentUser' && (
                          <BsCheckAll className="text-muted-foreground h-3 w-3" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {chat?.unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs min-w-[20px] text-center"
                        >
                          {chat?.unreadCount}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-32 text-muted-foreground"
          >
            <p className="text-sm">
              {searchTerm ? 'No matching chats found' : 'No chats yet'}
            </p>
            <p className="text-xs mt-1">Start a conversation to see chats here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatList;