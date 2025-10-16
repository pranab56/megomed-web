import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useFreelancerProposalMutation } from "@/features/freelancer/freelancerApi";
import toast from "react-hot-toast";

function ProposalModalJobTender({ open, onOpenChange, jobId, type }) {
  const pathname = usePathname();
  const isTenderPage = pathname.includes("tenders-details");
  const [freelancerProposal, { isLoading: isProposing }] =
    useFreelancerProposalMutation();
  // Determine if it's a tender based on type prop or pathname
  const isTender = type === "tender" || isTenderPage;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      jobId: jobId,
      coverMessage: "",
      estimatedTime: "",
      price: "",
      uploadDocuments: [],
    },
  });

  const [uploadDocuments, setUploadDocuments] = useState([]);

  const handleFileUpload = (event, onChange) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map((file) => ({
      name: file.name,
      type: getFileType(file.type),
      file: file,
    }));

    const updatedDocuments = [...uploadDocuments, ...newDocuments];
    setUploadDocuments(updatedDocuments);
    onChange(updatedDocuments);
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("image")) return "IMG";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "DOC";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
      return "PPT";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return "XLS";
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

  const removeDocument = (index, onChange) => {
    const updatedDocuments = uploadDocuments.filter((_, i) => i !== index);
    setUploadDocuments(updatedDocuments);
    onChange(updatedDocuments);
  };

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);

    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add text fields
      formData.append("coverMessage", data.coverMessage);
      formData.append("availableDate", data.estimatedTime);
      formData.append("price", data.price);
      formData.append("jobId", data.jobId);

      // Add documents as array of files
      if (data.uploadDocuments && data.uploadDocuments.length > 0) {
        data.uploadDocuments.forEach((doc) => {
          formData.append("uploadDocuments", doc.file);
        });
      }

      const result = await freelancerProposal(formData).unwrap();
      console.log("Result:", result);
      toast.success("Proposal submitted successfully!");
      reset();
      setUploadDocuments([]);
      onOpenChange(false);
    } catch (error) {
      // console.error("Error submitting proposal:", error);

      // Extract error message from different possible error structures
      let errorMessage = "Failed to submit proposal. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.errorSources?.[0]?.message) {
        errorMessage = error.data.errorSources[0].message;
      }

      toast.error(errorMessage);
    }
  };

  if (!open) {
    console.log("Modal is closed, not rendering");
    return null;
  }

  console.log("Modal is open, rendering content");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl md:max-w-4xl lg:min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Apply to {isTender ? "Tender" : "Job"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Freelancer Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">RG</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Robin Gibson
              </h3>
              <p className="text-muted-foreground">Data Analytics Engineer</p>
            </div>
          </div>

          {/* Proposal Section */}
          <Card>
            <CardContent>
              <h3 className="font-semibold text-lg mb-4">Proposal*</h3>
              <Controller
                name="coverMessage"
                control={control}
                rules={{
                  required: "Prosposal is required",
                  minLength: {
                    value: 10,
                    message: "Prosposal Message must be at least 10 characters",
                  },
                }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="My approach involves thorough data analysis, advanced modeling techniques, and clear reporting..."
                    className="min-h-[100px] resize-none"
                  />
                )}
              />
              {errors.coverMessage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coverMessage.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upload Documents Section */}
          <Card>
            <CardContent>
              <h3 className="font-semibold text-lg mb-4">Upload Documents</h3>

              {/* File Upload Button */}
              <Controller
                name="uploadDocuments"
                control={control}
                rules={{
                  required: "At least one document is required",
                }}
                render={({ field: { onChange } }) => (
                  <div className="mb-4">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept=".pdf,.pptx,.ppt,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, onChange)}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Choose Files
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepted formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX,
                      JPG, PNG, WEBP
                    </p>
                    {errors.uploadDocuments && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.uploadDocuments.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Uploaded Documents */}
              <div className="space-y-3">
                {uploadDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${getFileIconColor(
                          doc.type
                        )}`}
                      >
                        <span className="text-xs font-bold">{doc.type}</span>
                      </div>
                      <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                    <Controller
                      name="uploadDocuments"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index, onChange)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    />
                  </div>
                ))}

                {/* Show message when no documents uploaded */}
                {uploadDocuments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs mt-1">
                      Click "Choose Files" to upload your documents
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estimated Time and Price Quote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-lg mb-4">Estimated Time*</h3>
                <div className="space-y-3">
                  <Controller
                    name="estimatedTime"
                    control={control}
                    rules={{
                      required: "Estimated time is required",
                      pattern: {
                        value: /^\d+\s+(days?|weeks?|months?)$/i,
                        message:
                          "Please enter time in format: '3 days', '2 weeks', or '1 month'",
                      },
                    }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Input
                          {...field}
                          placeholder="e.g., 3 days, 2 weeks, 1 month"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const timeValue =
                                field.value.match(/^\d+/)?.[0] || "";
                              field.onChange(`${timeValue} days`);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              field.value.includes("days")
                                ? "gradient text-primary-foreground"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Days
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const timeValue =
                                field.value.match(/^\d+/)?.[0] || "";
                              field.onChange(`${timeValue} weeks`);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              field.value.includes("weeks")
                                ? "gradient text-primary-foreground"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Weeks
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const timeValue =
                                field.value.match(/^\d+/)?.[0] || "";
                              field.onChange(`${timeValue} months`);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              field.value.includes("months")
                                ? "gradient text-primary-foreground"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Months
                          </button>
                        </div>
                      </div>
                    )}
                  />
                  {errors.estimatedTime && (
                    <p className="text-red-500 text-sm">
                      {errors.estimatedTime.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-lg mb-4">Price Quote*</h3>
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Price is required",
                    pattern: {
                      value: /^\$?[0-9,]+(\.\d{2})?$/,
                      message: "Please enter a valid price (e.g., $5,000)",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="$5,000" />
                  )}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="button-gradient px-8 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProposalModalJobTender;
