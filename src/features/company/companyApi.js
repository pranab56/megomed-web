import { baseApi } from "../../utils/apiBaseQuery";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProfile: builder.query({
      query: () => ({
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: ["company"],
    }),
    getCompanyPublicProfile: builder.query({
      query: (id) => {
        return {
          url: `/users/single-user/${id}`,
          method: "GET",
        };
      },
      providesTags: ["company"],
    }),

    updateCompanyProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-my-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["company"],
    }),

    updateCompanyInfo: builder.mutation({
      query: (data) => ({
        url: "/company-info/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["company"],
    }),
    updateCompanySocialLink: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["company"],
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
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useUpdateCompanyInfoMutation,
  useUpdateCompanySocialLinkMutation,
  useGetCompanyPublicProfileQuery,
  useCompanyVerificationRequestMutation,
} = companyApi;
