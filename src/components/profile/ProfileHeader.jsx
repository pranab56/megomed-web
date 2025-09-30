"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getImageUrl } from "@/utils/getImageUrl";
import { DollarSign, Edit, Plus, Shield, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetAllCategoryQuery } from "../../features/category/categoryApi";
import {
  useGetMyprofileQuery,
  useUpdateMyprofileMutation,
  useUpdateSocialLinkMutation,
} from "../../features/clientProfile/ClientProfile";
import { useGetAllServicesQuery } from "../../features/services/servicesApi";
import SocialLinkAddDialog from "./SocialLinkAddDialog";
import { socialPlatforms } from "./socialPlatforms";
import Link from "next/link";

function ProfileHeader({ setCoverPhoto }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "/client/profile/client.png"
  );
  const [coverImage, setCoverImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const curentUser = localStorage.getItem("role");

  // Helper function to get platform icon
  const getPlatformIcon = (platformName) => {
    const platform = socialPlatforms.find((p) => p.value === platformName);
    return platform?.icon || null;
  };

  // Function to delete social link
  const handleDeleteSocialLink = async (socialLinkId) => {
    try {
      const deleteData = {
        type: "socialLink",
        operation: "delete",
        _id: socialLinkId,
      };

      await updateSocialLink(deleteData).unwrap();
      toast.success("Social link deleted successfully!");
    } catch (error) {
      console.error("Failed to delete social link:", error);
      toast.error("Failed to delete social link. Please try again.");
    }
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

  const { data, isLoading } = useGetMyprofileQuery();
  const [updateMyprofile, { isLoading: isUpdating }] =
    useUpdateMyprofileMutation();
  const [updateSocialLink, { isLoading: isDeletingSocialLink }] =
    useUpdateSocialLinkMutation();
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useGetAllCategoryQuery();
  const {
    data: serviceData,
    isLoading: serviceLoading,
    isError: serviceError,
  } = useGetAllServicesQuery();

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: profileData,
    mode: "onChange",
  });

  // Update form values when profile data changes
  useEffect(() => {
    if (data?.data) {
      // console.log("Profile data loaded:", data.data);
      // console.log("Profile image URL:", data.data.profile);
      // console.log("Processed profile URL:", getImageUrl(data.data.profile));
      // console.log("Services data:", services);
      // console.log("Categories data:", categories);
      // console.log("Service type from API:", data.data.serviceType);
      // console.log("Category type from API:", data.data.categoryType);

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

      // Reset form with new values
      reset(newProfileData);

      // Set profile image preview
      if (data.data.profile) {
        setProfileImage(getImageUrl(data.data.profile));
      }

      // Set cover photo for MyProfileLayout
      if (data.data.coverPhoto && setCoverPhoto) {
        setCoverPhoto(data.data.coverPhoto);
      }
    }
  }, [data, reset, setCoverPhoto, services, categories]);

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
      setValue("serviceType", currentValues.serviceType);
      setValue("categoryType", currentValues.categoryType);
    }
  }, [services, categories, data, setValue]);

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Store the file for upload
      if (type === "profile") {
        setProfileImageFile(file);
        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
      } else {
        setCoverImageFile(file);
        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);
        setCoverImage(previewUrl);
      }
    }
  };

  const onSubmit = async (formData) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submitted with data:", formData);

    try {
      // Helper functions to convert IDs back to names for payload
      const getServiceNameById = (serviceId) => {
        if (!serviceId || !services.length) return "";
        const service = services.find((s) => s._id === serviceId);
        return service ? service.name : String(serviceId);
      };

      const getCategoryNameById = (categoryId) => {
        if (!categoryId || !categories.length) return "";
        const category = categories.find((c) => c._id === categoryId);
        return category ? category.name : String(categoryId);
      };

      // Create FormData for file upload
      const submitData = new FormData();

      // Add text fields
      submitData.append("fullName", formData.name);
      submitData.append("dailyRate", formData.dailyRate);
      const serviceName = getServiceNameById(formData.serviceType);
      const categoryName = getCategoryNameById(formData.categoryType);

      console.log("Converting IDs to names:");
      console.log("Service ID:", formData.serviceType, "-> Name:", serviceName);
      console.log(
        "Category ID:",
        formData.categoryType,
        "-> Name:",
        categoryName
      );

      submitData.append("serviceType", serviceName);
      submitData.append("categoryType", categoryName);
      submitData.append("location", formData.location);
      submitData.append("language", formData.language);

      // Add designation if available
      if (formData.designation) {
        submitData.append("designation", formData.designation);
      }

      // Add years of experience if available
      if (formData.yearsOfExperience) {
        submitData.append("yearsOfExperience", formData.yearsOfExperience);
      }

      // Add profile image file if selected
      if (profileImageFile) {
        submitData.append("profile", profileImageFile);
        console.log("Adding profile image file:", profileImageFile.name);
      }

      // Add cover image file if selected
      if (coverImageFile) {
        submitData.append("coverPhoto", coverImageFile);
        console.log("Adding cover photo file:", coverImageFile.name);
      }

      console.log("Sending FormData with files:", submitData);

      // Call the API to update profile
      const response = await updateMyprofile(submitData).unwrap();
      console.log("API Response:", response);

      // Update local state
      setProfileData(formData);
      console.log("Profile updated successfully:", formData);

      // Show success message
      toast.success("Profile updated successfully!");

      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form to current profile data
    reset(profileData);
    setIsDialogOpen(false);
  };

  // Reset form when dialog opens
  const handleDialogOpen = (open) => {
    if (open) {
      // Always reset to current profile data
      console.log("Dialog opening, resetting form with:", profileData);
      reset(profileData);

      // Always set profile image preview to current profile image from API
      if (data?.data?.profile) {
        setProfileImage(getImageUrl(data.data.profile));
      } else {
        setProfileImage("/client/profile/client.png");
      }

      // Always set cover image preview to current cover image from API
      if (data?.data?.coverPhoto) {
        setCoverImage(getImageUrl(data.data.coverPhoto));
      } else {
        setCoverImage(null);
      }

      // Clear any selected files
      setProfileImageFile(null);
      setCoverImageFile(null);

      // Force update service and category fields if they're available
      if (data?.data && services.length > 0 && categories.length > 0) {
        console.log("Dialog opened, updating service/category fields");

        const findServiceId = (serviceValue) => {
          if (!serviceValue) return "";
          const serviceById = services.find((s) => s._id === serviceValue);
          if (serviceById) return serviceById._id;
          const serviceByName = services.find((s) => s.name === serviceValue);
          return serviceByName ? serviceByName._id : String(serviceValue);
        };

        const findCategoryId = (categoryValue) => {
          if (!categoryValue) return "";
          const categoryById = categories.find((c) => c._id === categoryValue);
          if (categoryById) return categoryById._id;
          const categoryByName = categories.find(
            (c) => c.name === categoryValue
          );
          return categoryByName ? categoryByName._id : String(categoryValue);
        };

        const serviceId = Array.isArray(data.data.serviceType)
          ? findServiceId(data.data.serviceType[0])
          : findServiceId(data.data.serviceType);
        const categoryId = Array.isArray(data.data.categoryType)
          ? findCategoryId(data.data.categoryType[0])
          : findCategoryId(data.data.categoryType);

        console.log(
          "Setting service ID:",
          serviceId,
          "category ID:",
          categoryId
        );
        setValue("serviceType", serviceId);
        setValue("categoryType", categoryId);
      }
    }
    setIsDialogOpen(open);
  };

  // Loading state for dropdowns
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
      {/* Edit button positioned absolutely */}
      <div className="flex items-center justify-end">
        {curentUser === "freelancer" && (
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="button-gradient">
                Edit Profile
                <Edit className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="md:min-w-3xl lg:min-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="flex flex-row items-center justify-between pb-4">
                <DialogTitle className="text-xl font-semibold text-blue-600 h2-gradient-text">
                  Edit Profile
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Profile Images */}
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-32 h-32 md:w-52 md:h-52 rounded-full overflow-hidden border-4 ">
                        <Image
                          src={profileImage}
                          alt="Profile"
                          width={300}
                          height={300}
                          className="w-full h-full object-cover "
                        />
                      </div>
                      <div className="relative">
                        <Input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "profile")}
                          className="absolute inset-0 opacity-0 cursor-pointer "
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          asChild
                        >
                          <label
                            htmlFor="profile-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            Change Profile Picture
                          </label>
                        </Button>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-52 h-32 rounded-lg overflow-hidden relative">
                        {coverImage || data?.data?.coverPhoto ? (
                          <Image
                            src={
                              coverImage || getImageUrl(data.data.coverPhoto)
                            }
                            alt="Cover"
                            width={208}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                            <div className="relative z-10 text-center">
                              <div className="text-lg font-bold">UI/UX</div>
                              <div className="text-lg font-bold">DESIGN</div>
                              <div className="text-xs opacity-80 mt-1">
                                WATCH NOW
                              </div>
                            </div>
                            {/* Design elements */}
                            <div className="absolute right-4 top-4">
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
                              </div>
                            </div>
                            <div className="absolute left-4 bottom-4 text-xs opacity-60">
                              Websites to learn
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "cover")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          id="cover-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          asChild
                        >
                          <label
                            htmlFor="cover-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            Change Cover
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Form Fields */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="name"
                        control={control}
                        rules={{
                          required: "Name is required",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="name"
                            className={`w-full ${
                              errors.name ? "border-red-500" : ""
                            }`}
                            placeholder="Enter your full name"
                          />
                        )}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Daily Rate */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="dailyRate"
                        className="text-sm font-medium"
                      >
                        Daily Rate <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="dailyRate"
                        control={control}
                        rules={{
                          required: "Daily rate is required",
                        }}
                        render={({ field }) => (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <Input
                              {...field}
                              id="dailyRate"
                              type="number"
                              className={`w-full pl-8 ${
                                errors.dailyRate ? "border-red-500" : ""
                              }`}
                              placeholder="500"
                            />
                          </div>
                        )}
                      />
                      {errors.dailyRate && (
                        <p className="text-sm text-red-500">
                          {errors.dailyRate.message}
                        </p>
                      )}
                    </div>

                    {/* Service Type Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Service Type <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="serviceType"
                        control={control}
                        rules={{ required: "Service type is required" }}
                        render={({ field }) => (
                          <Select
                            value={String(field.value || "")}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors.serviceType ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue
                                placeholder={
                                  serviceLoading
                                    ? "Loading services..."
                                    : services.length === 0
                                    ? "No services available"
                                    : "Select service type"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {services.length > 0 ? (
                                services.map((service) => (
                                  <SelectItem
                                    key={service._id}
                                    value={service._id}
                                  >
                                    {service.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  No services available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.serviceType && (
                        <p className="text-sm text-red-500">
                          {errors.serviceType.message}
                        </p>
                      )}
                      {serviceError && (
                        <p className="text-sm text-yellow-600">
                          Failed to load services
                        </p>
                      )}
                    </div>

                    {/* Category Type Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Category Type <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="categoryType"
                        control={control}
                        rules={{ required: "Category type is required" }}
                        render={({ field }) => (
                          <Select
                            value={String(field.value || "")}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors.categoryType ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue
                                placeholder={
                                  categoryLoading
                                    ? "Loading categories..."
                                    : categories.length === 0
                                    ? "No categories available"
                                    : "Select category"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.length > 0 ? (
                                categories.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  No categories available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.categoryType && (
                        <p className="text-sm text-red-500">
                          {errors.categoryType.message}
                        </p>
                      )}
                      {categoryError && (
                        <p className="text-sm text-yellow-600">
                          Failed to load categories
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="location"
                        control={control}
                        rules={{ required: "Location is required" }}
                        render={({ field }) => (
                          <Select
                            value={String(field.value || "")}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors.location ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bangladesh">
                                Bangladesh
                              </SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="Pakistan">Pakistan</SelectItem>
                              <SelectItem value="USA">USA</SelectItem>
                              <SelectItem value="UK">UK</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="Australia">
                                Australia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="designation"
                        className="text-sm font-medium"
                      >
                        Designation
                      </Label>
                      <Controller
                        name="designation"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="designation"
                            className="w-full"
                            placeholder="Enter your designation"
                          />
                        )}
                      />
                    </div>

                    {/* Years of Experience */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="yearsOfExperience"
                        className="text-sm font-medium"
                      >
                        Years of Experience
                      </Label>
                      <Controller
                        name="yearsOfExperience"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="yearsOfExperience"
                            className="w-full"
                            placeholder="e.g., 5 years"
                          />
                        )}
                      />
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Language <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="language"
                        control={control}
                        rules={{ required: "Language is required" }}
                        render={({ field }) => (
                          <Select
                            value={String(field.value || "")}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors.language ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bengali">Bengali</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                              <SelectItem value="Urdu">Urdu</SelectItem>
                              <SelectItem value="Arabic">Arabic</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.language && (
                        <p className="text-sm text-red-500">
                          {errors.language.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dialog Footer */}
                <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 button-gradient"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Main profile content */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-6">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 w-full lg:w-auto">
          {/* Profile Image */}
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
            {/* Online Indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          {/* Profile Info */}
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

                          {/* Delete Button - Shows on Hover */}
                          <button
                            onClick={() =>
                              handleDeleteSocialLink(socialLink._id)
                            }
                            disabled={isDeletingSocialLink}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

            {/* Add Social Link Button */}
            <Button
              variant="outline"
              className="w-8 h-8 rounded-full border-dashed flex items-center justify-center"
              onClick={() => setIsSocialLinkDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Social Link Add Dialog */}
      <SocialLinkAddDialog
        isOpen={isSocialLinkDialogOpen}
        onClose={() => setIsSocialLinkDialogOpen(false)}
      />
    </div>
  );
}

export default ProfileHeader;
