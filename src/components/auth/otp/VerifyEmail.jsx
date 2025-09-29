"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../../../features/auth/authApi";

const OTPForm = () => {
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token");
  const [token, setToken] = useState(null);

  // Get token from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const otpToken = localStorage.getItem("otpToken");
      setToken(otpToken);
    }
  }, []);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const countdownRef = useRef(null);
  const router = useRouter();

  // Use Redux Query mutations with their built-in states
  const [verify, { isLoading: verifyLoading, error: verifyError }] =
    useVerifyOtpMutation();
  const [resend, { isLoading: resendLoading, error: resendError }] =
    useResendOtpMutation();

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
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

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtp[i] = digits[i];
        }

        setOtp(newOtp);

        // Focus the next empty input or last input
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
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
        token: token,
      }).unwrap();
      console.log("response", response);
      // router.push("/auth/login")
      if (response?.success) {
        router.push("/auth/login");

        // Check if we're on the client side before using localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("otpToken");
        }

        toast.success(
          response.message || "Email verified successfully. Please log in."
        );
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
      if (token) {
        const response = await resend(token).unwrap();
        toast.success(response.message);
        // Start 1 minute countdown (60 seconds)
        setCountdown(60);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Format countdown time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              If you didn't receive a code,{" "}
              {countdown > 0 ? (
                <span className="text-gray-500">
                  Resend in {formatTime(countdown)}
                </span>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="p-0 h-auto text-blue-600 hover:text-blue-800 font-semibold underline"
                >
                  {resendLoading ? "Sending..." : "Resend"}
                </Button>
              )}
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

export default OTPForm;
