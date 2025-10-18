import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/getImageUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ClientJobTenderPreview({
  isOpen,
  onClose,
  applicationData,
  category = "jobs",
}) {
  if (!applicationData) return null;

  // Extract data from application object
  const freelancer = applicationData.freelancerUserId || {};
  const jobOrTender = applicationData.jobId || applicationData.tenderId || {};

  // Map status to display format
  const getStatusDisplay = (status) => {
    if (status === "shortlist") return "Shortlisted";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get file extension/type for document display
  const getFileType = (filename) => {
    if (!filename) return "FILE";
    const ext = filename.split(".").pop().toUpperCase();
    return ext.length <= 4 ? ext : "FILE";
  };

  // Get color for file type
  const getFileColor = (type) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400";
      case "DOC":
      case "DOCX":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400";
      case "XLS":
      case "XLSX":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400";
      case "PPT":
      case "PPTX":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400";
      case "JPG":
      case "JPEG":
      case "PNG":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Extract document filename from path
  const getFileName = (path) => {
    if (!path) return "Unknown file";
    const parts = path.split("\\");
    return parts[parts.length - 1];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl md:max-w-5xl lg:min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {category === "jobs"
              ? "Job Application Preview"
              : "Tender Application Preview"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {jobOrTender.title || "Untitled Project"}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {jobOrTender.categoryName || "Uncategorized"}
              </Badge>
              <Badge
                variant={
                  applicationData.status === "applied"
                    ? "default"
                    : applicationData.status === "shortlist"
                    ? "secondary"
                    : applicationData.status === "accepted"
                    ? "success"
                    : "destructive"
                }
                className="text-sm px-3 py-1"
              >
                {getStatusDisplay(applicationData.status)}
              </Badge>
              {applicationData.price && (
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 bg-green-50"
                >
                  ${applicationData.price}
                </Badge>
              )}
            </div>
          </div>

          {/* Freelancer Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <Avatar className="h-16 w-16">
              {freelancer?.profile ? (
                <AvatarImage src={getImageUrl(freelancer.profile)} />
              ) : (
                <AvatarFallback className="text-2xl font-bold">
                  {freelancer?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {freelancer?.fullName || "Unknown Freelancer"}
              </h3>
              <p className="text-muted-foreground">{freelancer?.email || ""}</p>
              {applicationData.availableDate && (
                <p className="text-sm text-blue-600">
                  Available in: {applicationData.availableDate}
                </p>
              )}
            </div>
          </div>

          {/* Freelancer Proposal Content */}
          <div className="space-y-6">
            {/* Cover Message Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Cover Message</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border whitespace-pre-wrap">
                  <p className="text-muted-foreground">
                    {applicationData.coverMessage ||
                      "No cover message provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upload Documents Section */}
            {applicationData.uploadDocuments &&
              applicationData.uploadDocuments.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Uploaded Documents
                    </h3>
                    <div className="space-y-3">
                      {applicationData.uploadDocuments.map((doc, index) => {
                        const fileName = getFileName(doc);
                        const fileType = getFileType(fileName);
                        const colorClass = getFileColor(fileType);

                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                          >
                            <div
                              className={`w-8 h-8 ${colorClass} rounded flex items-center justify-center`}
                            >
                              <span className="text-xs font-bold">
                                {fileType}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {fileName}
                            </span>
                            <a
                              href={getImageUrl(doc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Estimated Time and Price Quote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Availability</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border text-center">
                    <span className="text-2xl font-bold text-foreground">
                      {applicationData.availableDate || "Not specified"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Price Quote</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border text-center">
                    <span className="text-2xl font-bold text-foreground">
                      ${applicationData.price || "Not specified"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Project Details
          {jobOrTender.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  Project Description
                </h3>
                <div
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border"
                  dangerouslySetInnerHTML={{ __html: jobOrTender.description }}
                />
              </CardContent>
            </Card>
          )} */}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button variant="outline" onClick={onClose} className="px-8">
              Close
            </Button>
            <Button
              className="button-gradient px-8"
              onClick={() => {
                console.log("Message clicked");
                // Handle message action
              }}
            >
              Message Freelancer
            </Button>

            {applicationData.status === "applied" && (
              <>
                <Button
                  className="button-gradient px-8"
                  onClick={() => {
                    console.log("Shortlist clicked");
                    // Handle shortlist action
                  }}
                >
                  Shortlist
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  onClick={() => {
                    console.log("Accept clicked");
                    // Handle accept action
                  }}
                >
                  Accept
                </Button>
              </>
            )}

            {applicationData.status === "shortlist" && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                onClick={() => {
                  console.log("Accept clicked");
                  // Handle accept action
                }}
              >
                Accept
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClientJobTenderPreview;
