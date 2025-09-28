// utils/apiBaseQuery.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./BaseURL";

export const baseApi = createApi({
  reducerPath: "",
  baseQuery: fetchBaseQuery({
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
  }),
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
    "invoice"
  ], // useful for cache invalidation
});
