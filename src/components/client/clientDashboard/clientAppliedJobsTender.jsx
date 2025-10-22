import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientJobTenderPreview from "./clientJobTenderPreview";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/getImageUrl";
import { useClientJobSortingMutation } from "@/features/clientDashboard/clientDashboardApi";
import toast from "react-hot-toast";

export function ClientAppliedJobsTender({
  category = "jobs",
  type = "applied",
  items = [],
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [clientJobSorting, { isLoading: isSorting }] =
    useClientJobSortingMutation();

  const handleSorting = async (applicationId, status) => {
    try {
      const response = await clientJobSorting({ jobID: applicationId, status });
      if (response.data) {
        toast.success("Application status updated successfully");
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      toast.error("Failed to update application status");
    }
  };

  const handlePreviewClick = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {category === "jobs" ? "Job" : "Tender"}{" "}
          {type.charAt(0).toUpperCase() + type.slice(1)} Proposals
        </h3>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} found
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 mx-auto md:px-0">
        {items.map((application, index) => {
          const jobOrTender = application.jobId || application.tenderId;
          const freelancer = application.freelancerUserId;

          return (
            <Card
              key={application._id || index}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-8">
                      <Avatar className="h-10 w-10">
                        {freelancer?.profile ? (
                          <AvatarImage
                            src={getImageUrl(freelancer.profile)}
                            alt={freelancer.fullName}
                          />
                        ) : (
                          <AvatarFallback>
                            {freelancer?.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h4 className="text-lg font-medium text-foreground">
                          {freelancer?.fullName || "Unknown Freelancer"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {freelancer?.role || "Freelancer"}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      {jobOrTender?.title || "Untitled Project"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category === "jobs"
                        ? "Job Category: "
                        : "Tender Category: "}
                      {jobOrTender?.categoryName || "Uncategorized"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          type === "applied"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : type === "shortlisted"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : type === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>

                      {application.price && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          ${application.price}
                        </span>
                      )}

                      {application.availableDate && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          Available: {application.availableDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-left md:text-right space-y-4 mt-4 md:mt-0">
                    <p className="text-xs text-muted-foreground">
                      Application ID: #
                      {application._id?.substring(0, 6) || "N/A"}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        className="button-gradient"
                        onClick={() => handlePreviewClick(application)}
                      >
                        Preview
                      </Button>
                      <Button className="button-gradient">Message</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 md:mt-8">
                      {type === "applied" && (
                        <>
                          <Button
                            className="button-gradient"
                            onClick={() =>
                              handleSorting(application._id, "shortlist")
                            }
                            disabled={isSorting}
                          >
                            {isSorting ? "Processing..." : "Shortlist"}
                          </Button>
                          <Button
                            className="button-gradient"
                            onClick={() =>
                              handleSorting(application._id, "accept")
                            }
                            disabled={isSorting}
                          >
                            {isSorting ? "Processing..." : "Accept"}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleSorting(application._id, "rejected")
                            }
                            disabled={isSorting}
                          >
                            {isSorting ? "Processing..." : "Reject"}
                          </Button>
                        </>
                      )}

                      {type === "shortlisted" && (
                        <>
                          <Button
                            className="button-gradient"
                            onClick={() =>
                              handleSorting(application._id, "accept")
                            }
                            disabled={isSorting}
                          >
                            {isSorting ? "Processing..." : "Accept"}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleSorting(application._id, "rejected")
                            }
                            disabled={isSorting}
                          >
                            {isSorting ? "Processing..." : "Reject"}
                          </Button>
                        </>
                      )}

                      {/* {type === "accepted" && (
                        <Button className="button-gradient">
                          View Contract
                        </Button>
                      )} */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {items.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No {category === "jobs" ? "job" : "tender"} proposals with
                status "{type}" found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      <ClientJobTenderPreview
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        applicationData={selectedApplication}
        category={category}
      />
    </div>
  );
}

export default ClientAppliedJobsTender;
