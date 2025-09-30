"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSingleJobsQuery } from "../../features/jobBoard/jobBoardApi";
import JobTenderDetails from "../common/JobTenderDetails";
import JobTenderSidebar from "../common/JobTenderSidebar";

function JobDetailsLayout() {
  const params = useParams();
  const [isClient, setIsClient] = useState(false);

  const { data, isLoading, isError } = useSingleJobsQuery(params?.id, {
    skip: !params?.id,
  });

  // Extract job data from API response
  const jobData = data?.data;

  console.log("Full API Response:", data);
  console.log("Extracted Job Data:", jobData);

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
            Error loading job details
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full md:flex-row md:items-start gap-x-6 max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 2xl:px-0 animate-fade-in-up">
      {/* Sidebar */}
      <div className="w-3/12 md:w-4/12 flex-shrink-0">
        <JobTenderSidebar jobData={jobData} />
      </div>

      {/* Main Content */}
      <div className="w-9/12 md:w-8/12 pt-6 md:pt-0">
        <JobTenderDetails jobData={jobData} />
      </div>
    </div>
  );
}

export default JobDetailsLayout;
