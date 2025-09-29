import { baseApi } from "../../utils/apiBaseQuery";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (data) => ({
        url: "/message/send-messages",
        method: "POST",
        body: data,
        headers: {
          // Remove Content-Type to let browser set it automatically for FormData
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }),
      invalidatesTags: ["message"],
    }),

    getMessageById: builder.query({
      query: (id) => ({
        url: `/message/my-messages/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }),
      providesTags: ["message"],
    }),
    markMessageAsSeen: builder.mutation({
      query: (id) => ({
        url: `/message/seen/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["message"],
    }),
  }),
});

// Export hooks
export const {
  useCreateMessageMutation,
  useGetMessageByIdQuery,
  useMarkMessageAsSeenMutation,
} = messageApi;
