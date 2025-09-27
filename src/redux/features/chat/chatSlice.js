// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getFutureTimestamp } from "./chatUtils";

// // Async thunk for fetching chat list
// export const fetchChatList = createAsyncThunk(
//   "chat/fetchChatList",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       // For now, return the existing chat list from state
//       // Replace with your actual API call when backend is ready
//       const state = getState();
//       return state.chat.chatList;

//       // Uncomment when API is ready:
//       // const response = await fetch('/api/chats');
//       // const data = await response.json();
//       // if (!response.ok) {
//       //   return rejectWithValue(data.message || 'Failed to fetch chat list');
//       // }
//       // return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for fetching messages for a specific chat
// export const fetchChatMessages = createAsyncThunk(
//   "chat/fetchChatMessages",
//   async (chatId, { rejectWithValue, getState }) => {
//     try {
//       // For now, return the existing messages from state
//       // Replace with your actual API call when backend is ready
//       const state = getState();
//       const messages = state.chat.messages[chatId] || [];
//       return { chatId, messages };

//       // Uncomment when API is ready:
//       // const response = await fetch(`/api/chats/${chatId}/messages`);
//       // const data = await response.json();
//       // if (!response.ok) {
//       //   return rejectWithValue(data.message || 'Failed to fetch messages');
//       // }
//       // return { chatId, messages: data };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for sending a message
// export const sendMessage = createAsyncThunk(
//   "chat/sendMessage",
//   async ({ chatId, message }, { rejectWithValue }) => {
//     try {
//       // For now, simulate a successful API response
//       // Replace with your actual API call when backend is ready
//       const mockResponse = {
//         id: Date.now(),
//         text: message,
//         sender: "user2",
//         timestamp: "just now",
//         avatar: "👤",
//       };

//       // Simulate network delay
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       return { chatId, message: mockResponse };

//       // Uncomment when API is ready:
//       // const response = await fetch(`/api/chats/${chatId}/messages`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       //   body: JSON.stringify({ message }),
//       // });
//       // const data = await response.json();
//       // if (!response.ok) {
//       //   return rejectWithValue(data.message || 'Failed to send message');
//       // }
//       // return { chatId, message: data };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for marking messages as read
// export const markMessagesAsRead = createAsyncThunk(
//   "chat/markMessagesAsRead",
//   async (chatId, { rejectWithValue }) => {
//     try {
//       // For now, simulate a successful API response
//       // Replace with your actual API call when backend is ready
//       await new Promise((resolve) => setTimeout(resolve, 200));
//       return chatId;

//       // Uncomment when API is ready:
//       // const response = await fetch(`/api/chats/${chatId}/read`, {
//       //   method: 'PUT',
//       // });
//       // if (!response.ok) {
//       //   return rejectWithValue('Failed to mark messages as read');
//       // }
//       // return chatId;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   // Chat list (users from sidebar)
//   chatList: [
//     {
//       id: 1,
//       name: "Larry",
//       status: "Woof! Woof!",
//       timestamp: "24m",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: true,
//       unreadCount: 3,
//       lastMessage: "Woof! Woof!",
//       projectInfo: {
//         title: "Website Redesign",
//         deliveryDate: getFutureTimestamp(7), // 7 days from now as timestamp
//         budget: "$2,500",
//         status: "In Progress",
//       },
//     },
//     {
//       id: 2,
//       name: "Max",
//       status: "Hello",
//       timestamp: "40m",
//       avatar:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Hello",
//       projectInfo: {
//         title: "Mobile App Development",
//         deliveryDate: getFutureTimestamp(14), // 14 days from now as timestamp
//         budget: "$5,000",
//         status: "Planning",
//       },
//     },
//     {
//       id: 3,
//       name: "Lemon",
//       status: "Where are You?",
//       timestamp: "1 hr",
//       avatar:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
//       isOnline: false,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Where are You?",
//       projectInfo: {
//         title: "Logo Design",
//         deliveryDate: getFutureTimestamp(3), // 3 days from now as timestamp
//         budget: "$800",
//         status: "Review",
//       },
//     },
//     {
//       id: 4,
//       name: "Katy",
//       status: "",
//       timestamp: "3 hr",
//       avatar:
//         "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "",
//       projectInfo: {
//         title: "Content Writing",
//         deliveryDate: getFutureTimestamp(5), // 5 days from now as timestamp
//         budget: "$1,200",
//         status: "In Progress",
//       },
//     },
//     {
//       id: 5,
//       name: "Chedder",
//       status: "Yes",
//       timestamp: "1 day",
//       avatar:
//         "https://images.unsplash.com/photo-1558499932-9609acb6f443?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       isOnline: false,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Yes",
//       projectInfo: {
//         title: "SEO Optimization",
//         deliveryDate: getFutureTimestamp(10), // 10 days from now as timestamp
//         budget: "$1,500",
//         status: "Completed",
//       },
//     },
//     {
//       id: 6,
//       name: "Daisy",
//       status: "Sure",
//       timestamp: "2 day",
//       avatar:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Sure",
//       projectInfo: {
//         title: "Social Media Management",
//         deliveryDate: getFutureTimestamp(30), // 30 days from now as timestamp
//         budget: "$3,000",
//         status: "Planning",
//       },
//     },
//     {
//       id: 7,
//       name: "Daisy",
//       status: "Sure",
//       timestamp: "2 day",
//       avatar:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Sure",
//       projectInfo: {
//         title: "Social Media Management",
//         deliveryDate: getFutureTimestamp(30), // 30 days from now as timestamp
//         budget: "$3,000",
//         status: "Planning",
//       },
//     },
//     {
//       id: 8,
//       name: "Daisy",
//       status: "Sure",
//       timestamp: "2 day",
//       avatar:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Sure",
//       projectInfo: {
//         title: "Social Media Management",
//         deliveryDate: getFutureTimestamp(30), // 30 days from now as timestamp
//         budget: "$3,000",
//         status: "Planning",
//       },
//     },
//     {
//       id: 9,
//       name: "Daisy",
//       status: "Sure",
//       timestamp: "2 day",
//       avatar:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Sure",
//       projectInfo: {
//         title: "Social Media Management",
//         deliveryDate: getFutureTimestamp(30), // 30 days from now as timestamp
//         budget: "$3,000",
//         status: "Planning",
//       },
//     },
//     {
//       id: 10,
//       name: "Daisy",
//       status: "Sure",
//       timestamp: "2 day",
//       avatar:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
//       isOnline: true,
//       isActive: false,
//       hasNewMessage: false,
//       unreadCount: 0,
//       lastMessage: "Sure",
//       projectInfo: {
//         title: "Social Media Management",
//         deliveryDate: getFutureTimestamp(30), // 30 days from now as timestamp
//         budget: "$3,000",
//         status: "Planning",
//       },
//     },
//   ],

