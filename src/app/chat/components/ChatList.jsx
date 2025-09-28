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
import { useMyChatListQuery } from '../../../features/chat/chatApi';



const ChatList = ({ setIsChatActive, status }) => {
  const router = useRouter();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionStates, setActionStates] = useState({});
  const chatListRef = useRef(null);

  const { data, isLoading, error } = useMyChatListQuery();

  // Extract chats from API response
  const apiChats = useMemo(() => {
    if (!data?.data) return [];

    // Combine pinned and unpinned chats
    const allChats = [
      ...(data.data.pinned || []),
      ...(data.data.unpinned || [])
    ];

    return allChats.map(chatItem => ({
      _id: chatItem.chat._id,
      participants: chatItem.chat.participants || [],
      lastMessage: chatItem.message._id ? {
        _id: chatItem.message._id,
        text: chatItem.message.message || chatItem.message.text,
        image: chatItem.message.image,
        sender: chatItem.message.sender,
        createdAt: chatItem.message.createdAt,
        seen: chatItem.message.seen,
        replyTo: chatItem.message.replyTo,
        isPinned: chatItem.message.isPinned,
        reactionUsers: chatItem.message.reactionUsers || []
      } : null,
      unreadCount: chatItem.unreadMessageCount || 0,
      status: chatItem.chat.status,
      isPinned: chatItem.chat.isPinned,
      createdAt: chatItem.chat.createdAt,
      updatedAt: chatItem.chat.updatedAt
    }));
  }, [data]);

  const chatsToShow = useMemo(() => {
    if (!apiChats.length) return [];

    let filteredChats = apiChats;

    // Apply search filter
    if (searchTerm) {
      filteredChats = apiChats.filter(chat => {
        const participant = chat.participants?.find(p => p._id !== 'currentUser');
        const fullName = participant?.fullName?.toLowerCase() || '';
        const email = participant?.email?.toLowerCase() || '';
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
  }, [searchTerm, apiChats]);

  useEffect(() => {
    if (chatListRef.current) {
      const savedPosition = sessionStorage.getItem('chatListScrollPosition');
      if (savedPosition) {
        chatListRef.current.scrollTop = parseInt(savedPosition, 10);
      }
    }
  }, [chatsToShow]);

  const handleScroll = useCallback(() => {
    if (chatListRef.current) {
      sessionStorage.setItem('chatListScrollPosition', chatListRef.current.scrollTop);
    }
  }, []);

  const handleSelectChat = async (chat) => {
    if (actionStates[chat._id]?.loading) return;
    setActionStates(prev => ({ ...prev, [chat._id]: { loading: true, action: 'select' } }));

    try {
      router.push(`/chat/${chat.participants[0]._id}/${chat._id}`);
      if (setIsChatActive) setIsChatActive(true);

      // You might want to call an API to mark messages as read here
      // Example: await markMessagesAsRead(chat._id);

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
    // Get the first participant (assuming it's the other user)
    const participant = chat.participants?.[0];
    return participant || { fullName: 'Unknown User', email: '', profile: null };
  };

  const getAvatarFallback = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
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
        {searchTerm ? 'No matching chats found' : 'No chats yet'}
      </p>
      <p className="text-xs mt-1 text-center">
        {searchTerm ? 'Try a different search term' : 'Start a conversation to see chats here'}
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
            <p className="text-sm text-center">Error loading chats. Please try again.</p>
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
                    className={`flex items-center gap-3 p-4 border-b cursor-pointer transition-colors ${isActiveChat
                      ? 'bg-muted'
                      : 'hover:bg-muted/50'
                      } ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={participant?.profile} />
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
                        <h3 className={`font-medium truncate text-sm ${isRead ? '' : 'font-semibold'
                          }`}>
                          {participant?.fullName || 'Unknown User'}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground truncate">
                            {hasMessage
                              ? formatTime(chat.lastMessage.createdAt)
                              : formatTime(chat.createdAt)
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate text-muted-foreground ${isRead ? '' : 'font-medium text-foreground'
                          }`}>
                          {hasMessage ? (
                            chat.lastMessage.image
                              ? '📷 Image'
                              : chat.lastMessage.text?.slice(0, 30) + (chat.lastMessage.text?.length > 30 ? '...' : '')
                          ) : 'No messages yet'}
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
                        <div className="text-muted-foreground">
                          📌
                        </div>
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