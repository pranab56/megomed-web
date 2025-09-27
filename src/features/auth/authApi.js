import { baseApi } from '../../utils/apiBaseQuery';





export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Signup
    signup: builder.mutation({
      query: (newUser) => ({
        url: "/users/create",
        method: "POST",
        body: newUser,
      }),
    }),

    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email Verification
    verifyOtp: builder.mutation({
      query: ({ value, token }) => ({
        url: "/users/create-user-verify-otp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`, // optional, if you have a token
        },
        body: value, // value should be an object
      }),
    }),


    verifyForgotOtp: builder.mutation({
      query: ({ value, token }) => ({
        url: "/auth/forgot-password-otp-match",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { token }), // only add token if it exists
        },
        body: value,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: (token) => ({
        url: "/otp/resend-otp",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }),
    }),




    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: "/auth/forgot-password-reset",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`, // optional, if you have a token
        },
        body: data, // value should be an object
      }),
    }),




    // change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data
      }),
    }),
  }),
  overrideExisting: true
});

// Export hooks
export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useVerifyForgotOtpMutation
} = authApi;
