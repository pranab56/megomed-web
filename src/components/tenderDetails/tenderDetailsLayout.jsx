import React from "react";
import JobTenderSidebar from "../common/JobTenderSidebar";
import JobTenderDetails from "../common/JobTenderDetails";

function JobTenderDetailsLayout() {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-x-6 max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-10 2xl:px-0 cls">
      {/* Sidebar */}
      <div className="w-full md:max-w-72 flex-1 flex-shrink-0">
        <JobTenderSidebar />
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 overflow-auto pt-6 md:pt-0">
        <JobTenderDetails jobData={null} />
      </div>
    </div>
  );
}

export default JobTenderDetailsLayout;
