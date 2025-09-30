"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Copy, Share2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import ShowLoginDialog from "./showLoginDialog/ShowLoginDialog";

function JobTenderDetails({ jobData }) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isTenderPage = pathname.includes("tenders-details");
  const isLoggedIn = true;
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const router = useRouter();

  console.log("job data", jobData);

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get translations
  const messages = "EN";
  const jobDetailsTranslations = messages?.jobDetails || {};
  const commonTranslations = messages?.common || {};

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 mb-6 2xl:mb-10">
        {/* Header Section skeleton */}
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded-lg"></div>
        </div>
        {/* Other skeletons... */}
      </div>
    );
  }

  // Map API data to component structure
  const mapJobData = (apiData) => {
    if (!apiData) return null;

    return {
      title: apiData.title || "No Title",
      description: apiData.description || "No description available",
      fullDescription: apiData.description
        ? [apiData.description]
        : ["No detailed description available"],
      responsibilities: apiData.description
        ? ["Key responsibilities include:", apiData.description]
        : ["Responsibilities not specified"],
      requirements: [
        `Job Type: ${apiData.jobType || "Not specified"}`,
        `Service Type: ${apiData.serviceTypeName || "Not specified"}`,
        `Category: ${apiData.categoryName || "Not specified"}`,
        `Duration: ${formatDate(apiData.startDate)} - ${formatDate(
          apiData.endDate
        )}`,
      ],
      benefits: [
        "Full-time position",
        "Professional development opportunities",
        "Competitive compensation",
      ],
      // For tender data
      startDate: formatDate(apiData.startDate),
      endDate: formatDate(apiData.endDate),
      postedOn: formatDate(apiData.createdAt),
      deadLine: formatDate(apiData.endDate), // Using endDate as deadline
      location: "Remote", // Default since API doesn't have location
      role: apiData.serviceTypeName || "Professional",
    };
  };

  const job = jobData ? mapJobData(jobData) : null;

  console.log("JobTenderDetails - Raw jobData:", jobData);
  console.log("JobTenderDetails - Mapped job:", job);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        console.log("Copied!");
        // You can replace this with a toast notification
      } else {
        // Fallback for browsers without clipboard API
        const input = document.createElement("input");
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        toast.success("Copied Successfully");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error(`not copying I thing Some problem`);
    }
  };

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 mb-6 2xl:mb-10">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700">No job data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 mb-6 2xl:mb-10">
      {/* Single Card with All Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {isTenderPage
                  ? jobDetailsTranslations.tenderDetailsLabel ||
                    "Tender Details"
                  : jobDetailsTranslations.jobDetailsLabel || "Job Details"}
              </p>
              <div className="flex gap-2 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-9 flex items-center gap-2 button-gradient"
                >
                  <Copy />
                  {jobDetailsTranslations.copyLinkButton || "Copy Link"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-9 flex items-center gap-2 button-gradient"
                >
                  <Share2 size={15} />
                  {jobDetailsTranslations.shareButton || "Share"}
                </Button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              {job.role && <p className="text-lg text-gray-600">{job.role}</p>}
            </div>

            <div className="flex gap-2 lg:block">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 flex items-center gap-2 button-gradient"
              >
                <Copy />
                {jobDetailsTranslations.copyLinkButton || "Copy Link"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </CardContent>
      </Card>

      {/* Important Dates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            {jobDetailsTranslations.importantDatesTitle || "Important Dates"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">
                  {jobDetailsTranslations.startDateLabel || "Start Date"}:
                </span>{" "}
                {job.startDate || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">
                  {jobDetailsTranslations.endDateLabel || "End Date"}:
                </span>{" "}
                {job.endDate || "N/A"}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">
                  {jobDetailsTranslations.postedOnLabel || "Posted On"}:
                </span>{" "}
                {job.postedOn || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">
                  {jobDetailsTranslations.deadlineLabel || "Deadline"}:
                </span>{" "}
                {job.deadLine || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShowLoginDialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DialogTitle className="text-2xl font-bold">
          {jobDetailsTranslations.loginDialogTitle ||
            "Login to Apply for this Position"}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          {jobDetailsTranslations.loginDialogDescription ||
            "Please login to apply for this position"}
        </DialogDescription>
        <div className="flex justify-end">
          <Button
            className="button-gradient text-white font-medium w-fit"
            onClick={() => router.push("/auth/login")}
          >
            {jobDetailsTranslations.loginButtonText || "Login"}
          </Button>
        </div>
      </ShowLoginDialog>
    </div>
  );
}

export default JobTenderDetails;
