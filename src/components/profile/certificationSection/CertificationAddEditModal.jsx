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
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { useUpdateFreelancerInfoCertificateMutation } from "../../../features/freelancerInfo&Certificate/freelancerInfo&CertificateApi";

function CertificationAddEditModal({
  isOpen,
  onClose,
  mode = "add", // "add" or "edit"
  certificationData = null,
}) {
  const [formData, setFormData] = useState({
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
    if (formData.images.length === 0) {
      alert("Please upload at least one certification image");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add the certification files with the specified field name
      formData.images.forEach((file, index) => {
        formDataToSend.append("academicCertificateFiles", file);
      });

      console.log("Saving certification with files:", {
        fileCount: formData.images.length,
      });

      // Call the API
      const result = await updateFreelancerInfoCertificate(
        formDataToSend
      ).unwrap();

      console.log("Certification saved successfully:", result);
      alert("Certification saved successfully!");

      // Reset form and close modal
      setFormData({
        images: [],
        imagePreviews: [],
      });
      onClose();
    } catch (error) {
      console.error("Error saving certification:", error);
      alert("Failed to save certification. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
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
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="certification-images">Certification Images *</Label>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="certification-images"
                  type="file"
                  accept="image/*"
                  multiple
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
              disabled={isUploading || formData.images.length === 0}
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
