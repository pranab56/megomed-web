import { baseApi } from "../../utils/apiBaseQuery";

export const freelancerInfoCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateFreelancerInfo: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/update-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["clientProfile"],
    }),
    updateFreelancerInfoCertificate: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/certification-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["clientProfile"],
    }),
    deleteCertificate: builder.mutation({
      query: (data) => ({
        url: `/freelancer-info/certification-info`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["clientProfile"],
    }),
  }),
});

// Export hooks
export const {
  useUpdateFreelancerInfoMutation,
  useUpdateFreelancerInfoCertificateMutation,
  useDeleteCertificateMutation,
} = freelancerInfoCertificateApi;