//   // Currently selected chat
//   selectedChat: null,

//   // Messages for each chat (keyed by chatId)
//   messages: {
//     1: [
//       {
//         id: 1,
//         text: "omg, this is amazing",
//         sender: "user1",
//         timestamp: "2 min ago",
//         avatar: "👨‍💼",
//       },
//       {
//         id: 2,
//         text: "perfect! ✅",
//         sender: "user1",
//         timestamp: "2 min ago",
//         avatar: "👨‍💼",
//       },
//       {
//         id: 3,
//         text: "Wow, this is really epic",
//         sender: "user1",
//         timestamp: "2 min ago",
//         avatar: "👨‍💼",
//       },
//       {
//         id: 4,
//         text: "woohooo",
//         sender: "user2",
//         timestamp: "just now",
//         avatar: "👤",
//       },
//       {
//         id: 5,
//         text: "Haha oh man",
//         sender: "user2",
//         timestamp: "just now",
//         avatar: "👤",
//       },
//       {
//         id: 6,
//         text: "Haha that's terrifying 😱",
//         sender: "user2",
//         timestamp: "just now",
//         avatar: "👤",
//       },
//     ],
//     2: [
//       {
//         id: 1,
//         text: "Hello! How's the project going?",
//         sender: "user1",
//         timestamp: "40m ago",
//         avatar: "👨‍💼",
//       },
//       {
//         id: 2,
//         text: "Great! I've completed the initial design",
//         sender: "user2",
//         timestamp: "35m ago",
//         avatar: "👤",
//       },
//     ],
//   },

//   // Loading states
//   isLoading: false,
//   isSendingMessage: false,

//   // Error state
//   error: null,

//   // Typing indicators (keyed by chatId)
//   typingUsers: {},

//   // Search functionality
//   searchQuery: "",
//   filteredChatList: [],
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     // Select a chat
//     selectChat: (state, action) => {
//       const chatId = action.payload;
//       console.log("action.payload", action.payload);
//       // Update active status for all chats
//       state.chatList = state.chatList.map((chat) => ({
//         ...chat,
//         isActive: chat.id === chatId,
//       }));

//       // Set selected chat
//       state.selectedChat = state.chatList.find((chat) => chat.id === chatId);

//       // Mark messages as read for this chat
//       if (state.selectedChat) {
//         state.selectedChat.hasNewMessage = false;
//         state.selectedChat.unreadCount = 0;
//       }
//     },

//     // Add a new message locally (optimistic update)
//     addMessage: (state, action) => {
//       const { chatId, message } = action.payload;
//       console.log("action.payload.addMessage", action.payload);

//       if (!state.messages[chatId]) {
//         state.messages[chatId] = [];
//       }

