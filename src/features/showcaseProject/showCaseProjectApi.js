import { baseApi } from "../../utils/apiBaseQuery";

export const showCaseProjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShowCaseProject: builder.mutation({
      query: (data) => ({
        url: "/project/create-project",
        method: "POST",
        body: data,
        // Don't set Content-Type header, let the browser set it for FormData
        prepareHeaders: (headers) => {
          // Remove any existing Content-Type header to let the browser set it
          headers.delete("Content-Type");
          return headers;
        },
      }),
      invalidatesTags: ["showcaseProject"],
    }),
    getAllShowCaseProject: builder.query({
      query: () => ({
        url: "/project/me",
        method: "GET",
      }),
      providesTags: ["showcaseProject"],
    }),
  }),
});

// Export hooks
export const {
  useCreateShowCaseProjectMutation,
  useGetAllShowCaseProjectQuery,
} = showCaseProjectApi;
