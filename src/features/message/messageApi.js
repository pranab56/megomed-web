import { baseApi } from '../../utils/apiBaseQuery';


export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (data) => ({
        url: "/message/send-messages",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }),
      providesTags: ["message"],
    }),

  })
});

// Export hooks
export const {
  useCreateMessageMutation,
  useGetMessageByIdQuery
} = messageApi;
