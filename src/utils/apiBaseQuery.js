// utils/apiBaseQuery.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./BaseURL";

// Custom base query that handles 401 responses as errors
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${baseURL}/api/v1`,
    prepareHeaders: (headers, { endpoint }) => {
      let token;

      if (endpoint === "resetPassword") {
        token = localStorage.getItem("forgot-password-otp-token");
        if (token) {
          headers.set("Authorization", token);
        }
      } else {
        token = localStorage.getItem("loginToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  })(args, api, extraOptions);

  // Check if the response is a 401 with auth error
  if (
    result.data &&
    result.data.success === false &&
    result.data.message === "You are not authorized" &&
    result.data.err?.statusCode === 401
  ) {
    return {
      error: {
        status: 401,
        data: result.data,
        originalStatus: 401,
      },
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}), // extended in other files
  tagTypes: [
    "category",
    "services",
    "freelancer",
    "contact",
    "jobBoard",
    "tender",
    "plan",
    "subcription",
    "clientProfile",
    "post",
    "showcaseProject",
    "myProject",
    "invoice",
    "chat",
    "hireFreelancer",
    "message",
    "policy",
    "company",
    "clientDashboard",
    "companyDashboard",
  ], // useful for cache invalidation
});