//       state.messages[chatId].push(message);

//       // Update last message in chat list
//       const chatIndex = state.chatList.findIndex((chat) => chat.id === chatId);
//       if (chatIndex !== -1) {
//         state.chatList[chatIndex].lastMessage = message.text;
//         state.chatList[chatIndex].timestamp = "just now";
//       }
//     },

//     // Set typing indicator
//     setTypingIndicator: (state, action) => {
//       const { chatId, userId, isTyping } = action.payload;

//       if (isTyping) {
//         state.typingUsers[chatId] = userId;
//       } else {
//         delete state.typingUsers[chatId];
//       }
//     },

//     // Update search query
//     setSearchQuery: (state, action) => {
//       state.searchQuery = action.payload;
//       console.log("action.payload.searchQuery", action.payload);
//       if (action.payload.trim() === "") {
//         state.filteredChatList = [];
//       } else {
//         state.filteredChatList = state.chatList.filter(
//           (chat) =>
//             chat.name.toLowerCase().includes(action.payload.toLowerCase()) ||
//             chat.lastMessage
//               .toLowerCase()
//               .includes(action.payload.toLowerCase())
//         );
//       }
//     },

//     // Mark chat as having new message
//     markChatAsUnread: (state, action) => {
//       const chatId = action.payload;
//       const chatIndex = state.chatList.findIndex((chat) => chat.id === chatId);

//       if (chatIndex !== -1) {
//         state.chatList[chatIndex].hasNewMessage = true;
//         state.chatList[chatIndex].unreadCount += 1;
//       }
//     },

//     // Clear error
//     clearChatError: (state) => {
//       state.error = null;
//     },

//     // Update chat status (online/offline)
//     updateChatStatus: (state, action) => {
//       const { chatId, isOnline } = action.payload;
//       const chatIndex = state.chatList.findIndex((chat) => chat.id === chatId);

//       if (chatIndex !== -1) {
//         state.chatList[chatIndex].isOnline = isOnline;
//       }
//     },

//     // Update project info
//     updateProjectInfo: (state, action) => {
//       const { chatId, projectInfo } = action.payload;
//       const chatIndex = state.chatList.findIndex((chat) => chat.id === chatId);

//       if (chatIndex !== -1) {
//         state.chatList[chatIndex].projectInfo = {
//           ...state.chatList[chatIndex].projectInfo,
//           ...projectInfo,
//         };
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch chat list cases
//       .addCase(fetchChatList.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchChatList.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.chatList = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchChatList.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })

//       // Fetch messages cases
//       .addCase(fetchChatMessages.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchChatMessages.fulfilled, (state, action) => {
//         state.isLoading = false;
//         const { chatId, messages } = action.payload;
//         state.messages[chatId] = messages;
//         state.error = null;
//       })
//       .addCase(fetchChatMessages.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })

//       // Send message cases
//       .addCase(sendMessage.pending, (state, action) => {
//         state.isSendingMessage = true;
//         state.error = null;

//         // Optimistic update - add message immediately
//         const { chatId, message } = action.meta.arg;
//         const optimisticMessage = {
//           id: Date.now(),
//           text: message,
//           sender: "user2",
//           timestamp: "just now",
//           avatar: "👤",
//         };

//         if (!state.messages[chatId]) {
//           state.messages[chatId] = [];
//         }
//         state.messages[chatId].push(optimisticMessage);

//         // Update last message in chat list
//         const chatIndex = state.chatList.findIndex(
//           (chat) => chat.id === chatId
//         );
//         if (chatIndex !== -1) {
//           state.chatList[chatIndex].lastMessage = message;
//           state.chatList[chatIndex].timestamp = "just now";
//         }
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         state.isSendingMessage = false;
//         // Message is already added optimistically, just update the ID if needed
//         state.error = null;
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.isSendingMessage = false;
//         state.error = action.payload;

//         // Remove the optimistic message on failure
//         const { chatId } = action.meta.arg;
//         if (state.messages[chatId] && state.messages[chatId].length > 0) {
//           state.messages[chatId].pop();
//         }
//       })

//       // Mark messages as read cases
//       .addCase(markMessagesAsRead.fulfilled, (state, action) => {
//         const chatId = action.payload;
//         const chatIndex = state.chatList.findIndex(
//           (chat) => chat.id === chatId
//         );

//         if (chatIndex !== -1) {
//           state.chatList[chatIndex].hasNewMessage = false;
//           state.chatList[chatIndex].unreadCount = 0;
//         }
//       });
//   },
// });

// export const {
//   selectChat,
//   addMessage,
//   setTypingIndicator,
//   setSearchQuery,
//   markChatAsUnread,
//   clearChatError,
//   updateChatStatus,
//   updateProjectInfo,
// } = chatSlice.actions;

// export default chatSlice.reducer;
