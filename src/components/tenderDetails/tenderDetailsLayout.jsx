"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JobTenderSidebar from "../common/JobTenderSidebar";
import JobTenderDetails from "../common/JobTenderDetails";
import { useSingleTenderQuery } from "../../features/tender/tenderApi";

function JobTenderDetailsLayout() {
  const params = useParams();
  const [isClient, setIsClient] = useState(false);

  const { data, isLoading, isError } = useSingleTenderQuery(params?.id, {
    skip: !params?.id,
  });

  // Extract tender data from API response
  const tenderData = data?.data;

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Show loading state on server, content on client
  if (!isClient || isLoading) {
    return (
      <div className="flex flex-col md:flex-row md:items-start gap-x-6 max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 2xl:px-0">
        {/* Sidebar skeleton */}
        <div className="w-full md:max-w-[17rem] flex-1 flex-shrink-0">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        {/* Main Content skeleton */}
        <div className="w-full flex-1 overflow-auto pt-6 md:pt-0">
          <div className="animate-pulse space-y-6">
            {/* Header card skeleton */}
            <div className="h-48 bg-gray-300 rounded-lg"></div>

            {/* Responsibilities card skeleton */}
            <div className="h-64 bg-gray-300 rounded-lg"></div>

            {/* Requirements card skeleton */}
            <div className="h-48 bg-gray-300 rounded-lg"></div>

            {/* Benefits card skeleton */}
            <div className="h-48 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Error loading tender details
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-start gap-x-6 max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-10 2xl:px-0 cls animate-fade-in-up">
      {/* Sidebar */}
      <div className="w-full md:max-w-72 flex-1 flex-shrink-0">
        <JobTenderSidebar jobData={tenderData} />
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 overflow-auto pt-6 md:pt-0">
        <JobTenderDetails jobData={tenderData} />
      </div>
    </div>
  );
}

export default JobTenderDetailsLayout;
