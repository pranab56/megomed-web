import { baseApi } from "../../utils/apiBaseQuery";

export const clientProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyprofile: builder.query({
      query: () => ({
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: ["clientProfile"],
    }),
    getFreelancerPublicProfile: builder.query({
      query: (id) => {
        console.log("Freelancer ID:", id);
        return {
          url: `/users/single-freelancer/${id}`,
          method: "GET",
        };
      },
      providesTags: ["clientProfile"],
    }),

    updateMyprofile: builder.mutation({
      query: (data) => ({
        url: "/users/update-my-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["clientProfile"],
    }),

    updateProfileInfo: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["clientProfile"],
    }),
    updateSocialLink: builder.mutation({
      query: (data) => ({
        url: "/freelancer-info/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["clientProfile"],
    }),
  }),
});

// Export hooks
export const {
  useGetMyprofileQuery,
  useGetFreelancerPublicProfileQuery,
  useUpdateMyprofileMutation,
  useUpdateProfileInfoMutation,
  useUpdateSocialLinkMutation,
} = clientProfileApi;
