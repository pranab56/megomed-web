"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import provideIcon from "@/utils/IconProvider/provideIcon";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "../../../features/auth/authApi";

const ResetPasswordForm = () => {
  const [token, setToken] = useState(null);

  // Get token from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const resetToken = localStorage.getItem("resetToken");
      setToken(resetToken);
    }
  }, []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const router = useRouter();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validatePassword = (password) => {
    const errors = [];

    // Check minimum length
    if (password.length < 8) {
      errors.push("at least 8 characters");
    }

    // Check for uppercase letter
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("one uppercase letter");
    }

    // Check for lowercase letter
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("one lowercase letter");
    }

    // Check for number
    if (!/(?=.*\d)/.test(password)) {
      errors.push("one number");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const getPasswordMatchStatus = () => {
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? "match" : "no-match";
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value) {
      validatePassword(value);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!validatePassword(password)) {
      setError("Please fix the password requirements below");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      newPassword: password,
      confirmPassword: confirmPassword,
    };

    try {
      const result = await resetPassword({ data, token }).unwrap();

      // Check if we're on the client side before using localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("forgotToken");
      }

      console.log("Reset password response:", result);
      setSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.data?.message || "Failed to reset password");
    }
  };

  const handleBackToLogin = () => {
    router.push(`/auth/login`);
  };

  if (success) {
    return (
      <div className="p-6 sm:p-8">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Password Reset Successfully
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              Your password has been updated successfully. You can now log in
              with your new password.
            </p>
          </div>

          {/* Back to Login */}
          <Button
            variant="outline"
            onClick={handleBackToLogin}
            className="w-full rounded-full h-12 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to log in
          </Button>
        </div>
      </div>
    );
  }

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
            Create a New Password
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Your new password must be different to previously used passwords.
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <Label
              htmlFor="password"
              className="block text-gray-700 font-medium text-sm mb-2"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`rounded-full h-12 px-4 pr-12 ${
                  error && !password ? "border-red-500" : ""
                }`}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {!showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-2 text-xs text-gray-500">
              <p>Password must include:</p>
              <ul className="list-disc list-inside pl-2">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  At least 8 characters {password.length >= 8 && "✓"}
                </li>
                <li
                  className={
                    /(?=.*[A-Z])/.test(password) ? "text-green-600" : ""
                  }
                >
                  One uppercase letter {/(?=.*[A-Z])/.test(password) && "✓"}
                </li>
                <li
                  className={
                    /(?=.*[a-z])/.test(password) ? "text-green-600" : ""
                  }
                >
                  One lowercase letter {/(?=.*[a-z])/.test(password) && "✓"}
                </li>
                <li
                  className={/(?=.*\d)/.test(password) ? "text-green-600" : ""}
                >
                  One number {/(?=.*\d)/.test(password) && "✓"}
                </li>
              </ul>
            </div>
          </div>

          <div className="text-left">
            <Label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium text-sm mb-2"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`rounded-full h-12 px-4 pr-12 ${
                  getPasswordMatchStatus() === "no-match"
                    ? "border-red-500"
                    : getPasswordMatchStatus() === "match"
                    ? "border-green-500"
                    : ""
                }`}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {!showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="mt-2 text-xs">
                {getPasswordMatchStatus() === "match" ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Passwords match
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-xs text-left">{error}</div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || passwordErrors.length > 0}
            className="w-full button-gradient-rounded h-12 font-semibold text-base"
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>

        {/* Back to Login */}
        <Button
          variant="link"
          onClick={handleBackToLogin}
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

export default ResetPasswordForm;
