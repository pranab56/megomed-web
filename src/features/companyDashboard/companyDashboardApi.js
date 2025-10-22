import { baseApi } from "../../utils/apiBaseQuery";

export const companyDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyDashboard: builder.query({
      query: () => ({
        url: "/apply-jobs/client-company",
        method: "GET",
      }),
      providesTags: ["companyDashboard"],
    }),

    companyJobSorting: builder.mutation({
      query: (data) => ({
        url: `/apply-jobs/invoice-approve-cancel-shortlist/${data.jobID}?status=${data.status}`,
        method: "POST",
      }),
      invalidatesTags: ["companyDashboard"],
    }),
  }),
});

// Export hooks
export const { useGetCompanyDashboardQuery, useCompanyJobSortingMutation } =
  companyDashboardApi;
