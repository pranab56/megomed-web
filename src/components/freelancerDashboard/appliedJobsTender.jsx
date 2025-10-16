import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import ClientJobTenderPreview from "./freelanderJobTenderPreview";
import { useGetAppliedJobsQuery } from "@/features/freelancer/freelancerApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "../ui/badge";
import { FileText, Calendar, DollarSign, MapPin, Clock } from "lucide-react";

export function AppliedJobsTender({ category = "jobs", type = "applied" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const {
    data: appliedJobsData,
    isLoading,
    isError,
  } = useGetAppliedJobsQuery();

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
  // Filter data based on type
  const getFilteredData = () => {
    if (!appliedJobsData?.data) return [];

    if (type === "applied") {
      return appliedJobsData.data.filter((job) => job.status === "Pending");
    } else if (type === "shortlist") {
      return appliedJobsData.data.filter((job) => job.status === "Shortlisted");
    } else if (type === "approve") {
      return appliedJobsData.data.filter((job) => job.status === "Accepted");
    } else if (type === "cancel") {
      return appliedJobsData.data.filter((job) => job.status === "Canceled");
    }
    return appliedJobsData.data;
  };

  const filteredData = getFilteredData();
  const title = type === "applied" ? "Applied Jobs" : "Shortlisted Jobs";

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
        {filteredData.map((application) => (
          <Card
            key={application._id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {application.jobId?.image && (
                      <img
                        src={getImageUrl(application.jobId.image)}
                        alt={application.jobId.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-foreground mb-2">
                        {application.jobId?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Client: {application.jobPosterUserId?.fullName}
                      </p>

                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {application.jobId?.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {application.jobId?.duration}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4" />$
                          {application.jobId?.min_budget} - $
                          {application.jobId?.max_budget}
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
                          Your Quote: ${application.price}
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
                    Job ID: {application.jobId?._id?.slice(-8)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="button-gradient"
                      onClick={() => handlePreviewClick(application)}
                    >
                      View Details
                    </Button>
                    <Button variant="outline">Message Client</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
