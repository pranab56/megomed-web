import { baseApi } from '../../utils/apiBaseQuery';

export const subcriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    mySubcription: builder.query({
      query: (running) => {
        let url = '/subscription';
        if (running !== undefined) {
          url += `?running=${running}`;
        }
        return {
          url: url,
          method: "GET",
        }
      },
      providesTags: ["subcription"],
    }),

    createSubcription: builder.mutation({
      query: (id) => ({
        url: `/subscription/create-subscription`,
        method: "POST",
        body: { packageId: id },
      }),
      invalidatesTags: ["subcription"],
    }),

    subcriptionReneiew: builder.mutation({
      query: (id) => ({
        url: `/payment/subscription-renewal/${id}`,
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }),
      invalidatesTags: ["subcription"], // Changed from providesTags to invalidatesTags
    }),

  })
});

// Export hooks
export const {
  useMySubcriptionQuery,
  useCreateSubcriptionMutation,
  useSubcriptionReneiewMutation
} = subcriptionApi;