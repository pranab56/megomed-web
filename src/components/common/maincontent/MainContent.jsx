"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useState } from "react";
import FilterDrawer from "../FilterDrawer";
import JobTenderCard from "../JobTenderCard";

function MainContent({ type = "job", jobs = [], isLoading, isError }) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(6);
  const [sortOption, setSortOption] = useState("newest"); // Added state for sorting

  // Get translations from Redux (placeholder)
  const messages = "EN";
  const mainContentTranslations = messages?.mainContent || {};
  const commonTranslations = messages?.common || {};

  // Apply sorting locally on the client side.
  // This is a simple example. For large datasets, sorting should be done on the server.
  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Apply pagination
  const itemsToDisplay = sortedJobs.slice(0, displayedItems);

  const handleLoadMore = async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDisplayedItems((prev) => prev + 6);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setDisplayedItems(6); // Reset pagination when sort changes
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-6">
        <div className="text-center text-red-500">
          Failed to load jobs. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {type === "job"
                ? mainContentTranslations.jobBoardTitle || "Job Board"
                : mainContentTranslations.tendersTitle || "Tenders"}
            </h1>
            <p className="text-gray-600 mt-1">
              {type === "job"
                ? mainContentTranslations.jobBoardSubtitle ||
                "Find the perfect opportunities that match your skills"
                : mainContentTranslations.tendersSubtitle ||
                "Explore available tenders and submit your proposals"}
            </p>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 button-gradient lg:hidden"
          >
            <Filter className="w-4 h-4" />
            {mainContentTranslations.filterButton || "Filter"}
          </Button>
          {/* Results count, filter button and sorting */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {mainContentTranslations.showingResults || "Showing"}{" "}
              {itemsToDisplay.length} of {jobs.length} {mainContentTranslations.resultsText || "results"}
            </span>

            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    mainContentTranslations.sortByPlaceholder || "Sort by"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  {mainContentTranslations.sortNewest || "Newest First"}
                </SelectItem>
                <SelectItem value="oldest">
                  {mainContentTranslations.sortOldest || "Oldest First"}
                </SelectItem>
                {/* You can add budget sorting if your Job object has a 'budget' field */}
                {/* <SelectItem value="budget-high">
                  {mainContentTranslations.sortBudgetHigh || "Highest Budget"}
                </SelectItem>
                <SelectItem value="budget-low">
                  {mainContentTranslations.sortBudgetLow || "Lowest Budget"}
                </SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mx-auto px-4 md:px-0">
        {itemsToDisplay.map((job) => (
          <JobTenderCard
            key={job._id} // Use the unique _id from your API
            type={type}
            data={job} // Pass the entire job object
            className="h-full"
          />
        ))}
      </div>

      {/* Empty State - Show when no jobs available */}
      {itemsToDisplay.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {mainContentTranslations.noJobsFoundTitle || "No jobs found"}
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            {mainContentTranslations.noJobsFoundDescription ||
              "Try adjusting your filters or check back later for new opportunities"}
          </p>
        </div>
      )}

      {/* Load More Button - For pagination */}
      {itemsToDisplay.length > 0 && displayedItems < jobs.length && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-6 py-3"
          >
            {`Load More ${type === "job" ? "Jobs" : "Tenders"}`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default MainContent;