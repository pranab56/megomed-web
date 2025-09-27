import { baseApi } from '../../utils/apiBaseQuery';



export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => ({
        url: "/service-type",
        method: "GET",
      }),
      providesTags: ["services"],
    }),
  })
});

// Export hooks
export const {
  useGetAllServicesQuery
} = servicesApi;
