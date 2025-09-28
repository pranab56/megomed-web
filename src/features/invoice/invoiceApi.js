import { baseApi } from "../../utils/apiBaseQuery";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoice/create-invoice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["invoice"],
    }),
    extendRequest: builder.mutation({
      query: (data) => ({
        url: `/invoice/invoice-extend/${data.invoiceID}`,
        method: "POST",
        body: { extendDate: data.extendDate, extendReason: data.reason },
      }),
      invalidatesTags: ["invoice"],
    }),
    approveExtendRequest: builder.mutation({
      query: (data) => {
        console.log("approveExtendRequest API called with:", data);
        const url = `/invoice/invoice-extend-approve/${data.invoiceID}${
          data.action === "reject" ? "?extendRequest=cancel" : ""
        }`;
        console.log("API URL:", url);
        return {
          url,
          method: "POST",
        };
      },
      invalidatesTags: ["invoice"],
    }),
    acceptRespondInvoice: builder.mutation({
      query: (data) => ({
        url: `/invoice/invoice-approve/${data.invoiceID}`,
        method: "POST",
      }),
      invalidatesTags: ["invoice"],
    }),
    getInvoiceFreelancer: builder.query({
      query: () => ({
        url: "/invoice/freelancer",
        method: "GET",
      }),
      providesTags: ["invoice"],
    }),
    getInvoiceClient: builder.query({
      query: () => ({
        url: "/invoice/client",
        method: "GET",
      }),
      providesTags: ["invoice"],
    }),

    //Stripe Payment
    createStripePayment: builder.mutation({
      query: () => ({
        url: "/payment/create-stripe-account",
        method: "POST",
      }),
      invalidatesTags: ["invoice"],
    }),
  }),
});

// Export hooks
export const {
  useCreateInvoiceMutation,
  useGetInvoiceFreelancerQuery,
  useGetInvoiceClientQuery,
  useExtendRequestMutation,
  useApproveExtendRequestMutation,
  useCreateStripePaymentMutation,
  useAcceptRespondInvoiceMutation,
} = invoiceApi;
