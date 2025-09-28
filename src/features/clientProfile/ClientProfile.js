import { baseApi } from '../../utils/apiBaseQuery';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => ({
        url: "/chat/my-chat-list",
        method: "GET",
      }),
      providesTags: ["chat"],
    }),

  })
});

// Export hooks
export const {
   useGetAllChatsQuery
} = chatApi;
