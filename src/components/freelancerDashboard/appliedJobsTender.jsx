"use client";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import ClientJobTenderPreview from "./freelanderJobTenderPreview";
import {
  useGetAppliedJobsQuery,
  useGetAppliedTendersQuery,
  useJobResponseMessageMutation,
} from "@/features/freelancer/freelancerApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "../ui/badge";
import { FileText, Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { useResponseMessageMutation } from "@/features/tender/tenderApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AppliedJobsTender({ category = "jobs", type = "applied" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();
  const {
    data: appliedJobsData,
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
  } = useGetAppliedJobsQuery();

  const {
    data: appliedTendersData,
    isLoading: isLoadingTenders,
    isError: isErrorTenders,
  } = useGetAppliedTendersQuery();

  // Use the appropriate data based on category
  const currentData =
    category === "jobs" ? appliedJobsData : appliedTendersData;
  const isLoading = category === "jobs" ? isLoadingJobs : isLoadingTenders;
  const isError = category === "jobs" ? isErrorJobs : isErrorTenders;

  const handlePreviewClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "shortlist":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // Filter data based on category and type
  const getFilteredData = () => {
    if (!currentData?.data) return [];

    let filteredData = currentData.data;

    // Filter by type (applied/shortlisted/current)
    if (type === "applied") {
      filteredData = filteredData.filter((item) => item.status === "pending");
    } else if (type === "shortlisted") {
      filteredData = filteredData.filter((item) => item.status === "shortlist");
    } else if (type === "current") {
      filteredData = filteredData.filter((item) => item.status === "accepted");
    } else if (type === "approve") {
      filteredData = filteredData.filter((item) => item.status === "accepted");
    } else if (type === "cancel") {
      filteredData = filteredData.filter((item) => item.status === "cancel");
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const title =
    type === "applied"
      ? `Applied ${category === "jobs" ? "Jobs" : "Tenders"}`
      : type === "shortlisted"
      ? `Shortlisted ${category === "jobs" ? "Jobs" : "Tenders"}`
      : `Current ${category === "jobs" ? "Jobs" : "Tenders"}`;

  const [responseMessage, { isLoading: isResponseMessageLoading }] =
    useResponseMessageMutation();
  const [jobResponseMessage, { isLoading: isJobResponseMessageLoading }] =
    useJobResponseMessageMutation();

  const handleMessageClick = async (application) => {
    try {
      // Determine if it's a tender or job based on the application data
      const isTenderApplication =
        category === "tenders" || application.tenderId;

      // Get the correct ID - either tenderId or jobId
      const applicationId = isTenderApplication
        ? application?._id
        : application._id || application.jobId;

      console.log("Application ID:", applicationId);
      console.log("Is Tender:", isTenderApplication);

      let response;
      if (isTenderApplication) {
        // Use tender API for tenders
        response = await responseMessage(applicationId).unwrap();
      } else {
        // Use job API for jobs
        response = await jobResponseMessage(applicationId).unwrap();
      }

      if (response.success) {
        toast.success("Message sent successfully");

        // Extract the chat ID from response
        const chatId = response.data?._id;

        // Get client/job poster user ID
        const clientUserId = isTenderApplication
          ? application.clientUserId
          : application.jobPosterUserId?._id;

        console.log("Chat ID:", chatId);
        console.log("Client/Job Poster User ID:", clientUserId);
        console.log("Full application data:", application);

        if (chatId && clientUserId) {
          // Redirect to chat with both IDs
          router.push(`/chat/${clientUserId}/${chatId}`);
        } else {
          // Fallback to regular chat route if IDs are not available
          router.push("/chat/");
        }
      }
    } catch (error) {
      console.error("Message error:", error);
      toast.error("Failed to send message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading applied jobs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {filteredData.length}{" "}
          {filteredData.length === 1 ? "application" : "applications"} found
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 mx-auto px-4 md:px-0">
        {filteredData.map((application) => {
          // Handle different data structures for jobs vs tenders
          const isTenderData = category === "tenders";
          const title = isTenderData
            ? "Tender Response"
            : application.jobId?.title;
          const clientName = isTenderData
            ? "Client"
            : application.jobPosterUserId?.fullName;
          const image = isTenderData ? null : application.jobId?.image;
          const location = isTenderData ? "N/A" : application.jobId?.location;
          const duration = isTenderData ? "N/A" : application.jobId?.duration;
          const minBudget = isTenderData
            ? application.amount
            : application.jobId?.min_budget;
          const maxBudget = isTenderData
            ? application.amount
            : application.jobId?.max_budget;
          const price = isTenderData ? application.amount : application.price;

          return (
            <Card
              key={application._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {image && (
                        <img
                          src={getImageUrl(image)}
                          alt={title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-foreground mb-2">
                          {title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {isTenderData
                            ? "Tender Response"
                            : `Client: ${clientName}`}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {location}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {duration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            {isTenderData
                              ? `$${minBudget}`
                              : `$${minBudget} - $${maxBudget}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Applied: {formatDate(application.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {isTenderData ? "Amount: " : "Your Quote: "}${price}
                          </span>
                          {application.uploadDocuments?.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              {application.uploadDocuments.length} document(s)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2 ml-4">
                    <p className="text-xs text-muted-foreground">
                      {isTenderData ? "Invoice ID: " : "Job ID: "}
                      {application._id?.slice(-8)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        className="button-gradient"
                        onClick={() => handlePreviewClick(application)}
                      >
                        View Details
                      </Button>
                      {type === "current" ? (
                        <>
                          {/* <Button className="button-gradient">
                            View Contract
                          </Button>
                          <Button className="button-gradient">
                            Track Progress
                          </Button> */}
                          <Button
                            variant="outline"
                            onClick={() => handleMessageClick(application)}
                            disabled={
                              isResponseMessageLoading ||
                              isJobResponseMessageLoading
                            }
                          >
                            {isResponseMessageLoading ||
                            isJobResponseMessageLoading
                              ? "Sending..."
                              : "Message Client"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleMessageClick(application)}
                          disabled={
                            isResponseMessageLoading ||
                            isJobResponseMessageLoading
                          }
                        >
                          {isResponseMessageLoading ||
                          isJobResponseMessageLoading
                            ? "Sending..."
                            : "Message Client"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredData.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No {title.toLowerCase()} found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      <ClientJobTenderPreview
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jobData={selectedJob}
        category={category}
      />
    </div>
  );
}

export default AppliedJobsTender;
