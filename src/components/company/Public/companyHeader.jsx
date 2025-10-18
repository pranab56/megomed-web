"use client";
import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import JobsFollowersLinks from "../JobsFollowersLinks";
import { useGetCompanyPublicProfileQuery } from "@/features/company/companyApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { MdVerifiedUser } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function CompanyHeaderPublic({ id }) {
  const { data, isLoading, error } = useGetCompanyPublicProfileQuery(id);
  const router = useRouter();
  console.log("data", data);

  // Handle authorization errors
  useEffect(() => {
    if (error) {
      console.log("Error object:", error);
      console.log("Error status:", error.status);
      console.log("Error data:", error.data);

      // Check if it's an authorization error
      const errorData = error.data;
      const isAuthError =
        error.status === 401 ||
        error.status === "FETCH_ERROR" ||
        errorData?.message === "You are not authorized" ||
        errorData?.err?.statusCode === 401 ||
        (errorData?.success === false && errorData?.err?.statusCode === 401);

      if (isAuthError) {
        console.log("Redirecting to unauthorized page...");
        router.push("/unauthorized");
      }
    }
  }, [error, router]);

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

  if (error) {
    // Check if it's an authorization error
    const errorData = error.data;
    const isAuthError =
      error.status === 401 ||
      error.status === "FETCH_ERROR" ||
      errorData?.message === "You are not authorized" ||
      errorData?.err?.statusCode === 401 ||
      (errorData?.success === false && errorData?.err?.statusCode === 401);

    if (isAuthError) {
      // Immediate redirect for auth errors
      if (typeof window !== "undefined") {
        window.location.href = "/unauthorized";
      }

      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Access Denied
            </h2>
            <p className="text-red-500 mb-4">
              You are not authorized to view this company profile.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to unauthorized page...
            </p>
            <button
              onClick={() => (window.location.href = "/unauthorized")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go to Unauthorized Page
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-500 mb-4">
            {errorData?.message ||
              "Failed to load company profile. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const companyData = data?.data;
  const companyInfo = companyData?.companyId;

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full h-40 md:h-80 relative">
          <Image
            src={
              companyData?.coverPhoto
                ? getImageUrl(companyData.coverPhoto)
                : "/card_image.png"
            }
            alt="company-cover"
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
          <div className="absolute -bottom-25 md:-bottom-25 left-1/2 md:left-80 -translate-x-1/2 ">
            <div className="flex flex-col items-center md:items-start ">
              <Image
                src={
                  companyData?.profile
                    ? getImageUrl(companyData.profile)
                    : "/card_image.png"
                }
                alt="company-logo"
                width={100}
                height={100}
                className="object-cover w-24 h-24 md:w-50 md:h-50  rounded-md border-4 bg-white border-white"
              />
              <h1 className="text-2xl font-bold mt-2 flex items-center gap-2">
                {companyData?.companyName || companyData?.fullName}
                {companyData?.isVarified == "varified" ? (
                  <span className="shadow-2xl">
                    <MdVerifiedUser size={20} className=" text-green-600" />
                  </span>
                ) : null}
              </h1>
              <p className="text-sm text-gray-500">
                {companyInfo?.companyWebsite || "No website"}
              </p>
              <p className="text-sm text-gray-500">
                {companyData?.location || "No location"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-40">
        <AboutCompanySection aboutCompany={companyData?.aboutCompany} />
        <JobsFollowersLinks />
        <CompanyInformationSection companyInfo={companyInfo} />
      </div>
    </>
  );
}

export default CompanyHeaderPublic;

const CompanyInformationSection = ({ companyInfo }) => {
  return (
    <div className=" mb-10 ">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        Company Information
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
                <p className="text-sm font-medium">
                  Company KBIS ou Statut (EI)
                </p>
                <p className="text-xs text-gray-500">
                  Business Registration or Articles of Association
                </p>
              </div>
            </div>
            {companyInfo?.companyKBISFile ? (
              <a
                href={getImageUrl(companyInfo.companyKBISFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Not available</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Company RC Pro</p>
                <p className="text-xs text-gray-500">
                  Professional Liability Insurance
                </p>
              </div>
            </div>
            {companyInfo?.companyRCFile ? (
              <a
                href={getImageUrl(companyInfo.companyRCFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Not available</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Company Certificat de TVA</p>
                <p className="text-xs text-gray-500">VAT Certificate</p>
              </div>
            </div>
            {companyInfo?.companyCertificateFile ? (
              <a
                href={getImageUrl(companyInfo.companyCertificateFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Not available</span>
            )}
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
