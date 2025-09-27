import { baseApi } from '../../utils/apiBaseQuery';

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
      query: ({ categoryName , serviceTypeName, searchTerm }) => {
        let url = `/jobs/me?`;
        // `/jobs/me?categoryName=${categoryName}&serviceTypeName=${serviceTypeName}&searchTerm=${searchTerm}`,
        if(categoryName) {
          url += `categoryName=${categoryName}&`;
        }
        if(serviceTypeName) {
          url += `serviceTypeName=${serviceTypeName}&`;
        }
        if(searchTerm) {
          url += `searchTerm=${searchTerm}&`;
        }
       return {
        url: url,
        method: "GET",
        }
      },
      providesTags: ["jobBoard"],
    }),

    getAllJobs: builder.query({
      query: ({ categoryName, serviceTypeName, searchTerm }) => ({
        url: `/jobs?categoryName=${categoryName}&serviceTypeName=${serviceTypeName}&searchTerm=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["jobBoard"],
    }),


    singleJobs: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: ["jobBoard"],
    }),


    deleteJobs: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobBoard"],
    }),
    overrideExisting: true
  })
});

// Export hooks
export const {
  useAllProjectByClientQuery,
  useCreateJobMutation,
  useDeleteJobsQuery,
  useGetAllJobsQuery,
  useSingleJobsQuery,
  useUpdateJobMutation,
} = jobBoardApi;
