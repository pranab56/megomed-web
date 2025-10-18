"use client";
import { Badge } from "@/components/ui/badge";

import { getImageUrl } from "@/utils/getImageUrl";
import { DollarSign, Shield } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { languageToCountryCode } from "@/utils/flag";
import Link from "next/link";
import { MdVerifiedUser } from "react-icons/md";
import { socialPlatforms } from "@/components/profile/socialPlatforms";
import { useGetFreelancerPublicProfileQuery } from "@/features/clientProfile/ClientProfile";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

function ProfileHeader({ setCoverPhoto, data }) {
  const [profileImage, setProfileImage] = useState(
    "/client/profile/client.png"
  );

  // Helper function to get platform icon
  const getPlatformIcon = (platformName) => {
    const platform = socialPlatforms.find((p) => p.value === platformName);
    return platform?.icon || null;
  };

  // Helper function to get country code for language
  const getLanguageCountryCode = (language) => {
    return languageToCountryCode[language] || null;
  };

  const [profileData, setProfileData] = useState({
    name: "Sabbir Ahmed",
    dailyRate: "500",
    serviceType: "",
    categoryType: "",
    location: "Bangladesh",
    language: "Bengali",
    designation: "",
    yearsOfExperience: "",
  });

  // If no data is provided, show a placeholder
  if (!data) {
    return (
      <div className="w-full mx-auto relative bg-white my-5 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex space-x-4">
            <div className="rounded-full bg-gray-200 h-24 w-24"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No need to extract certificates here anymore as they are handled by the CertificationSectionPublic component

  return (
    <div className="w-full mx-auto relative bg-white my-5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 w-full lg:w-auto">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {data?.profile ? (
                <Image
                  src={getImageUrl(data.profile)}
                  alt={profileData.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={profileImage}
                  alt={profileData.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words text-center md:text-left flex items-center gap-2">
              {data?.fullName || profileData.name}
              {data?.isVarified === "varified" && (
                <span className="flex items-center gap-2">
                  <MdVerifiedUser className="w-4 h-4 text-green-600" />
                </span>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-600 mb-3 text-sm sm:text-base">
              <p>{data?.designation || "Professional"}</p>
              <span>|</span>
              <p>{data?.yearsOfExperience || "0"} of experience</p>
              <span>|</span>
              <p>{data?.location || profileData.location}</p>
            </div>

            {/* Languages Display with Flag Icons */}
            {data?.language && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">Languages:</span>
                {Array.isArray(data.language) ? (
                  data.language.map((lang, index) => {
                    const countryCode = getLanguageCountryCode(lang);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        {countryCode && (
                          <ReactCountryFlag
                            countryCode={countryCode}
                            svg
                            style={{
                              width: "16px",
                              height: "12px",
                              borderRadius: "2px",
                            }}
                            title={lang}
                          />
                        )}
                        <span>{lang}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {getLanguageCountryCode(data.language) && (
                      <ReactCountryFlag
                        countryCode={getLanguageCountryCode(data.language)}
                        svg
                        style={{
                          width: "16px",
                          height: "12px",
                          borderRadius: "2px",
                        }}
                        title={data.language}
                      />
                    )}
                    <span>{data.language}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status & Info */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-center lg:items-end gap-3 w-full lg:w-auto">
          {/* Available Badge */}
          <Badge className="bg-none flex items-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
            Available
          </Badge>

          {/* Day Rate */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-blue-600 font-semibold">
              Day Rate ${data?.dailyRate || profileData.dailyRate}
            </span>
          </div>
          {/* Social Links Display */}
          <div className="flex items-center gap-2">
            {/* Existing Social Links */}
            {data?.freelancerId?.socialLinks &&
              data.freelancerId.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center ">
                  {data.freelancerId.socialLinks.map((socialLink, index) => {
                    const platformIcon = getPlatformIcon(socialLink.name);
                    return (
                      <div
                        key={socialLink._id || index}
                        className="relative group"
                      >
                        <Link
                          href={socialLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg transition-colors"
                        >
                          {platformIcon && (
                            <Image
                              src={platformIcon}
                              alt={socialLink.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-fill"
                            />
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
