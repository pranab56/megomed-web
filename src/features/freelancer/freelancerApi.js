import { baseApi } from "../../utils/apiBaseQuery";

export const freelancerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFreeLancer: builder.query({
      query: (designation) => {
        let url = "/users/all-freelancers";
        if (designation) {
          url += `?designation=${designation}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["freelancer"],
    }),

    getTopFreeLancer: builder.query({
      query: () => ({
        url: "/users/all-freelancers?freelancer=top",
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),
    freelancerVerificationRequest: builder.mutation({
      query: () => ({
        url: "/users/profile-verify-requiest",
        method: "POST",
      }),
      invalidatesTags: ["freelancer"],
    }),
    freelancerProposal: builder.mutation({
      query: (data) => ({
        url: "/apply-jobs/create-job",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["freelancer"],
    }),
    getAppliedJobs: builder.query({
      query: () => ({
        url: "/apply-jobs/freelancer",
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),
    getAppliedTenders: builder.query({
      query: () => ({
        url: "/invoice/freelancer",
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),
    jobResponseMessage: builder.mutation({
      query: (id) => ({
        url: `/tender/respond/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["freelancer"],
    }),
    allFreelancers: builder.query({
      query: () => ({
        url: `/users/all-users?role=freelancer&isVarified=varified`,
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),
    followRequests: builder.mutation({
      query: (data) => ({
        url: "/follow/create-follow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["freelancer"],
    }),
    allFollowPending: builder.query({
      query: () => ({
        url: `/follow?status=pending&type=followers`,
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),
    allFollowAccepted: builder.query({
      query: () => ({
        url: `/follow?status=accepted&type=followers`,
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),
    followBack: builder.mutation({
      query: (id) => ({
        url: `/follow/accept-cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["freelancer"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllFreeLancerQuery,
  useGetTopFreeLancerQuery,
  useFreelancerVerificationRequestMutation,
  useFreelancerProposalMutation,
  useGetAppliedJobsQuery,
  useGetAppliedTendersQuery,
  useJobResponseMessageMutation,
  useAllFreelancersQuery,
  useFollowRequestsMutation,
  useAllFollowPendingQuery,
  useAllFollowAcceptedQuery,
  useFollowBackMutation,
} = freelancerApi;
