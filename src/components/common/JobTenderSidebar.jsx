"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useToast from "@/hooks/showToast/ShowToast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Briefcase, Calendar, Globe, MapPin, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { baseURL } from "../../utils/BaseURL";
import { DialogDescription } from "../ui/dialog";
import ShowLoginDialog from "./showLoginDialog/ShowLoginDialog";

function JobTenderSidebar({ jobData }) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isTenderPage = pathname.includes("tenders-details");
  const isLoggedIn = true;
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const currentUser = "EN";
  const userType = currentUser?.type;
  const router = useRouter();
  const [respondedToTender, setRespondedToTender] = useState(false);
  const [respondedToJob, setRespondedToJob] = useState(false);
  const showToast = useToast();

  console.log(jobData);

  const [role, setRole] = useState(null);
  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
    // Get role from localStorage only on client side
    setRole(localStorage.getItem("role")); // client or freelancer
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
  const jobTenderSidebarTranslations = messages?.jobTenderSidebar || {};
  const commonTranslations = messages?.common || {};

  // Map API data to sidebar structure
  const mapSidebarData = (apiData) => {
    if (!apiData) return null;

    return {
      id: apiData._id,
      company: {
        name: apiData.title || "Company",
        logo: apiData.image
          ? `/${apiData.image}`
          : "/jobtender/job_tender_details.png",
        website: apiData.websiteLink || "https://example.com",
      },
      title: apiData.title || "Position",
      jobType: apiData.jobType || "Full-Time",
      totalApply: 20, // Default value since API doesn't have this
      location: "Remote", // Default since API doesn't have location
      datePosted: formatDate(apiData.createdAt),
      startDate: formatDate(apiData.startDate),
      endDate: formatDate(apiData.endDate),
      category: apiData.categoryName || "Not specified",
      serviceType: apiData.serviceTypeName || "Not specified",
    };
  };

  const job = jobData
    ? mapSidebarData(jobData)
    : {
        id: 1,
        company: {
          name: "CONLINE",
          logo: "/jobtender/job_tender_details.png",
          website: "https://example.com",
        },
        title: "CONLINE",
        jobType: "Full Time",
        totalApply: 20,
        location: "Remote",
        datePosted: formatDate(new Date()),
        category: "Front-End Development",
        serviceType: "Graphic Design",
      };

  const handleApplyForThisPosition = () => {
    if (!isLoggedIn) {
      setOpenLoginDialog(true);
    }
  };

  const handleRespondToTender = () => {
    if (respondedToTender) {
      showToast.error(
        jobTenderSidebarTranslations.alreadyRespondedToTenderError ||
          "You have already responded to this tender"
      );
    } else {
      setRespondedToTender(true);
      showToast.success(
        jobTenderSidebarTranslations.tenderRespondedSuccess ||
          "Tender responded successfully",
        {
          description:
            jobTenderSidebarTranslations.tenderRespondedSuccessDescription ||
            "You can now view your response in the tender page",
        }
      );
    }
  };

  const handleRespondToJob = () => {
    // Redirect to the website directly
    window.open(job.company.website, "_blank");
  };

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <Card className="w-full max-w-[17rem] mx-auto bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="text-center p-6 pb-4">
            <div className="w-36 h-36 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded max-w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded max-w-24 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-300 rounded max-w-48 mx-auto"></div>
          </div>

          {/* Content skeleton */}
          <div className="p-6 pt-4 space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="w-full max-w-[17rem] mx-auto bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No job data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full  mx-auto bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardHeader className="text-center p-6 pb-4">
        {/* Company Avatar */}
        <div className="flex justify-center mb-4">
          <Avatar className="w-36 h-36 bg-gray-900">
            <AvatarImage
              src={baseURL + "/" + jobData?.image}
              alt={jobData?.title}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <AvatarFallback className="bg-gray-900 text-white text-lg font-semibold">
              {job.company.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Company Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>

        {/* Website Link */}
        {/* <div className="mb-4">
          <a
            href={job.company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
          >
            <Globe className="w-4 h-4" />
            {jobTenderSidebarTranslations.visitWebsite || "Visit Website"}
          </a>
        </div> */}

        {/* Fixed conditional rendering for buttons */}
        {role !== "client" && (
          <Button
            className={`max-w-60 mx-auto hover:bg-gray-400 text-white font-medium ${
              isTenderPage
                ? respondedToTender
                  ? "bg-gray-500 cursor-not-allowed"
                  : "button-gradient"
                : respondedToJob
                ? "bg-gray-500 cursor-not-allowed"
                : "button-gradient"
            }`}
            onClick={
              isLoggedIn
                ? isTenderPage
                  ? handleRespondToTender
                  : handleRespondToJob
                : handleApplyForThisPosition
            }
          >
            {isTenderPage
              ? respondedToTender
                ? jobTenderSidebarTranslations.respondedButtonText ||
                  "Responded"
                : jobTenderSidebarTranslations.respondToTenderButtonText ||
                  "Respond to Tender"
              : respondedToJob
              ? jobTenderSidebarTranslations.appliedButtonText || "Applied"
              : jobTenderSidebarTranslations.applyForJobButtonText ||
                "Apply for this Job"}
          </Button>
        )}

        <Separator className="mt-4" />
      </CardHeader>

      <CardContent className="p-6 pt-4 space-y-4">
        {/* Job Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.jobTypeLabel || "Job Type"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.jobType}</span>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.categoryLabel || "Category"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.category}</span>
        </div>

        {/* Service Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.serviceTypeLabel || "Service Type"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.serviceType}</span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.locationLabel || "Location"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.location}</span>
        </div>

        {/* Date Posted */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.datePostedLabel || "Date Posted"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.datePosted}</span>
        </div>

        {/* Start Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.startDateLabel || "Start Date"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.startDate}</span>
        </div>

        {/* End Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {jobTenderSidebarTranslations.endDateLabel || "End Date"}
            </span>
          </div>
          <span className="text-sm text-gray-600">{job.endDate}</span>
        </div>
      </CardContent>

      <ShowLoginDialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DialogTitle className="text-2xl font-bold">
          {jobTenderSidebarTranslations.loginDialogTitle ||
            "Login to Apply for this Position"}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          {jobTenderSidebarTranslations.loginDialogDescription ||
            "Please login to apply for this position"}
        </DialogDescription>
        <div className="flex justify-end">
          <Button
            className="button-gradient text-white font-medium w-fit"
            onClick={() => router.push("/login")}
          >
            {jobTenderSidebarTranslations.loginButtonText || "Login"}
          </Button>
        </div>
      </ShowLoginDialog>
    </Card>
  );
}

export default JobTenderSidebar;
