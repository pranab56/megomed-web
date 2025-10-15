import { baseApi } from "../../utils/apiBaseQuery";

export const freelancerInfoCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFreeLancer: builder.query({
      query: (designation) => {
        let url = "/users/all-freelancers";
        if (designation) {
          url += `?designation=${designation}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["freelancer"],
    }),

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
  useGetAllFreeLancerQuery,
  useUpdateFreelancerInfoCertificateMutation,
  useDeleteCertificateMutation,
} = freelancerInfoCertificateApi;
