import { baseApi } from "../../utils/apiBaseQuery";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlan: builder.query({
      query: (category) => {
        let url = "/package/packages";
        if (category) {
          url += `?category=${category}`;
        }

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["plan"],
    }),

    getPerticularPlan: builder.query({
      query: (id) => ({
        url: `/package/${id}`,
        method: "GET",
      }),
      providesTags: ["plan"],
    }),

    connectStripe: builder.mutation({
      query: () => ({
        url: `/payment/create-stripe-account`,
        method: "POST",
      }),
      invalidatesTags: ["plan"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllPlanQuery,
  useGetPerticularPlanQuery,
  useConnectStripeMutation,
} = planApi;
