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
  }),
});

// Export hooks
export const { useHireFreelancerMutation } = hireFreelancerApi;
