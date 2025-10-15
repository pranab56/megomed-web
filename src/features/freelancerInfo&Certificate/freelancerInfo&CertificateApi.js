import { baseApi } from "../../utils/apiBaseQuery";

export const freelancerInfoCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateFreelancerInfoCertificate: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/update-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["freelancer"],
    }),
    deleteCertificate: builder.mutation({
      query: (imageUrl) => ({
        url: `/freelancer-info/delete-certificate?imageUrl=${imageUrl}`,
        method: "DELETE",
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
