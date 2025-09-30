import { baseApi } from "../../utils/apiBaseQuery";

export const hireFreelancerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    hireFreelancer: builder.mutation({
      query: (freelancerId) => ({
        url: `/users/freelancer-response/${freelancerId}`,
        method: "POST",
      }),
      invalidatesTags: ["hireFreelancer"],
    }),
    followFreelancer: builder.mutation({
      query: (data) => ({
        url: `/follow/create-follow`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["hireFreelancer"],
    }),

    isFollowed: builder.query({
      query: (freelancerId) => ({
        url: `/follow/is-follow/${freelancerId}`,
        method: "GET",
      }),
      providesTags: ["hireFreelancer"],
    }),
  }),
});

// Export hooks
export const {
  useHireFreelancerMutation,
  useFollowFreelancerMutation,
  useIsFollowedQuery,
} = hireFreelancerApi;
