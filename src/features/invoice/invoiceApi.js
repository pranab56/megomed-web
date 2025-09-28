import { baseApi } from '../../utils/apiBaseQuery';



export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoice/create-invoice",
        method: "POST",
        body: data
      }),
      providesTags: ["invoice"],
    }),

  })
});

// Export hooks
export const {
  useCreateInvoiceMutation
} = invoiceApi;
