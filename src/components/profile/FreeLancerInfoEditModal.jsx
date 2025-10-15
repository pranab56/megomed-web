import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiUploadCloudLine } from "react-icons/ri";
import { useUpdateFreelancerInfoCertificateMutation } from "@/features/freelancerInfo&Certificate/freelancerInfo&CertificateApi";
import { getImageUrl } from "@/utils/getImageUrl";
import toast from "react-hot-toast";
import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";

// Helper function to handle file viewing based on file type
const handleFileView = (filePath) => {
  const fileUrl = getImageUrl(filePath);
  const fileExtension = filePath.split(".").pop().toLowerCase();

  // For images, use direct link
  if (
    ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(fileExtension)
  ) {
    window.open(fileUrl, "_blank");
  } else {
    // For documents (PDF, DOC, etc.), create a link that forces new tab
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
function FreeLancerInfoEditModal({ isOpen, onClose, clientInfo }) {
  const [documents, setDocuments] = useState({
    kbis: null,
    rcPro: null,
    vatCertificate: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    kbis: null,
    rcPro: null,
    vatCertificate: null,
  });

  const [updateFreelancerInfo, { isLoading: isUpdating }] =
    useUpdateFreelancerInfoCertificateMutation();

  // Get refetch function for profile data
  const { refetch: refetchProfile } = useGetMyprofileQuery();

  const documentInputRefs = {
    kbis: useRef(null),
    rcPro: useRef(null),
    vatCertificate: useRef(null),
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      registrationNumber: "",
      establishmentNumber: "",
      freelancerVatNumber: "",
      freelancerKBISFile: null,
      freelancerRCFile: null,
      freelancerCertificateFile: null,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && clientInfo) {
      reset({
        registrationNumber: clientInfo.registrationNumber || "",
        establishmentNumber: clientInfo.establishmentNumber || "",
        freelancerVatNumber: clientInfo.freelancerVatNumber || "",
        freelancerKBISFile: null,
        freelancerRCFile: null,
        freelancerCertificateFile: null,
      });

      // Set existing files for display
      setExistingFiles({
        kbis: clientInfo.freelancerKBISFile || null,
        rcPro: clientInfo.freelancerRCFile || null,
        vatCertificate: clientInfo.freelancerCertificateFile || null,
      });

      setDocuments({
        kbis: null,
        rcPro: null,
        vatCertificate: null,
      });
    }
  }, [isOpen, clientInfo, reset]);

  const handleDocumentClick = (documentType) => {
    documentInputRefs[documentType].current?.click();
  };

  const handleDocumentChange = (event, documentType, onChange) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);

      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (documentType, onChange) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: null,
    }));
    onChange(null);

    // Clear the input
    if (documentInputRefs[documentType].current) {
      documentInputRefs[documentType].current.value = "";
    }
  };

  const onSubmit = async (formData) => {
    console.log("Freelancer Info Form Data:", formData);

    try {
      const payload = new FormData();

      // Append form fields with correct API field names
      payload.append("registrationNumber", formData.registrationNumber);
      payload.append("establishmentNumber", formData.establishmentNumber);
      payload.append("freelancerVatNumber", formData.freelancerVatNumber);

      // Append document files with correct API field names
      if (formData.freelancerKBISFile) {
        payload.append("freelancerKBISFile", formData.freelancerKBISFile);
      }
      if (formData.freelancerRCFile) {
        payload.append("freelancerRCFile", formData.freelancerRCFile);
      }
      if (formData.freelancerCertificateFile) {
        payload.append(
          "freelancerCertificateFile",
          formData.freelancerCertificateFile
        );
      }

      console.log("Sending freelancer info payload:", {
        registrationNumber: formData.registrationNumber,
        establishmentNumber: formData.establishmentNumber,
        freelancerVatNumber: formData.freelancerVatNumber,
        hasKBISFile: !!formData.freelancerKBISFile,
        hasRCFile: !!formData.freelancerRCFile,
        hasCertificateFile: !!formData.freelancerCertificateFile,
      });

      // Call the actual API
      const response = await updateFreelancerInfo(payload).unwrap();
      console.log("Freelancer info updated successfully:", response);

      // Show success toast
      toast.success("Freelancer information updated successfully!");

      // Refetch profile data to get updated information
      await refetchProfile();

      onClose();
    } catch (error) {
      console.error("Error updating freelancer info:", error);

      // Show error toast
      toast.error("Failed to update freelancer information. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:min-w-7xl">
        <DialogHeader>
          <DialogTitle>Edit Freelancer Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="registrationNumber">
                  SIREN
                  <span className="text-sm text-gray-500">
                    (Freelancer registration number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="registrationNumber"
                  control={control}
                  rules={{
                    required: "Freelancer SIREN is required",
                    minLength: {
                      value: 2,
                      message: "Freelancer SIREN must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="registrationNumber"
                      placeholder="Freelancer SIREN"
                    />
                  )}
                />
                {errors.registrationNumber && (
                  <span className="text-sm text-red-500">
                    {errors.registrationNumber.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="establishmentNumber">
                  Freelancer SIRET
                  <span className="text-sm text-gray-500">
                    (Establishment number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="establishmentNumber"
                  control={control}
                  rules={{
                    required: "Freelancer SIRET is required",
                    minLength: {
                      value: 2,
                      message: "Freelancer SIRET must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="establishmentNumber"
                      placeholder="Freelancer SIRET"
                    />
                  )}
                />
                {errors.establishmentNumber && (
                  <span className="text-sm text-red-500">
                    {errors.establishmentNumber.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="freelancerVatNumber">
                  Freelancer VAT ID
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="freelancerVatNumber"
                  control={control}
                  rules={{
                    required: "Freelancer VAT ID is required",
                    minLength: {
                      value: 2,
                      message:
                        "Freelancer VAT ID must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="freelancerVatNumber"
                      placeholder="Freelancer VAT ID"
                    />
                  )}
                />
                {errors.freelancerVatNumber && (
                  <span className="text-sm text-red-500">
                    {errors.freelancerVatNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Document Upload Fields */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold mb-10">Documents</h3>

              {/* KBIS ou Statut (EI) */}
              <div className="bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                <Controller
                  name="freelancerKBISFile"
                  control={control}
                  rules={{
                    required: !existingFiles.kbis
                      ? "Freelancer KBIS document is required"
                      : false,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Freelancer KBIS ou Statut (EI)
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (Business Registration or Articles of Association)
                          </span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>

                        {/* Show existing file */}
                        {existingFiles.kbis && !value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                              📄 Current file:{" "}
                              {existingFiles.kbis.split("/").pop()}
                            </span>
                            <a
                              href={getImageUrl(existingFiles.kbis)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                              onClick={(e) => {
                                e.preventDefault();
                                handleFileView(existingFiles.kbis);
                              }}
                            >
                              View
                            </a>
                          </div>
                        )}

                        {/* Show new uploaded file */}
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ New document uploaded
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDocument("kbis", onChange)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {errors.freelancerKBISFile && (
                          <span className="text-sm text-red-500">
                            {errors.freelancerKBISFile.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("kbis")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.kbis}
                          onChange={(e) =>
                            handleDocumentChange(e, "kbis", onChange)
                          }
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* RC Pro */}
              <div className="bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                <Controller
                  name="freelancerRCFile"
                  control={control}
                  rules={{
                    required: !existingFiles.rcPro
                      ? "Freelancer RC Pro document is required"
                      : false,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Freelancer RC Pro
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (Professional Liability Insurance)
                          </span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>

                        {/* Show existing file */}
                        {existingFiles.rcPro && !value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                              📄 Current file:{" "}
                              {existingFiles.rcPro.split("/").pop()}
                            </span>
                            <a
                              href={getImageUrl(existingFiles.rcPro)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                              onClick={(e) => {
                                e.preventDefault();
                                handleFileView(existingFiles.rcPro);
                              }}
                            >
                              View
                            </a>
                          </div>
                        )}

                        {/* Show new uploaded file */}
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ New document uploaded
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDocument("rcPro", onChange)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {errors.freelancerRCFile && (
                          <span className="text-sm text-red-500">
                            {errors.freelancerRCFile.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("rcPro")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.rcPro}
                          onChange={(e) =>
                            handleDocumentChange(e, "rcPro", onChange)
                          }
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Certificat de TVA */}
              <div className="bg-gray-50 rounded-lg px-2 py-1  border border-gray-200">
                <Controller
                  name="freelancerCertificateFile"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Freelancer Certificat de TVA
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (VAT Certificate)
                          </span>
                        </Label>

                        {/* Show existing file */}
                        {existingFiles.vatCertificate && !value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                              📄 Current file:{" "}
                              {existingFiles.vatCertificate.split("/").pop()}
                            </span>
                            <a
                              href={getImageUrl(existingFiles.vatCertificate)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                              onClick={(e) => {
                                e.preventDefault();
                                handleFileView(existingFiles.vatCertificate);
                              }}
                            >
                              View
                            </a>
                          </div>
                        )}

                        {/* Show new uploaded file */}
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ New document uploaded
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeDocument("vatCertificate", onChange)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("vatCertificate")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.vatCertificate}
                          onChange={(e) =>
                            handleDocumentChange(e, "vatCertificate", onChange)
                          }
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="button-gradient"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FreeLancerInfoEditModal;
