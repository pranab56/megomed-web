"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Shield } from "lucide-react";
import JobsFollowersLinks from "../JobsFollowersLinks";
import CompanyInfoModal from "./CompanyInfoModal";
import EditModal from "./EditModal";
import {
  useGetCompanyProfileQuery,
  useCompanyVerificationRequestMutation,
} from "@/features/company/companyApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { MdVerifiedUser } from "react-icons/md";
import toast from "react-hot-toast";

function CompanyHeaderPrivate() {
  const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    data: companyProfileResponse,
    isLoading,
    error,
    refetch,
  } = useGetCompanyProfileQuery();

  const [
    companyVerificationRequest,
    { isLoading: isCompanyVerificationRequestLoading },
  ] = useCompanyVerificationRequestMutation();

  // Extract company data from API response
  const companyData = companyProfileResponse?.data;

  // Company info data - using actual API response fields
  const companyInfo = {
    registrationNumber:
      companyData?.companyId?.registrationNumber || "Not provided",
    establishmentNumber:
      companyData?.companyId?.establishmentNumber || "Not provided",
    companyVatNumber:
      companyData?.companyId?.companyVatNumber || "Not provided",
    companyKBISFile: companyData?.companyId?.companyKBISFile || "Not uploaded",
    companyRCFile: companyData?.companyId?.companyRCFile || "Not uploaded",
    companyCertificateFile:
      companyData?.companyId?.companyCertificateFile || "Not uploaded",
  };

  const handleCompanyInfoModalClose = () => {
    setIsCompanyInfoModalOpen(false);
    refetch(); // Refetch data when modal closes
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    refetch(); // Refetch data when modal closes
  };

  const handleGetVerified = async () => {
    try {
      const response = await companyVerificationRequest().unwrap();
      toast.success(
        response?.message || "Company verification request sent successfully!"
      );
    } catch (error) {
      console.error("Failed to send company verification request:", error);
      toast.error(
        "Failed to send company verification request. Please try again."
      );
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

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading company profile</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full h-40 md:h-80 relative">
          <Image
            src={getImageUrl(companyData?.coverPhoto) || "/card_image.png"}
            alt="company-cover"
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
          <div className="absolute -bottom-25 md:-bottom-25 left-1/2 md:left-80 -translate-x-1/2 ">
            <div className="flex flex-col items-center md:items-start ">
              <Image
                src={getImageUrl(companyData?.profile) || "/card_image.png"}
                alt="company-logo"
                width={100}
                height={100}
                className="object-cover w-24 h-24 md:w-50 md:h-50 bg-white rounded-md border-4 border-white shadow-2xl"
              />
              <h1 className="text-2xl font-bold mt-2 flex items-center gap-4">
                {companyData?.companyName || "Company Name"}{" "}
                {companyData?.isVarified == "varified" ? (
                  <span className="shadow-2xl">
                    <MdVerifiedUser size={20} className=" text-green-600" />
                  </span>
                ) : null}
              </h1>
              <p className="text-sm text-gray-500">
                {companyData?.email || "Email"}
              </p>
              <p className="text-sm text-gray-500">
                {companyData?.location || "Location"}
              </p>
            </div>
          </div>
          <div className="hidden  absolute -bottom-20 right-44 px-6 lg:flex gap-2 justify-end">
            <Button
              className="button-gradient"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
            {/* (
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-green-100 rounded-full px-2 py-1">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Verified Company</span>
              </div>
            ) */}
            {companyData?.isVarified ===
            "varified" ? null : companyData?.isVarified ===
              "verified_request" ? (
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-yellow-100 rounded-full px-2 py-1">
                <Shield className="w-4 h-4 text-yellow-600" />
                <span>Pending Verification</span>
              </div>
            ) : companyData?.isVarified === "revision" ? (
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-red-100 rounded-full px-2 py-1">
                <Shield className="w-4 h-4 text-red-600" />
                <span>Revision</span>
              </div>
            ) : (
              <Button
                className="button-gradient"
                onClick={() => handleGetVerified()}
                disabled={isCompanyVerificationRequestLoading}
              >
                {isCompanyVerificationRequestLoading
                  ? "Requesting..."
                  : "Get Verified"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-40">
        <AboutCompanySection aboutCompany={companyData?.aboutCompany} />
        <JobsFollowersLinks />
        <CompanyInformationSection
          companyInfo={companyInfo}
          onEditClick={() => setIsCompanyInfoModalOpen(true)}
          onViewDocument={handleViewDocument}
        />
      </div>
      <CompanyInfoModal
        isOpen={isCompanyInfoModalOpen}
        onClose={handleCompanyInfoModalClose}
        clientInfo={companyInfo}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        companyData={companyData}
      />
    </>
  );
}

export default CompanyHeaderPrivate;

const CompanyInformationSection = ({
  onEditClick,
  companyInfo,
  onViewDocument,
}) => {
  return (
    <div className=" mb-10 ">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        Company Information{" "}
        <Edit
          className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-700"
          onClick={onEditClick}
        />
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            Company SIREN ( Registration Number)
          </p>
          <p className="text-base font-semibold mt-1">
            {companyInfo?.registrationNumber || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Company SIRET (Establishment Number)
          </p>
          <p className="text-base font-semibold mt-1">
            {companyInfo?.establishmentNumber || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Company Numéro de TVA (VAT ID)
          </p>
          <p className="text-base font-semibold mt-1">
            {companyInfo?.companyVatNumber || "Not provided"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium ">
                  Business Registration or Articles of Association
                </p>
                <p className="text-xs text-gray-500">
                  {companyInfo?.companyKBISFile === "Not uploaded"
                    ? "Company KBIS ou Statut (EI) - Not uploaded"
                    : `Company KBIS ou Statut (EI) - ${
                        companyInfo?.companyKBISFile?.split("\\").pop() ||
                        "Uploaded"
                      }`}
                </p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() =>
                onViewDocument(companyInfo?.companyKBISFile, "Company KBIS")
              }
            >
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Company RC Pro</p>
                <p className="text-xs text-gray-500">
                  {companyInfo?.companyRCFile === "Not uploaded"
                    ? "Professional Liability Insurance - Not uploaded"
                    : `Professional Liability Insurance - ${
                        companyInfo?.companyRCFile?.split("\\").pop() ||
                        "Uploaded"
                      }`}
                </p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() =>
                onViewDocument(companyInfo?.companyRCFile, "Company RC Pro")
              }
            >
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Company Certificat de TVA</p>
                <p className="text-xs text-gray-500">
                  {companyInfo?.companyCertificateFile === "Not uploaded"
                    ? "VAT Certificate - Not uploaded"
                    : `VAT Certificate - ${
                        companyInfo?.companyCertificateFile
                          ?.split("\\")
                          .pop() || "Uploaded"
                      }`}
                </p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() =>
                onViewDocument(
                  companyInfo?.companyCertificateFile,
                  "VAT Certificate"
                )
              }
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutCompanySection = ({ aboutCompany }) => {
  return (
    <div className="mb-10">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        About Company{" "}
      </h1>
      <p className="text-gray-700 leading-relaxed">
        {aboutCompany || "No company description available."}
      </p>
    </div>
  );
};
