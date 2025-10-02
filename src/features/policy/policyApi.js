import { baseApi } from "../../utils/apiBaseQuery";

export const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    privacyPolicy: builder.query({
      query: () => ({
        url: `/setting`,
        method: "GET",
      }),
      providesTags: ["policy"],
    }),
  }),
});

// Export hooks
export const { usePrivacyPolicyQuery } = policyApi;
