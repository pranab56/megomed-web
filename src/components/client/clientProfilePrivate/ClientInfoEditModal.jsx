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
function ClientInfoEditModal({ isOpen, onClose, clientInfo }) {
  const [documents, setDocuments] = useState({
    kbis: null,
    rcPro: null,
    vatCertificate: null,
  });

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
      siren: "",
      siret: "",
      vatId: "",
      kbis: null,
      rcPro: null,
      vatCertificate: null,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && clientInfo) {
      reset({
        siren: clientInfo.siren || "",
        siret: clientInfo.siret || "",
        vatId: clientInfo.vatId || "",
        kbis: null,
        rcPro: null,
        vatCertificate: null,
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
    console.log("Client Info Form Data:", formData);

    try {
      const payload = new FormData();

      // Append form fields
      payload.append("siren", formData.siren);
      payload.append("siret", formData.siret);
      payload.append("vatId", formData.vatId);

      // Append document files
      if (formData.kbis) {
        payload.append("kbis", formData.kbis);
      }
      if (formData.rcPro) {
        payload.append("rcPro", formData.rcPro);
      }
      if (formData.vatCertificate) {
        payload.append("vatCertificate", formData.vatCertificate);
      }

      console.log("Sending client info payload:", {
        siren: formData.siren,
        siret: formData.siret,
        vatId: formData.vatId,
        hasKbis: !!formData.kbis,
        hasRcPro: !!formData.rcPro,
        hasVatCertificate: !!formData.vatCertificate,
      });

      // TODO: Replace with actual API call
      // const response = await updateClientInfo(payload).unwrap();
      // console.log("Client info updated successfully:", response);

      onClose();
    } catch (error) {
      console.error("Error updating client info:", error);
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
                <Label htmlFor="siren">
                  SIREN
                  <span className="text-sm text-gray-500">
                    (Company registration number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="siren"
                  control={control}
                  rules={{
                    required: "SIREN is required",
                    minLength: {
                      value: 2,
                      message: "SIREN must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} id="siren" placeholder="SIREN" />
                  )}
                />
                {errors.siren && (
                  <span className="text-sm text-red-500">
                    {errors.siren.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="siret">
                  SIRET
                  <span className="text-sm text-gray-500">
                    (Establishment number)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="siret"
                  control={control}
                  rules={{
                    required: "SIRET is required",
                    minLength: {
                      value: 2,
                      message: "SIRET must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} id="siret" placeholder="SIRET" />
                  )}
                />
                {errors.siret && (
                  <span className="text-sm text-red-500">
                    {errors.siret.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="vatId">
                  VAT ID
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="vatId"
                  control={control}
                  rules={{
                    required: "VAT ID is required",
                    minLength: {
                      value: 2,
                      message: "VAT ID must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} id="vatId" placeholder="VAT ID" />
                  )}
                />
                {errors.vatId && (
                  <span className="text-sm text-red-500">
                    {errors.vatId.message}
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
                  name="kbis"
                  control={control}
                  rules={{
                    required: "KBIS document is required",
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
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ Document uploaded
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
                        {errors.kbis && (
                          <span className="text-sm text-red-500">
                            {errors.kbis.message}
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
                  name="rcPro"
                  control={control}
                  rules={{
                    required: "RC Pro document is required",
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
                        {value && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              ✓ Document uploaded
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
                        {errors.rcPro && (
                          <span className="text-sm text-red-500">
                            {errors.rcPro.message}
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
                  name="vatCertificate"
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
            <Button type="submit" className="button-gradient">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ClientInfoEditModal;
