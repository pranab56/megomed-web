import { baseApi } from "../../utils/apiBaseQuery";

export const freelancerInfoCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  useUpdateFreelancerInfoCertificateMutation,
  useDeleteCertificateMutation,
} = freelancerInfoCertificateApi;
