import { baseApi } from '../../utils/apiBaseQuery';



export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: ["category"],
    }),




  })
});

// Export hooks
export const {
  useGetAllCategoryQuery
} = categoryApi;
