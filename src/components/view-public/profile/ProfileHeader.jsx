"use client";
import { Badge } from "@/components/ui/badge";
import { useGetAllCategoryQuery } from "@/features/category/categoryApi";
import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";
import { useGetAllServicesQuery } from "@/features/services/servicesApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { DollarSign, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import Link from "next/link";
import { socialPlatforms } from "@/components/profile/socialPlatforms";

function ProfileHeader({ setCoverPhoto }) {
  const [profileImage, setProfileImage] = useState(
    "/client/profile/client.png"
  );

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  // Helper function to get platform icon
  const getPlatformIcon = (platformName) => {
    const platform = socialPlatforms.find((p) => p.value === platformName);
    return platform?.icon || null;
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

  const { data } = useGetMyprofileQuery();

  const { data: categoryData, isLoading: categoryLoading } =
    useGetAllCategoryQuery();
  const { data: serviceData, isLoading: serviceLoading } =
    useGetAllServicesQuery();

  // Set categories and services when data is loaded
  useEffect(() => {
    if (categoryData?.success && categoryData.data) {
      setCategories(categoryData.data);
    }
  }, [categoryData]);

  useEffect(() => {
    if (serviceData?.success && serviceData.data) {
      setServices(serviceData.data);
    }
  }, [serviceData]);

  // Update form values when profile data changes
  useEffect(() => {
    if (data?.data) {
      // Helper function to find service/category ID by name or return ID if already an ID
      const findServiceId = (serviceValue) => {
        if (!serviceValue) return "";

        // If services are not loaded yet, return the value as is (might be an ID)
        if (!services.length) {
          console.log(
            "Services not loaded yet, returning value as is:",
            serviceValue
          );
          return String(serviceValue);
        }

        // Check if it's already an ID by looking for a service with this ID
        const serviceById = services.find((s) => s._id === serviceValue);
        if (serviceById) {
          console.log(
            "Found service by ID:",
            serviceValue,
            "Found:",
            serviceById
          );
          return serviceById._id;
        }

        // Otherwise, try to find by name
        const serviceByName = services.find((s) => s.name === serviceValue);
        console.log(
          "Finding service ID for:",
          serviceValue,
          "Found:",
          serviceByName
        );
        return serviceByName ? serviceByName._id : String(serviceValue);
      };

      const findCategoryId = (categoryValue) => {
        if (!categoryValue) return "";

        // If categories are not loaded yet, return the value as is (might be an ID)
        if (!categories.length) {
          console.log(
            "Categories not loaded yet, returning value as is:",
            categoryValue
          );
          return String(categoryValue);
        }

        // Check if it's already an ID by looking for a category with this ID
        const categoryById = categories.find((c) => c._id === categoryValue);
        if (categoryById) {
          console.log(
            "Found category by ID:",
            categoryValue,
            "Found:",
            categoryById
          );
          return categoryById._id;
        }

        // Otherwise, try to find by name
        const categoryByName = categories.find((c) => c.name === categoryValue);
        console.log(
          "Finding category ID for:",
          categoryValue,
          "Found:",
          categoryByName
        );
        return categoryByName ? categoryByName._id : String(categoryValue);
      };

      const newProfileData = {
        name: data.data.fullName || "Sabbir Ahmed",
        dailyRate: data.data.dailyRate?.toString() || "500",
        serviceType: Array.isArray(data.data.serviceType)
          ? findServiceId(data.data.serviceType[0])
          : findServiceId(data.data.serviceType),
        categoryType: Array.isArray(data.data.categoryType)
          ? findCategoryId(data.data.categoryType[0])
          : findCategoryId(data.data.categoryType),
        location: String(data.data.location || "Bangladesh"),
        language: String(data.data.language || "Bengali"),
        designation: String(data.data.designation || ""),
        yearsOfExperience: String(data.data.yearsOfExperience || ""),
      };

      console.log("Processed profile data:", newProfileData);
      setProfileData(newProfileData);

      // Set profile image preview
      if (data.data.profile) {
        setProfileImage(getImageUrl(data.data.profile));
      }

      // Set cover photo for MyProfileLayout
      if (data.data.coverPhoto && setCoverPhoto) {
        setCoverPhoto(data.data.coverPhoto);
      }
    }
  }, [data, setCoverPhoto, services, categories]);

  // Update form when services/categories are loaded after profile data
  useEffect(() => {
    if (data?.data && (services.length > 0 || categories.length > 0)) {
      console.log("Services/Categories loaded, updating form values");

      // Helper function to find service/category ID by name or return ID if already an ID
      const findServiceId = (serviceValue) => {
        if (!serviceValue) return "";

        // Check if it's already an ID by looking for a service with this ID
        const serviceById = services.find((s) => s._id === serviceValue);
        if (serviceById) {
          return serviceById._id;
        }

        // Otherwise, try to find by name
        const serviceByName = services.find((s) => s.name === serviceValue);
        return serviceByName ? serviceByName._id : String(serviceValue);
      };

      const findCategoryId = (categoryValue) => {
        if (!categoryValue) return "";

        // Check if it's already an ID by looking for a category with this ID
        const categoryById = categories.find((c) => c._id === categoryValue);
        if (categoryById) {
          return categoryById._id;
        }

        // Otherwise, try to find by name
        const categoryByName = categories.find((c) => c.name === categoryValue);
        return categoryByName ? categoryByName._id : String(categoryValue);
      };

      // Update only the service and category fields
      const currentValues = {
        serviceType: Array.isArray(data.data.serviceType)
          ? findServiceId(data.data.serviceType[0])
          : findServiceId(data.data.serviceType),
        categoryType: Array.isArray(data.data.categoryType)
          ? findCategoryId(data.data.categoryType[0])
          : findCategoryId(data.data.categoryType),
      };

      console.log("Updating form with service/category values:", currentValues);
    }
  }, [services, categories, data]);

  if (categoryLoading || serviceLoading) {
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

  return (
    <div className="w-full mx-auto relative bg-white my-5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 w-full lg:w-auto">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {data?.data?.profile ? (
                <Image
                  src={getImageUrl(data.data.profile)}
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words text-center md:text-left">
              {data?.data?.fullName || profileData.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-600 mb-3 text-sm sm:text-base">
              <p>{data?.data?.designation || "Professional"}</p>
              <span>|</span>
              <p>{data?.data?.yearsOfExperience || "0"} of experience</p>
              <span>|</span>
              <p>{data?.data?.location || profileData.location}</p>
            </div>

            {/* Country Flags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <div className="w-full h-1/3 bg-blue-600"></div>
                <div className="w-full h-1/3 bg-white"></div>
                <div className="w-full h-1/3 bg-red-600"></div>
              </div>
              <div className="w-5 h-5 rounded-full overflow-hidden bg-red-600 flex items-center justify-center">
                <div className="w-3 h-2 bg-white flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-600"></div>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <div className="w-full h-1/3 bg-black"></div>
                <div className="w-full h-1/3 bg-red-600"></div>
                <div className="w-full h-1/3 bg-yellow-400"></div>
              </div>
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <div className="w-full h-1/3 bg-red-600"></div>
                <div className="w-full h-1/3 bg-white"></div>
                <div className="w-full h-1/3 bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Info */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-center lg:items-end gap-3 w-full lg:w-auto">
          {/* Available Badge */}
          <Badge className="bg-none flex items-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
            Available
          </Badge>

          {/* Verified Freelancer */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Verified Freelancer</span>
          </div>

          {/* Day Rate */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-blue-600 font-semibold">
              Day Rate ${data?.data?.dailyRate || profileData.dailyRate}
            </span>
          </div>
          {/* Social Links Display */}
          <div className="flex items-center gap-2">
            {/* Existing Social Links */}
            {data?.data?.freelancerId?.socialLinks &&
              data.data.freelancerId.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center ">
                  {data.data.freelancerId.socialLinks.map(
                    (socialLink, index) => {
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
                    }
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
