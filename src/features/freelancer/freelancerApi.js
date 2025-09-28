import { baseApi } from '../../utils/apiBaseQuery';



export const freelancerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFreeLancer: builder.query({
      query: (designation) => {
        let url = "/users/all-freelancers";
        if (designation) {
          url += `?designation=${designation}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["freelancer"],
    }),



    getTopFreeLancer: builder.query({
      query: () => ({
        url: "/users/all-freelancers?freelancer=top",
        method: "GET",
      }),
      providesTags: ["freelancer"],
    }),

  })
});

// Export hooks
export const {
  useGetAllFreeLancerQuery,
  useGetTopFreeLancerQuery
} = freelancerApi;
