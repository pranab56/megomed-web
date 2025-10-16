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
} = freelancerApi;
