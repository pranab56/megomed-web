import { baseApi } from "../../utils/apiBaseQuery";

export const clientDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientDashboard: builder.query({
      query: () => ({
        url: "/apply-jobs/client-company",
        method: "GET",
      }),
      providesTags: ["clientDashboard"],
    }),

    companyVerificationRequest: builder.mutation({
      query: () => ({
        url: "/users/profile-verify-requiest",
        method: "POST",
      }),
      invalidatesTags: ["company"],
    }),
    clientJobSorting: builder.mutation({
      query: (data) => ({
        url: `/apply-jobs/invoice-approve-cancel-shortlist/${data.jobID}?status=${data.status}`,
        method: "POST",
      }),
      invalidatesTags: ["clientDashboard"],
    }),
  }),
});

// Export hooks
export const {
  useGetClientDashboardQuery,
  useCompanyVerificationRequestMutation,
  useClientJobSortingMutation,
} = clientDashboardApi;
