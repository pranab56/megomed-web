"use client";
import { usePrivacyPolicyQuery } from "@/features/policy/policyApi";
import React from "react";

function RefundPolicy() {
  const { data, isLoading, isError } = usePrivacyPolicyQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 2xl:px-0 min-h-[100vh]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 2xl:px-0 min-h-[100vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Refund Policy
          </h1>
          <p className="text-gray-600">
            There was an error loading the refund policy. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  const termsOfServiceContent = data?.data?.termsOfService || "";

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 2xl:px-0 min-h-[100vh]">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>

        {termsOfServiceContent ? (
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: termsOfServiceContent }}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Refund policy content is not available at the moment.
            </p>
            <p className="text-gray-400 mt-2">
              Please check back later or contact support for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RefundPolicy;
