import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { X, Upload, Image as ImageIcon, Trash2, Calendar } from "lucide-react";
import { useUpdateFreelancerInfoCertificateMutation } from "../../../features/freelancerInfo&Certificate/freelancerInfo&CertificateApi";
import { Calendar as CalendarComponent } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";
import toast from "react-hot-toast";

function CertificationAddEditModal({
  isOpen,
  onClose,
  mode = "add", // "add" or "edit"
  certificationData = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: certificationData?.name || "",
    institution: certificationData?.institution || "",
    obtainedDate: certificationData?.obtainedDate
      ? new Date(certificationData.obtainedDate)
      : null,
    images: [],
    imagePreviews: certificationData?.imageUrls || [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [updateFreelancerInfoCertificate] =
    useUpdateFreelancerInfoCertificateMutation();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      const newPreviews = [
        ...formData.imagePreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ];

      setFormData((prev) => ({
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Please enter certification name");
      return;
    }
    if (!formData.institution.trim()) {
      toast.error("Please enter institution name");
      return;
    }
    if (!formData.obtainedDate) {
      toast.error("Please select obtained date");
      return;
    }
    if (formData.images.length === 0) {
      toast.error("Please upload at least one certification image");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("institution", formData.institution.trim());
      formDataToSend.append("type", "add");
      formDataToSend.append(
        "obtainedDate",
        formData.obtainedDate.toISOString()
      );

      // Add the certification files with the specified field name
      formData.images.forEach((file, index) => {
        formDataToSend.append("image", file);
      });

      console.log("Saving certification with data:", {
        name: formData.name,
        institution: formData.institution,
        obtainedDate: formData.obtainedDate,
        fileCount: formData.images.length,
      });

      // Call the API
      const result = await updateFreelancerInfoCertificate(
        formDataToSend
      ).unwrap();

      console.log("Certification saved successfully:", result);
      toast.success("Certification saved successfully!");

      // Reset form and close modal
      setFormData({
        name: "",
        institution: "",
        obtainedDate: null,
        images: [],
        imagePreviews: [],
      });

      // Call onSuccess callback to refetch data
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error saving certification:", error);
      toast.error("Failed to save certification. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      institution: "",
      obtainedDate: null,
      images: [],
      imagePreviews: [],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {mode === "add" ? "Add New Certification" : "Edit Certification"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Certification Name */}
          <div className="space-y-2">
            <Label htmlFor="certification-name">Certification Name *</Label>
            <Input
              id="certification-name"
              type="text"
              placeholder="Enter certification name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              type="text"
              placeholder="Enter institution name"
              value={formData.institution}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  institution: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Obtained Date */}
          <div className="space-y-2">
            <Label>Obtained Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.obtainedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.obtainedDate ? (
                    format(formData.obtainedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.obtainedDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, obtainedDate: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="certification-images">Certification Images *</Label>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="certification-images"
                  type="file"
                  accept="image/*"
                  // multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="certification-images"
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Choose Images (Multiple)
                </Label>
              </div>

              {/* Image Previews Grid */}
              {formData.imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Certification preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {formData.imagePreviews.length > 0 && (
                <p className="text-sm text-gray-600">
                  {formData.imagePreviews.length} image(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={
                isUploading ||
                !formData.name.trim() ||
                !formData.institution.trim() ||
                !formData.obtainedDate ||
                formData.images.length === 0
              }
              className="button-gradient min-w-[80px]"
            >
              {isUploading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CertificationAddEditModal;
