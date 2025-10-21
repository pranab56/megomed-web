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
import { useUpdateCompanyInfoMutation } from "@/features/company/companyApi";
import { toast } from "react-hot-toast";
import { getImageUrl } from "@/utils/getImageUrl";
function CompanyInfoModal({ isOpen, onClose, clientInfo }) {
  const [documents, setDocuments] = useState({
    companyKbis: null,
    companyRcPro: null,
    companyVatCertificate: null,
  });

  const documentInputRefs = {
    companyKbis: useRef(null),
    companyRcPro: useRef(null),
    companyVatCertificate: useRef(null),
  };

  const [updateCompanyInfo, { isLoading }] = useUpdateCompanyInfoMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      companySiren: "",
      companySiret: "",
      companyVatId: "",
      companyKbis: null,
      companyRcPro: null,
      companyVatCertificate: null,
      companyName: "",
      companySize: "",
      companyEmail: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && clientInfo) {
      reset({
        companySiren: clientInfo.registrationNumber || "",
        companySiret: clientInfo.establishmentNumber || "",
        companyVatId: clientInfo.companyVatNumber || "",
        companyKbis: null,
        companyRcPro: null,
        companyVatCertificate: null,
        companyName: "",
        companySize: "",
        companyEmail: "",
      });
      setDocuments({
        companyKbis: null,
        companyRcPro: null,
        companyVatCertificate: null,
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

  const handleViewDocument = (documentUrl, documentName) => {
    if (!documentUrl || documentUrl === "Not uploaded") {
      toast.error("No document available to view");
      return;
    }

    // Get file extension
    const fileExtension = documentUrl.split(".").pop().toLowerCase();

    // Create full URL using getImageUrl utility
    const fullUrl = getImageUrl(documentUrl);

    if (
      fileExtension === "pdf" ||
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)
    ) {
      // Open PDFs and images in new tab
      window.open(fullUrl, "_blank");
    } else if (fileExtension === "docx" || fileExtension === "doc") {
      // Download DOCX/DOC files
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = documentName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For other file types, try to open in new tab first, fallback to download
      try {
        window.open(fullUrl, "_blank");
      } catch (error) {
        const link = document.createElement("a");
        link.href = fullUrl;
        link.download = documentName || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const onSubmit = async (formData) => {
    console.log("Client Info Form Data:", formData);

    try {
      const payload = new FormData();

      // Append form fields
      payload.append("registrationNumber", formData.companySiren);
      payload.append("establishmentNumber", formData.companySiret);
      payload.append("companyVatNumber", formData.companyVatId);

      payload.append("companyName", formData.companyName);
      payload.append("companySize", formData.companySize);
      payload.append("companyEmail", formData.companyEmail);

      // Append document files
      if (formData.companyKbis) {
        payload.append("companyKBISFile", formData.companyKbis);
      }
      if (formData.companyRcPro) {
        payload.append("companyRCFile", formData.companyRcPro);
      }
      if (formData.companyVatCertificate) {
        payload.append(
          "companyCertificateFile",
          formData.companyVatCertificate
        );
      }

      console.log("Sending client info payload:", {
        companySiren: formData.companySiren,
        companySiret: formData.companySiret,
        companyVatId: formData.companyVatId,
        hasKbis: !!formData.companyKbis,
        hasRcPro: !!formData.companyRcPro,
        hasVatCertificate: !!formData.companyVatCertificate,
      });

      // Use the actual API call
      const response = await updateCompanyInfo(payload).unwrap();
      console.log("Company info updated successfully:", response);
      toast.success("Company information updated successfully!");

      onClose();
    } catch (error) {
      console.error("Error updating company info:", error);
      toast.error("Error updating company information. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:min-w-7xl">
        <DialogHeader>
          <DialogTitle>Edit Company Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="siren">
                  Company Name
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{
                    required: "Company Name is required",
                    minLength: {
                      value: 2,
                      message: "Company Name must be at least 5 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="companyName"
                      placeholder="Company Name"
                    />
                  )}
                />
                {errors.companyName && (
                  <span className="text-sm text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="siren">
                  Company SIREN
                  <span className="text-sm text-gray-500">
                    (Company registration number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companySiren"
                  control={control}
                  rules={{
                    required: "Company SIREN is required",
                    minLength: {
                      value: 2,
                      message: "Company SIREN must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="companySiren"
                      placeholder="Company SIREN"
                    />
                  )}
                />
                {errors.companySiren && (
                  <span className="text-sm text-red-500">
                    {errors.companySiren.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="siret">
                  Company SIRET
                  <span className="text-sm text-gray-500">
                    (Establishment number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companySiret"
                  control={control}
                  rules={{
                    required: "Company SIRET is required",
                    minLength: {
                      value: 2,
                      message: "Company SIRET must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="companySiret"
                      placeholder="Company SIRET"
                    />
                  )}
                />
                {errors.companySiret && (
                  <span className="text-sm text-red-500">
                    {errors.companySiret.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="vatId">
                  Company VAT ID
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companyVatId"
                  control={control}
                  rules={{
                    required: "Company VAT ID is required",
                    minLength: {
                      value: 2,
                      message: "Company VAT ID must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="companyVatId"
                      placeholder="Company VAT ID"
                    />
                  )}
                />
                {errors.companyVatId && (
                  <span className="text-sm text-red-500">
                    {errors.companyVatId.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="companySize">
                  Company Size
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companySize"
                  control={control}
                  rules={{
                    required: "Company Size is required",
                    minLength: {
                      value: 2,
                      message: "Company Size must be at least 5 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      id="companySize"
                      placeholder="Company Size"
                    />
                  )}
                />
                {errors.companySize && (
                  <span className="text-sm text-red-500">
                    {errors.companySize.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="companySize">
                  Company Email
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companyEmail"
                  control={control}
                  rules={{
                    required: "Company Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      id="companyEmail"
                      placeholder="Company Email"
                    />
                  )}
                />
                {errors.companyEmail && (
                  <span className="text-sm text-red-500">
                    {errors.companyEmail.message}
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
                  name="companyKbis"
                  control={control}
                  rules={{
                    required: "Company KBIS document is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Company KBIS ou Statut (EI)
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (Business Registration or Articles of Association)
                          </span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ Document uploaded
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeDocument("companyKbis", onChange)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {errors.companyKbis && (
                          <span className="text-sm text-red-500">
                            {errors.companyKbis.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("companyKbis")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.companyKbis}
                          onChange={(e) =>
                            handleDocumentChange(e, "companyKbis", onChange)
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
                  name="companyRcPro"
                  control={control}
                  rules={{
                    required: "Company RC Pro document is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Company RC Pro
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (Professional Liability Insurance)
                          </span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ Document uploaded
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeDocument("companyRcPro", onChange)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {errors.companyRcPro && (
                          <span className="text-sm text-red-500">
                            {errors.companyRcPro.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-md border-1 border-dashed border-blue-500 flex items-center gap-2"
                          onClick={() => handleDocumentClick("companyRcPro")}
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.companyRcPro}
                          onChange={(e) =>
                            handleDocumentChange(e, "companyRcPro", onChange)
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
                  name="companyVatCertificate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Company Certificat de TVA
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            (VAT Certificate)
                          </span>
                        </Label>
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ Document uploaded
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeDocument(
                                  "companyVatCertificate",
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
                            handleDocumentClick("companyVatCertificate")
                          }
                        >
                          <RiUploadCloudLine />
                          Upload
                        </Button>
                        <input
                          type="file"
                          ref={documentInputRefs.companyVatCertificate}
                          onChange={(e) =>
                            handleDocumentChange(
                              e,
                              "companyVatCertificate",
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="button-gradient"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CompanyInfoModal;
