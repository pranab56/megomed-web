import { baseApi } from "../../utils/apiBaseQuery";

export const myProjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProjectFreelancer: builder.query({
      query: () => ({
        url: `/invoice/freelancer`,
        method: "GET",
      }),
      providesTags: ["myProject"],
    }),
    getMyProjectClient: builder.query({
      query: () => ({
        url: `/invoice/client`,
        method: "GET",
      }),
      providesTags: ["myProject"],
    }),
  }),
});

// Export hooks
export const { useGetMyProjectFreelancerQuery, useGetMyProjectClientQuery } =
  myProjectApi;
