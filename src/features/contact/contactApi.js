import { baseApi } from "../../utils/apiBaseQuery";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (data) => ({
        url: "/contact-us/create-contact",
        method: "POST",
        body: data,
      }),
      providesTags: ["contact"],
    }),
  }),
});

// Export hooks
export const { useCreateContactMutation } = contactApi;
