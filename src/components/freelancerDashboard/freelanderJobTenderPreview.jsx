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
import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";
import {
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  User,
} from "lucide-react";

function ClientJobTenderPreview({
  isOpen,
  onClose,
  jobData,
  category = "jobs",
}) {
  const { data: userData } = useGetMyprofileQuery();

  if (!jobData) return null;

  // Determine if this is tender data (invoice data)
  const isTenderData = jobData.invoiceType === "tender";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "PDF";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "IMG";
    if (["doc", "docx"].includes(extension)) return "DOC";
    if (["ppt", "pptx"].includes(extension)) return "PPT";
    if (["xls", "xlsx"].includes(extension)) return "XLS";
    return "FILE";
  };

  const getFileIconColor = (type) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400";
      case "IMG":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
      case "DOC":
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
      case "PPT":
        return "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400";
      case "XLS":
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approve":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "shortlist":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "cancel":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl md:max-w-5xl lg:min-w-6xl max-h-[95vh] ">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl  font-bold text-center">
            {category === "jobs" ? "Job Preview" : "Tender Preview"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h2 className="text-lg lg:text-2xl font-bold text-foreground">
              {isTenderData ? "Tender Response" : jobData.jobId?.title}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground">
              {isTenderData
                ? "Invoice Response"
                : `Client: ${jobData.jobPosterUserId?.fullName}`}
            </p>
            {!isTenderData && (
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {jobData.jobId?.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {jobData.jobId?.duration}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />${jobData.jobId?.min_budget}{" "}
                  - ${jobData.jobId?.max_budget}
                </div>
              </div>
            )}
            <Badge
              variant={
                jobData.status === "pending"
                  ? "default"
                  : jobData.status === "accepted"
                  ? "secondary"
                  : jobData.status === "rejected"
                  ? "destructive"
                  : "default"
              }
              className={`text-sm px-3 py-1 ${getStatusColor(jobData.status)}`}
            >
              {jobData.status === "Pending"
                ? "Pending"
                : jobData.status === "approve"
                ? "Accepted"
                : jobData.status === "shortlist"
                ? "Shortlisted"
                : jobData.status === "cancel"
                ? "Canceled"
                : jobData.status.charAt(0).toUpperCase() +
                  jobData.status.slice(1)}
            </Badge>
          </div>

          {/* Freelancer Profile Section */}

          <div className=" lg:max-h-[65vh] max-h-[55vh] overflow-y-auto">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={
                    userData?.data?.profile
                      ? getImageUrl(userData.data.profile)
                      : "/client/profile/client.png"
                  }
                  alt={userData?.data?.fullName || "Freelancer"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {userData?.data?.fullName || "Freelancer"}
                </h3>
                <p className="text-muted-foreground">
                  {userData?.data?.designation || "Freelancer"}
                </p>
                {userData?.data?.location && (
                  <p className="text-sm text-muted-foreground">
                    📍 {userData.data.location}
                  </p>
                )}
              </div>
            </div>

            {/* Freelancer Proposal Content */}
            <div className="space-y-4">
              {/* Proposal Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {isTenderData ? "Message" : "Cover Message"}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {isTenderData ? jobData.message : jobData.coverMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Documents Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Uploaded Documents
                  </h3>
                  <div className="space-y-3">
                    {jobData.uploadDocuments &&
                    jobData.uploadDocuments.length > 0 ? (
                      jobData.uploadDocuments.map((doc, index) => {
                        const fileType = getFileType(doc);
                        const fileName =
                          doc.split("\\").pop() || doc.split("/").pop();
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded flex items-center justify-center ${getFileIconColor(
                                  fileType
                                )}`}
                              >
                                <span className="text-xs font-bold">
                                  {fileType}
                                </span>
                              </div>
                              <span className="text-sm font-medium">
                                {fileName}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(getImageUrl(doc), "_blank")
                              }
                            >
                              View
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No documents uploaded</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Time and Price Quote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isTenderData && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">
                        Estimated Time
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border text-center">
                        <span className="text-2xl font-bold text-foreground">
                          {jobData.availableDate || "Not specified"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      {isTenderData ? "Amount" : "Your Quote"}
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border text-center">
                      <span className="text-2xl font-bold text-foreground">
                        ${isTenderData ? jobData.amount : jobData.price}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {isTenderData ? "Invoice Details" : "Application Details"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {isTenderData ? "Created:" : "Applied:"}
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(jobData.createdAt)}
                      </span>
                    </div>
                    {!isTenderData && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Client:
                        </span>
                        <span className="text-sm font-medium">
                          {jobData.jobPosterUserId?.fullName}
                        </span>
                      </div>
                    )}
                    {!isTenderData && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Job Budget:
                        </span>
                        <span className="text-sm font-medium">
                          ${jobData.jobId?.min_budget} - $
                          {jobData.jobId?.max_budget}
                        </span>
                      </div>
                    )}
                    {!isTenderData && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Location:
                        </span>
                        <span className="text-sm font-medium">
                          {jobData.jobId?.location}
                        </span>
                      </div>
                    )}
                    {isTenderData && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Amount:
                        </span>
                        <span className="text-sm font-medium">
                          ${jobData.amount}
                        </span>
                      </div>
                    )}
                    {isTenderData && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Date:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(jobData.date)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <Button variant="outline" onClick={onClose} className="px-8">
                Close
              </Button>
              <Button
                className="button-gradient px-8"
                onClick={() => {
                  // Handle message action
                  console.log("Message clicked");
                }}
              >
                Message Client
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClientJobTenderPreview;
