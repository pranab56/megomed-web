import { baseApi } from '../../utils/apiBaseQuery';



export const freelancerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFreeLancer : builder.query({
      query: () => ({
        url: "/users/all-freelancers",
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),




  })
});

// Export hooks
export const {
  useGetAllFreeLancerQuery
} = freelancerApi;
