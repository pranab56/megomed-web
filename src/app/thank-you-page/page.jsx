import ThankYouPageLayout from "@/components/common/ThankYouPageLayout";
import React, { Suspense } from "react";

function Loading() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0 space-y-6">
      <div className="animate-pulse">
        <div className="h-[600px] bg-gray-200 rounded-lg"></div>
        <div className="max-w-2xl mx-auto space-y-4 mt-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ThankYouPageLayout />
    </Suspense>
  );
}
