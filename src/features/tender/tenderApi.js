import { baseApi } from "../../utils/apiBaseQuery";

export const tenderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTender: builder.mutation({
      query: (data) => ({
        url: "/tender/create-tender",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tender"],
    }),

    getAllTenderByClient: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm } = {}) => {
        let url = `/tender/me`;
        const params = [];

        if (categoryName && categoryName.trim()) {
          params.push(`categoryName=${encodeURIComponent(categoryName)}`);
        }
        if (serviceTypeName && serviceTypeName.trim()) {
          params.push(`serviceTypeName=${encodeURIComponent(serviceTypeName)}`);
        }
        if (searchTerm && searchTerm.trim()) {
          params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
        }

        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["tender"],
    }),

    getAllTenderByClientPublic: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm, id } = {}) => {
        let url = `/tender/me/public/${id}`;
        const params = [];

        if (categoryName && categoryName.trim()) {
          params.push(`categoryName=${encodeURIComponent(categoryName)}`);
        }
        if (serviceTypeName && serviceTypeName.trim()) {
          params.push(`serviceTypeName=${encodeURIComponent(serviceTypeName)}`);
        }
        if (searchTerm && searchTerm.trim()) {
          params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
        }

        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["tender"],
    }),

    getAllPostByClientPublic: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm, id } = {}) => {
        let url = `/post/me/public/${id}`;
        const params = [];

        if (categoryName && categoryName.trim()) {
          params.push(`categoryName=${encodeURIComponent(categoryName)}`);
        }
        if (serviceTypeName && serviceTypeName.trim()) {
          params.push(`serviceTypeName=${encodeURIComponent(serviceTypeName)}`);
        }
        if (searchTerm && searchTerm.trim()) {
          params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
        }

        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["tender"],
    }),

    getAllTender: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm } = {}) => {
        let url = `/tender`;
        const params = [];

        if (categoryName && categoryName.trim()) {
          params.push(`categoryName=${encodeURIComponent(categoryName)}`);
        }
        if (serviceTypeName && serviceTypeName.trim()) {
          params.push(`serviceTypeName=${encodeURIComponent(serviceTypeName)}`);
        }
        if (searchTerm && searchTerm.trim()) {
          params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
        }

        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["tender"],
    }),

    singleTender: builder.query({
      query: (id) => ({
        url: `/tender/${id}`,
        method: "GET",
      }),
      providesTags: ["tender"],
    }),

    respond: builder.mutation({
      query: (id) => ({
        url: `/tender/respond/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["tender"],
    }),

    applyTender: builder.mutation({
      query: (id) => ({
        url: `/tender/respond/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["tender"],
    }),

    runningTenderByClientId: builder.query({
      query: (id) => ({
        url: `/tender/running-tenders/${id}`,
        method: "GET",
      }),
      providesTags: ["tender"],
    }),

    responseMessage: builder.mutation({
      query: (id) => ({
        url: `/tender/respond/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["tender"],
    }),

    deleteTender: builder.mutation({
      query: (id) => ({
        url: `/tender/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tender"],
    }),
  }),
  overrideExisting: true,
});

// Export hooks
export const {
  useCreateTenderMutation,
  useGetAllTenderByClientQuery,
  useGetAllTenderByClientPublicQuery,
  useGetAllTenderQuery,
  useSingleTenderQuery,
  useRespondMutation,
  useRunningTenderByClientIdQuery,
  useApplyTenderMutation,
  useGetAllPostByClientPublicQuery,
  useResponseMessageMutation,
  useDeleteTenderMutation,
} = tenderApi;
