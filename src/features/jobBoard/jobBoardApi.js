import { baseApi } from "../../utils/apiBaseQuery";

export const jobBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (data) => ({
        url: "/jobs/create-jobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["jobBoard"],
    }),

    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["jobBoard"],
    }),

    // features/jobBoard/jobBoardApi.js
    allProjectByClient: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm }) => {
        let url = `/jobs/me`;
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
      providesTags: ["jobBoard"],
    }),

    allProjectByCompany: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm }) => {
        let url = `/jobs/me`;
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
      providesTags: ["jobBoard"],
    }),

    getAllJobs: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm }) => {
        let url = `/jobs`;
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
      providesTags: ["jobBoard"],
    }),

    singleJobs: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: ["jobBoard"],
    }),

    deleteJobs: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobBoard"],
    }),
    overrideExisting: true,
  }),
});

// Export hooks
export const {
  useAllProjectByClientQuery,
  useAllProjectByCompanyQuery,
  useCreateJobMutation,
  useDeleteJobsMutation,
  useGetAllJobsQuery,
  useSingleJobsQuery,
  useUpdateJobMutation,
} = jobBoardApi;
