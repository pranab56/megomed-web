import React, { useState } from "react";
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

function ProposalModalJobTender({ open, onOpenChange, jobData, type }) {
  const pathname = usePathname();
  const isTenderPage = pathname.includes("tenders-details");

  // Determine if it's a tender based on type prop or pathname
  const isTender = type === "tender" || isTenderPage;

  const [formData, setFormData] = useState({
    introduction: "",
    proposal: "",
    estimatedTime: "",
    timeUnit: "weeks", // Default to weeks
    priceQuote: "",
    documents: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeUnitChange = (unit) => {
    setFormData((prev) => ({
      ...prev,
      timeUnit: unit,
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map((file) => ({
      name: file.name,
      type: getFileType(file.type),
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }));
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

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  //   console.log("ProposalModalJobTender - open:", open);
  //   console.log("ProposalModalJobTender - jobData:", jobData);
  //   console.log("ProposalModalJobTender - type:", type);
  //   console.log("ProposalModalJobTender - isTender:", isTender);
  //   console.log("ProposalModalJobTender - isTenderPage:", isTenderPage);

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

        <div className="space-y-6">
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

          {/* Introduction Section */}
          <Card>
            <CardContent>
              <h3 className="font-semibold text-lg mb-4">Introduction</h3>
              <Textarea
                placeholder="I believe I am the right fit for this project because..."
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Proposal Section */}
          <Card>
            <CardContent>
              <h3 className="font-semibold text-lg mb-4">Proposal</h3>
              <Textarea
                placeholder="My approach involves thorough data analysis, advanced modeling techniques, and clear reporting..."
                value={formData.proposal}
                onChange={(e) => handleInputChange("proposal", e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Upload Documents Section */}
          <Card>
            <CardContent>
              <h3 className="font-semibold text-lg mb-4">Upload Documents</h3>

              {/* File Upload Button */}
              <div className="mb-4">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.pptx,.ppt,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Choose Files
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Accepted formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG,
                  PNG, WEBP
                </p>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-3">
                {formData.documents.map((doc, index) => (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {/* Show message when no documents uploaded */}
                {formData.documents.length === 0 && (
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
                <h3 className="font-semibold text-lg mb-4">Estimated Time</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="4"
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      handleInputChange("estimatedTime", e.target.value)
                    }
                    type="number"
                    min="1"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTimeUnitChange("days")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        formData.timeUnit === "days"
                          ? "gradient text-primary-foreground"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Days
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTimeUnitChange("weeks")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        formData.timeUnit === "weeks"
                          ? "gradient text-primary-foreground"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Weeks
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTimeUnitChange("months")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        formData.timeUnit === "months"
                          ? "gradient text-primary-foreground"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Months
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-lg mb-4">Price Quote</h3>
                <Input
                  placeholder="$5,000"
                  value={formData.priceQuote}
                  onChange={(e) =>
                    handleInputChange("priceQuote", e.target.value)
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              className="button-gradient px-8 py-2"
              onClick={handleSubmit}
            >
              Submit Proposal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProposalModalJobTender;
