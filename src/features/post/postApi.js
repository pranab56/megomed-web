import { baseApi } from "../../utils/apiBaseQuery";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: `/post/create-post`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["post"],
    }),

    updatePost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/post/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["post"],
    }),

    allPost: builder.query({
      query: () => ({
        url: `/post/me`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),

    singlePost: builder.query({
      query: (id) => ({
        url: `/post/${id}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),

    deletePost: builder.query({
      query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
  }),
});

// Export hooks
export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useAllPostQuery,
  useSinglePostQuery,
  useDeletePostQuery,
} = postApi;
