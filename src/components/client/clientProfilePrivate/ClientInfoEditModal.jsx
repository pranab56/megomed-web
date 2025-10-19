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
import {
  useUpdateClientInfoMutation,
  useGetMyprofileQuery,
} from "../../../features/clientProfile/ClientProfile";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/getImageUrl";

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

function ClientInfoEditModal({ isOpen, onClose, clientInfo, documentInfo }) {
  const [updateClientInfo, { isLoading: isUpdating }] =
    useUpdateClientInfoMutation();
  const { refetch: refetchProfile } = useGetMyprofileQuery();
  const [documents, setDocuments] = useState({
    clientKBISFile: null,
    clientRCFile: null,
    clientCertificateFile: null,
  });

  const documentInputRefs = {
    clientKBISFile: useRef(null),
    clientRCFile: useRef(null),
    clientCertificateFile: useRef(null),
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
      clientVatNumber: "",
      clientKBISFile: null,
      clientRCFile: null,
      clientCertificateFile: null,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && clientInfo) {
      reset({
        registrationNumber: documentInfo?.registrationNumber || "",
        establishmentNumber: documentInfo?.establishmentNumber || "",
        clientVatNumber: documentInfo?.clientVatNumber || "",
        clientKBISFile: null,
        clientRCFile: null,
        clientCertificateFile: null,
      });
      setDocuments({
        clientKBISFile: documentInfo?.clientKBISFile || null,
        clientRCFile: documentInfo?.clientRCFile || null,
        clientCertificateFile: documentInfo?.clientCertificateFile || null,
      });
    }
  }, [isOpen, clientInfo, reset, documentInfo]);

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
    console.log("Client Info Form Data:", formData);

    try {
      const payload = new FormData();

      // Append form fields with correct API field names
      payload.append("registrationNumber", formData.registrationNumber);
      payload.append("establishmentNumber", formData.establishmentNumber);
      payload.append("clientVatNumber", formData.clientVatNumber);

      // Append document files with correct API field names
      // Only append if a new file is uploaded (not just existing file)
      if (formData.clientKBISFile) {
        payload.append("clientKBISFile", formData.clientKBISFile);
      }
      if (formData.clientRCFile) {
        payload.append("clientRCFile", formData.clientRCFile);
      }
      if (formData.clientCertificateFile) {
        payload.append("clientCertificateFile", formData.clientCertificateFile);
      }

      console.log("Sending client info payload:", {
        registrationNumber: formData.registrationNumber,
        establishmentNumber: formData.establishmentNumber,
        clientVatNumber: formData.clientVatNumber,
        hasKBISFile: !!formData.clientKBISFile,
        hasRCFile: !!formData.clientRCFile,
        hasCertificateFile: !!formData.clientCertificateFile,
      });

      const response = await updateClientInfo(payload).unwrap();
      console.log("Client info updated successfully:", response);

      toast.success("Client information updated successfully!");
      refetchProfile();
      onClose();
    } catch (error) {
      console.error("Error updating client info:", error);
      toast.error("Failed to update client information. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:min-w-7xl">
        <DialogHeader>
          <DialogTitle>Edit Client Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>

              <div className="space-y-1">
                <Label htmlFor="registrationNumber">
                  SIREN
                  <span className="text-sm text-gray-500">
                    (Company registration number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="registrationNumber"
                  control={control}
                  rules={{
                    required: "SIREN is required",
                    minLength: {
                      value: 2,
                      message: "SIREN must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="registrationNumber"
                      placeholder="SIREN"
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
                  SIRET
                  <span className="text-sm text-gray-500">
                    (Establishment number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="establishmentNumber"
                  control={control}
                  rules={{
                    required: "SIRET is required",
                    minLength: {
                      value: 2,
                      message: "SIRET must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="establishmentNumber"
                      placeholder="SIRET"
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
                <Label htmlFor="clientVatNumber">
                  VAT ID
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="clientVatNumber"
                  control={control}
                  rules={{
                    required: "VAT ID is required",
                    minLength: {
                      value: 2,
                      message: "VAT ID must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="clientVatNumber"
                      placeholder="VAT ID"
                    />
                  )}
                />
                {errors.clientVatNumber && (
                  <span className="text-sm text-red-500">
                    {errors.clientVatNumber.message}
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
                  name="clientKBISFile"
                  control={control}
                  rules={{
                    required: !documents.clientKBISFile
                      ? "KBIS document is required"
                      : false,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          KBIS ou Statut (EI)
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (Business Registration or Articles of Association)
                          </span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        {documents.clientKBISFile && !value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                              📄 Current file available
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleFileView(documents.clientKBISFile)
                              }
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View
                            </Button>
                          </div>
                        )}
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
                                removeDocument("clientKBISFile", onChange)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {errors.clientKBISFile && (
                          <span className="text-sm text-red-500">
                            {errors.clientKBISFile.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("clientKBISFile")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.clientKBISFile}
                          onChange={(e) =>
                            handleDocumentChange(e, "clientKBISFile", onChange)
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
                  name="clientRCFile"
                  control={control}
                  rules={{
                    required: !documents.clientRCFile
                      ? "RC Pro document is required"
                      : false,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          RC Pro
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (Professional Liability Insurance)
                          </span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        {documents.clientRCFile && !value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                              📄 Current file available
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleFileView(documents.clientRCFile)
                              }
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View
                            </Button>
                          </div>
                        )}
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
                                removeDocument("clientRCFile", onChange)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {errors.clientRCFile && (
                          <span className="text-sm text-red-500">
                            {errors.clientRCFile.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("clientRCFile")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.clientRCFile}
                          onChange={(e) =>
                            handleDocumentChange(e, "clientRCFile", onChange)
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
                  name="clientCertificateFile"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Certificat de TVA
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (VAT Certificate)
                          </span>
                        </Label>
                        {documents.clientCertificateFile && !value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                              📄 Current file available
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleFileView(documents.clientCertificateFile)
                              }
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View
                            </Button>
                          </div>
                        )}
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
                                removeDocument(
                                  "clientCertificateFile",
                                  onChange
                                )
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
                          onClick={() =>
                            handleDocumentClick("clientCertificateFile")
                          }
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.clientCertificateFile}
                          onChange={(e) =>
                            handleDocumentChange(
                              e,
                              "clientCertificateFile",
                              onChange
                            )
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
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

export default ClientInfoEditModal;
