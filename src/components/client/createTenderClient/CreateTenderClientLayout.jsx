"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TipTapEditor from "@/utils/TipTapEditor/TipTapEditor";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetAllCategoryQuery } from "../../../features/category/categoryApi";
import { useGetAllServicesQuery } from "../../../features/services/servicesApi";
import { useCreateTenderMutation } from "../../../features/tender/tenderApi";

function CreateTenderClientLayout() {
  const router = useRouter();
  const { type } = useParams();

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
  const [
    createTender,
    { isLoading: isCreatingTender, isError: createTenderError },
  ] = useCreateTenderMutation();

  // State for all tender data
  const [tenderData, setTenderData] = useState({
    projectTitle: "",
    category: "",
    serviceType: "",
    startDate: null,
    endDate: null,
    tenderDescription: "",
    uploadedImage: null,
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Initialize dates on component mount
  useEffect(() => {
    const currentDate = new Date();
    const nextDay = addDays(currentDate, 1);

    setTenderData((prev) => ({
      ...prev,
      startDate: currentDate,
      endDate: nextDay,
    }));
  }, []);

  // Filter only active categories and services
  const activeCategories = useMemo(
    () =>
      categoryData?.data?.filter(
        (category) => category.isActive && !category.isDeleted
      ) || [],
    [categoryData]
  );

  const activeServices = useMemo(
    () =>
      serviceData?.data?.filter(
        (service) => service.isActive && !service.isDeleted
      ) || [],
    [serviceData]
  );

  // Update specific field in tender data - useCallback to prevent unnecessary re-renders
  const updateTenderData = useCallback(
    (field, value) => {
      setTenderData((prev) => {
        const updatedData = {
          ...prev,
          [field]: value,
        };

        // If start date is changed, update end date to be one day after the new start date
        if (field === "startDate" && value) {
          updatedData.endDate = addDays(value, 1);
        }

        return updatedData;
      });

      // Clear any previous errors when user starts typing
      if (submitError) setSubmitError("");
      if (submitSuccess) setSubmitSuccess("");
    },
    [submitError, submitSuccess]
  );

  // Handle image upload
  const handleImageUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setSubmitError("Image size should be less than 5MB");
          return;
        }

        // Validate file type
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
          setSubmitError("Please upload a valid image file (JPEG, PNG, GIF)");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          updateTenderData("uploadedImage", {
            file: file,
            preview: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [updateTenderData]
  );

  // Handle date selection
  const handleStartDateSelect = useCallback(
    (date) => {
      if (date) {
        updateTenderData("startDate", date);
      }
    },
    [updateTenderData]
  );

  const handleEndDateSelect = useCallback(
    (date) => {
      if (date) {
        updateTenderData("endDate", date);
      }
    },
    [updateTenderData]
  );

  // Handle tender description from TipTap
  const handleTenderDescription = useCallback((description) => {
    setTenderData((prev) => ({
      ...prev,
      tenderDescription: description,
    }));
  }, []);

  // Reset all form data
  const resetTenderData = useCallback(() => {
    const currentDate = new Date();
    const nextDay = addDays(currentDate, 1);

    setTenderData({
      projectTitle: "",
      category: "",
      serviceType: "",
      startDate: currentDate,
      endDate: nextDay,
      tenderDescription: "",
      uploadedImage: null,
    });
    setSubmitError("");
    setSubmitSuccess("");
  }, []);

  // Validate form data
  const validateFormData = useCallback(() => {
    const errors = [];

    if (!tenderData.projectTitle.trim()) {
      errors.push("Project title is required");
    }

    if (!tenderData.category) {
      errors.push("Category is required");
    }

    if (!tenderData.serviceType) {
      errors.push("Service type is required");
    }

    if (!tenderData.startDate) {
      errors.push("Start date is required");
    }

    if (!tenderData.endDate) {
      errors.push("End date is required");
    }

    if (
      tenderData.startDate &&
      tenderData.endDate &&
      tenderData.startDate >= tenderData.endDate
    ) {
      errors.push("End date must be after start date");
    }

    if (!tenderData.tenderDescription.trim()) {
      errors.push("Tender description is required");
    }

    return errors;
  }, [tenderData]);

  // Format date for API (ISO string format)
  const formatDateForAPI = (date) => {
    if (!date) return null;
    return date.toISOString();
  };

  // Handle post tender
  const handlePostTender = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      console.log("Complete Tender Data:", tenderData);

      // Validate form data
      const validationErrors = validateFormData();
      if (validationErrors.length > 0) {
        setSubmitError(validationErrors.join(", "));
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Append all required fields with correct names matching your API
      formData.append("title", tenderData.projectTitle.trim());
      formData.append("startDate", formatDateForAPI(tenderData.startDate));
      formData.append("endDate", formatDateForAPI(tenderData.endDate));
      formData.append("description", tenderData.tenderDescription.trim());
      formData.append("serviceTypeId", tenderData.serviceType);
      formData.append("categoryId", tenderData.category);

      // Append image file (not the whole object)
      if (tenderData.uploadedImage && tenderData.uploadedImage.file) {
        formData.append("image", tenderData.uploadedImage.file);
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Make API call
      const response = await createTender(formData).unwrap();

      console.log("API Response:", response);

      // Show success message
      setSubmitSuccess("Tender created successfully!");

      // Reset form after successful submission
      setTimeout(() => {
        resetTenderData();
        // Redirect to success page or tender list
        router.push("/thank-you-page?type=tender");
      }, 2000);
    } catch (error) {
      console.error("Error creating tender:", error);

      // Handle different types of errors
      let errorMessage = "Failed to create tender. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [tenderData, validateFormData, createTender, resetTenderData, router]);

  // CreateTenderTopForm Component
  const CreateTenderTopForm = useMemo(
    () => () =>
      (
        <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Greeting */}
            <div className="space-y-2">
              {/* <h2 className="text-2xl font-medium h2-gradient-text">
            Hi MD SABBIR,
          </h2> */}
              <h1 className="text-5xl mb-8">
                Discover top talent for your next project.
              </h1>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium">Project title*</label>
                <input
                  type="text"
                  value={tenderData.projectTitle}
                  onChange={(e) =>
                    updateTenderData("projectTitle", e.target.value)
                  }
                  placeholder="Enter project title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Category*</label>
                <Select
                  value={tenderData.category}
                  onValueChange={(value) => updateTenderData("category", value)}
                  disabled={categoryLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        categoryLoading
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.length > 0 ? (
                      activeCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-category" disabled>
                        {categoryLoading
                          ? "Loading..."
                          : "No categories available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Type Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Service Type*</label>
                <Select
                  value={tenderData.serviceType}
                  onValueChange={(value) =>
                    updateTenderData("serviceType", value)
                  }
                  disabled={serviceLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        serviceLoading
                          ? "Loading services..."
                          : "Select service type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {activeServices.length > 0 ? (
                      activeServices.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {service.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-service" disabled>
                        {serviceLoading
                          ? "Loading..."
                          : "No services available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Upload Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-500">
                      {tenderData.uploadedImage
                        ? tenderData.uploadedImage.file.name
                        : "Click to upload image"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Max size: 5MB. Formats: JPEG, PNG, GIF
                    </span>
                  </label>
                  {tenderData.uploadedImage && (
                    <div className="mt-4">
                      <img
                        src={tenderData.uploadedImage.preview}
                        alt="Preview"
                        className="max-w-full h-32 object-cover mx-auto rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Start Date */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Start Date*</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !tenderData.startDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tenderData.startDate
                          ? format(tenderData.startDate, "MM/dd/yyyy")
                          : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tenderData.startDate}
                        onSelect={handleStartDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium">End Date*</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !tenderData.endDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tenderData.endDate
                          ? format(tenderData.endDate, "MM/dd/yyyy")
                          : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tenderData.endDate}
                        onSelect={handleEndDateSelect}
                        initialFocus
                        disabled={(date) => {
                          // End date should always be at least one day after start date
                          if (tenderData.startDate) {
                            return date <= tenderData.startDate;
                          }
                          return date <= new Date();
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    [
      tenderData,
      activeCategories,
      activeServices,
      updateTenderData,
      handleImageUpload,
      handleStartDateSelect,
      handleEndDateSelect,
      categoryLoading,
      serviceLoading,
    ]
  );

  // TenderDescription Component
  const TenderDescription = useMemo(
    () => () =>
      (
        <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-medium">Tender Description*</h2>
              <p className="text-gray-600">
                This will be visible to anyone who views your tender post.
              </p>
            </div>
            <div>
              <TipTapEditor
                handleJobDescription={handleTenderDescription}
                key="tiptap-editor"
                placeholder="Describe your project requirements, expectations, and any specific details..."
              />
            </div>
          </div>
        </div>
      ),
    [handleTenderDescription]
  );

  // Loading states
  if (categoryLoading || serviceLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading categories and services...</div>
        </div>
      </div>
    );
  }

  // Error states
  if (categoryError || serviceError) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            Error loading categories or services. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateTenderTopForm />
      <TenderDescription />

      {/* Error and Success Messages */}
      {(submitError || submitSuccess) && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="text-red-800">
                  <strong>Error:</strong> {submitError}
                </div>
              </div>
            </div>
          )}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="text-green-800">
                  <strong>Success:</strong> {submitSuccess}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0 flex flex-col md:flex-row md:justify-center lg:justify-end gap-4">
        <Button
          className="bg-white text-black hover:bg-gray-100 border"
          onClick={resetTenderData}
          disabled={isSubmitting || isCreatingTender}
        >
          Cancel
        </Button>
        <Button
          className="button-gradient"
          onClick={handlePostTender}
          disabled={isSubmitting || isCreatingTender}
        >
          {isSubmitting || isCreatingTender
            ? "Creating Tender..."
            : "Post Tender"}
        </Button>
      </div>
    </div>
  );
}

export default CreateTenderClientLayout;
