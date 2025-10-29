import { baseApi } from "../../utils/apiBaseQuery";

export const freelancerInfoCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateFreelancerInfo: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/update-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["freelancer"],
    }),
    updateFreelancerInfoCertificate: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/certification-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["freelancer"],
    }),
    deleteCertificate: builder.mutation({
      query: (data) => ({
        url: `/freelancer-info/certification-info`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["freelancer"],
    }),
  }),
});

// Export hooks
export const {
  useUpdateFreelancerInfoMutation,
  useUpdateFreelancerInfoCertificateMutation,
  useDeleteCertificateMutation,
} = freelancerInfoCertificateApi;
