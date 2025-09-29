"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  useResendOtpMutation,
  useVerifyForgotOtpMutation,
} from "../../../features/auth/authApi";

const ForgotVerify = () => {
  const [token, setToken] = useState(null);

  // Get token from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const forgotToken = localStorage.getItem("forgotToken");
      setToken(forgotToken);
      console.log(forgotToken);
    }
  }, []);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Use Redux Query mutations with their built-in states
  const [verify, { isLoading: verifyLoading, error: verifyError }] =
    useVerifyForgotOtpMutation();
  const [resend, { isLoading: resendLoading, error: resendError }] =
    useResendOtpMutation();

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (digits.length > 0) {
      const newOtp = [...otp];

      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }

      setOtp(newOtp);

      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      // Use local validation error instead of Redux Query error
      return;
    }

    try {
      const response = await verify({
        value: { otp: otpValue },
        token,
      }).unwrap();
      console.log("response", response);
      // router.push("/auth/login")
      if (response?.success) {
        // Store token in localStorage instead of URL
        if (typeof window !== "undefined") {
          localStorage.setItem("resetToken", response.data.forgetOtpMatchToken);
        }

        router.push("/auth/reset-password");
        toast.success("Email verified successfully. Please log in.");
      }
      // Handle successful verification (e.g., redirect user)
    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message || "Verification failed. Please try again."
      );
      // Error is already handled by Redux Query's error state
    }
  };

  const handleResend = async () => {
    try {
      const response = await resend(token).unwrap();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Get error message from either mutation
  const errorMessage = verifyError?.data?.message || resendError?.data?.message;

  return (
    <div className="p-6 sm:p-8">
      <div className="text-center space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Enter the Verification Code
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            For Verify Your Email
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`
                  w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold 
                  rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  ${errorMessage ? "border-red-500" : "border-gray-300"}
                  ${digit ? "border-blue-500 bg-blue-50" : ""}
                `}
                autoComplete="off"
                disabled={verifyLoading} // Disable inputs during verification
              />
            ))}
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              If you didn't receive a code,{" "}
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={resendLoading}
                className="p-0 h-auto text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                {resendLoading ? "Sending..." : "Resend"}
              </Button>
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={verifyLoading || otp.join("").length !== 6}
              className="w-60 button-gradient-rounded h-12 font-semibold text-base"
            >
              {verifyLoading ? "Verifying..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotVerify;
