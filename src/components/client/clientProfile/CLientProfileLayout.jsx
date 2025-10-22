"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientProfile from "./ClientProfile";
import ProjectList from "./ProjectList";

function ClientProfileLayout() {
  const [error, setError] = useState(null);
  const router = useRouter();

  console.log("ClientProfileLayout error:", error);

  // Handle authorization errors at layout level
  useEffect(() => {
    if (error) {
      console.log("=== LAYOUT ERROR HANDLING ===");
      console.log("Error object:", error);
      console.log("Error status:", error?.status);
      console.log("Error data:", error?.data);

      // Check if it's an authorization error
      const errorData = error?.data;
      const isAuthError =
        error?.status === 401 ||
        error?.originalStatus === 401 ||
        error?.status === "FETCH_ERROR" ||
        errorData?.message === "You are not authorized" ||
        errorData?.err?.statusCode === 401 ||
        (errorData?.success === false && errorData?.err?.statusCode === 401);

      console.log("Layout isAuthError:", isAuthError);

      if (isAuthError) {
        console.log("🚨 LAYOUT: REDIRECTING TO UNAUTHORIZED PAGE...");
        if (typeof window !== "undefined") {
          window.location.href = "/unauthorized";
        }
      }
    }
  }, [error, router]);

  if (error) {
    // Check if it's an authorization error for immediate redirect
    const errorData = error?.data;
    const isAuthError =
      error?.status === 401 ||
      error?.originalStatus === 401 ||
      error?.status === "FETCH_ERROR" ||
      errorData?.message === "You are not authorized" ||
      errorData?.err?.statusCode === 401 ||
      (errorData?.success === false && errorData?.err?.statusCode === 401);

    if (isAuthError) {
      // Immediate redirect for auth errors
      if (typeof window !== "undefined") {
        window.location.href = "/unauthorized";
      }

      return (
        <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
          <div className="text-center py-8">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Access Denied
            </h2>
            <p className="text-red-500 mb-4">
              You are not authorized to view this client profile.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to unauthorized page...
            </p>
            <button
              onClick={() => (window.location.href = "/unauthorized")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go to Unauthorized Page
            </button>
          </div>
        </div>
      );
    }

    // Handle other types of errors
    return (
      <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-500 mb-4">
            {error?.data?.message ||
              error?.message ||
              "Failed to load client profile. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <ClientProfile setError={setError} />
      <ProjectList />
    </div>
  );
}

export default ClientProfileLayout;
