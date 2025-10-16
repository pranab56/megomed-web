"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCreateJobMutation } from "../../../features/jobBoard/jobBoardApi";
import CreateJobCompanyForm from "./CreateJobCompanyForm";
import JobDescription from "./JobDescription";
import toast from "react-hot-toast";

function CreateJobCompanyLayout() {
  const router = useRouter();
  const [createJob, { isLoading, isError, isSuccess, error }] =
    useCreateJobMutation();

  // Function to get dates based on current date
  const getDefaultDates = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 1); // End date is one day ahead

    return { startDate, endDate };
  };

  // Local state to manage all job data
  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobType: "Full Time",
    jobLink: "https://yourcompany.com/job123",
    duration: "",
    applicationDeadline: getDefaultDates().endDate,
    uploadedImage: null,
    description: "",
    categoryId: "",
    location: "",
    minBudget: "",
    maxBudget: "",
    skills: [],
    posterType: "company",
  });

  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      toast.success("Job posted successfully!");
      handleReset();
      router.push("/thank-you-page");
    }

    if (isError) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to post job";
      console.error("Failed to post job:", error);
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, router]);

  // Handle data changes from CreateJobCompanyForm
  const handleTopFormDataChange = useCallback((formData) => {
    setJobData((prev) => ({
      ...prev,
      ...formData,
    }));
  }, []);

  // Handle description changes from JobDescription
  const handleDescriptionChange = useCallback((description) => {
    setJobData((prev) => ({
      ...prev,
      description,
    }));
  }, []);

  const validateJobData = () => {
    const errors = [];

    if (!jobData.jobTitle.trim()) {
      errors.push("Job title is required");
    }

    if (!jobData.jobLink.trim()) {
      errors.push("Job application link is required");
    }

    if (!jobData.duration.trim()) {
      errors.push("Duration is required");
    }

    if (!jobData.applicationDeadline) {
      errors.push("Application deadline is required");
    }

    if (
      jobData.applicationDeadline &&
      new Date(jobData.applicationDeadline) < new Date()
    ) {
      errors.push("Application deadline must be in the future");
    }

    if (!jobData.description.trim()) {
      errors.push("Job description is required");
    }

    if (!jobData.categoryId) {
      errors.push("Category is required");
    }

    if (!jobData.location.trim()) {
      errors.push("Location is required");
    }

    if (!jobData.minBudget || jobData.minBudget <= 0) {
      errors.push("Minimum budget is required and must be greater than 0");
    }

    if (!jobData.maxBudget || jobData.maxBudget <= 0) {
      errors.push("Maximum budget is required and must be greater than 0");
    }

    if (
      jobData.minBudget &&
      jobData.maxBudget &&
      parseFloat(jobData.minBudget) >= parseFloat(jobData.maxBudget)
    ) {
      errors.push("Maximum budget must be greater than minimum budget");
    }

    if (!jobData.skills || jobData.skills.length === 0) {
      errors.push("At least one skill is required");
    }

    return errors;
  };

  const handleReset = () => {
    const defaultDates = getDefaultDates();
    setJobData({
      jobTitle: "",
      jobType: "Full Time",
      jobLink: "https://yourcompany.com/job123",
      duration: "",
      applicationDeadline: defaultDates.endDate,
      uploadedImage: null,
      description: "",
      categoryId: "",
      location: "",
      minBudget: "",
      maxBudget: "",
      skills: [],
      posterType: "client",
    });
    setResetFormTrigger((prev) => !prev);
  };

  const handlePostJob = async () => {
    try {
      // Validate data first
      const validationErrors = validateJobData();

      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          console.error("Validation error:", error);
        });
        toast.error(
          "Please fix the following errors:\n" + validationErrors.join("\n")
        );
        return;
      }

      // Format data for API
      const formData = new FormData();

      // Add basic fields
      formData.append("title", jobData.jobTitle);
      formData.append("jobType", jobData.jobType);
      formData.append("websiteLink", jobData.jobLink);
      formData.append("description", jobData.description);
      formData.append("categoryId", jobData.categoryId);
      formData.append("location", jobData.location);
      formData.append("min_budget", jobData.minBudget);
      formData.append("max_budget", jobData.maxBudget);
      formData.append("skills", jobData.skills);
      formData.append("posterType", jobData.posterType);

      // Add image if uploaded
      if (jobData.uploadedImage) {
        formData.append("image", jobData.uploadedImage);
      }

      formData.append("duration", jobData.duration);
      formData.append(
        "application_deadline",
        jobData.applicationDeadline.toISOString()
      );

      // Make API call
      const response = await createJob(formData).unwrap();
      console.log("Job created successfully:", response);
    } catch (error) {
      console.error("Error posting job:", error);

      // Extract error message from different possible error structures
      let errorMessage = "Failed to post job. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.errorSources?.[0]?.message) {
        errorMessage = error.data.errorSources[0].message;
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (
      confirm("Are you sure you want to cancel? All unsaved data will be lost.")
    ) {
      handleReset();
      router.back();
    }
  };

  return (
    <div className="space-y-6">
      <CreateJobCompanyForm
        onDataChange={handleTopFormDataChange}
        resetForm={resetFormTrigger}
        initialEndDate={jobData.applicationDeadline}
      />
      <JobDescription
        onDescriptionChange={handleDescriptionChange}
        resetForm={resetFormTrigger}
      />

      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0 flex flex-col md:flex-row md:justify-center lg:justify-end gap-4">
        <Button
          className="bg-white text-black hover:bg-gray-100 border"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className="button-gradient"
          onClick={handlePostJob}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Posting...
            </div>
          ) : (
            "Post Job"
          )}
        </Button>
      </div>
    </div>
  );
}

export default CreateJobCompanyLayout;
