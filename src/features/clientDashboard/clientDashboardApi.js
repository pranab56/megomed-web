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
  }),
});

// Export hooks
export const {
  useGetClientDashboardQuery,
  useCompanyVerificationRequestMutation,
} = clientDashboardApi;
