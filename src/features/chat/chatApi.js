import { baseApi } from "../../utils/apiBaseQuery";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chat"],
    }),

    addParticipent: builder.mutation({
      query: ({ chatId, participantId }) => ({
        url: `/chat/add-participant?chatId=${chatId}&participantId=${participantId}`,
        method: "POST",
      }),
      invalidatesTags: ["chat"],
    }),

    chatPinUnpin: builder.mutation({
      query: ({ chatId }) => ({
        url: `/chat/pin-unpin-message/${chatId}`,
        method: "POST",
      }),
      invalidatesTags: ["chat"],
    }),

    singleChat: builder.query({
      query: ({ chatId }) => ({
        url: `/chat/${chatId}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),

    myChatList: builder.query({
      query: () => ({
        url: `/chat/my-chat-list`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),

    deleteChat: builder.mutation({
      query: ({ chatId }) => ({
        url: `/chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chat"],
    }),

    createSupportChat: builder.mutation({
      query: (data) => ({
        url: `/support-message/send-messages`,
        method: "POST",
        body: data,
        // Don't set headers - let apiBaseQuery handle authentication
        // Don't set Content-Type for FormData - let browser handle it
      }),
      invalidatesTags: ["chat"],
    }),
  }),
});

// Export hooks
export const {
  useCreateChatMutation,
  useAddParticipentMutation,
  useChatPinUnpinMutation,
  useSingleChatQuery,
  useMyChatListQuery,
  useDeleteChatMutation,
  useCreateSupportChatMutation,
} = chatApi;
