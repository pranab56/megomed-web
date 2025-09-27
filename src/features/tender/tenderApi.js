import { baseApi } from '../../utils/apiBaseQuery';

export const tenderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTender: builder.mutation({
      query: (data) => ({
        url: "/tender/create-tender",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["tender"],
    }),


    getAllTenderByClient : builder.query({
      query: ({ categoryName , serviceTypeName, searchTerm }) => {
        let url = `/tender/me?`;
        if(categoryName) {
          url += `categoryName=${categoryName}&`;
        }
        if(serviceTypeName) {
          url += `serviceTypeName=${serviceTypeName}&`;
        }
        if(searchTerm) {
          url += `searchTerm=${searchTerm}&`;
        }
       return {
        url: url,
        method: "GET",
        }
      },
      providesTags: ["tender"],
    }),

      getAllTender : builder.query({
       query: ({ categoryName , serviceTypeName, searchTerm }) => {
        let url = `/tender?`;
        // `/jobs/me?categoryName=${categoryName}&serviceTypeName=${serviceTypeName}&searchTerm=${searchTerm}`,
        if(categoryName) {
          url += `categoryName=${categoryName}&`;
        }
        if(serviceTypeName) {
          url += `serviceTypeName=${serviceTypeName}&`;
        }
        if(searchTerm) {
          url += `searchTerm=${searchTerm}&`;
        }
       return {
        url: url,
        method: "GET",
        }
      },
      providesTags: ["tender"],
    }),



    

  })
});

// Export hooks
export const {
  useCreateTenderMutation,
  useGetAllTenderByClientQuery,
  useGetAllTenderQuery
} = tenderApi;