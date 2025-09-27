"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import provideIcon from "@/utils/IconProvider/provideIcon";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useForgotPasswordMutation } from '../../../features/auth/authApi';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const router = useRouter();

  const [forgotPassword, { isLoading, error: apiError }] = useForgotPasswordMutation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Client-side validation
    if (!email) {
      setValidationError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();
      console.log("Forgot password response: ", response);
      if (response?.success) {
        toast.success(response?.message || "Password reset instructions sent to your email.");
        router.push(`/auth/forgot_verify?token=${response.data.forgetToken}`);
      }
    } catch (error) {
      console.log("error ", error);
      toast.error(error?.data?.message || "something went wrong. Please try again.");
      // API error will be handled by the apiError state from RTK Query
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError("");
  };

  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  // Get error message from API or validation
  const errorMessage = validationError ||
    (apiError?.data?.message ||
      (apiError && "Something went wrong. Please try again."));



  return (
    <div className="p-6 sm:p-8">
      <div className="text-center space-y-6">
        {/* Key Icon */}
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          {provideIcon({ name: "key" })}
        </div>

        {/* Title and Description */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Forgot password?
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <Label
              htmlFor="email"
              className="block text-gray-700 font-medium text-sm mb-2"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className={`rounded-full h-12 px-4 ${errorMessage ? "border-red-500" : ""
                }`}
              autoComplete="email"
              disabled={isLoading}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full button-gradient-rounded h-12 font-semibold text-base"
          >
            {isLoading ? "Sending..." : "Submit"}
          </Button>
        </form>

        {/* Back to Login */}
        <Button
          variant="link"
          onClick={navigateToLogin}
          className="text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to log in
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;