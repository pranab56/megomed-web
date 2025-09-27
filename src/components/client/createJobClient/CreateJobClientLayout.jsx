"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCreateJobMutation } from '../../../features/jobBoard/jobBoardApi';
import CreateJobTopForm from "./CreateJobTopForm";
import JobDescription from "./JobDescription";

function CreateJobClientLayout() {
  const router = useRouter();
  const [createJob, { isLoading, isError, isSuccess, error }] = useCreateJobMutation();

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
    jobTitle: "User Experience Designer",
    jobType: "Full Time",
    jobLink: "https://yourcompany.com/job123",
    startDate: getDefaultDates().startDate,
    endDate: getDefaultDates().endDate,
    uploadedImage: null,
    description: "",
    categoryId: "",
    serviceTypeId: "",
  });

  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      handleReset();
      router.push("/thank-you-page");
    }

    if (isError) {
      console.error("Failed to post job:", error?.data?.message || error);
    }
  }, [isSuccess, isError, error, router]);

  // Handle data changes from CreateJobTopForm
  const handleTopFormDataChange = useCallback((formData) => {
    setJobData(prev => ({
      ...prev,
      ...formData
    }));
  }, []);

  // Handle description changes from JobDescription
  const handleDescriptionChange = useCallback((description) => {
    setJobData(prev => ({
      ...prev,
      description
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

    if (!jobData.startDate) {
      errors.push("Start date is required");
    }

    if (!jobData.endDate) {
      errors.push("End date is required");
    }

    if (jobData.startDate && jobData.endDate && new Date(jobData.startDate) >= new Date(jobData.endDate)) {
      errors.push("End date must be after start date");
    }

    if (!jobData.description.trim()) {
      errors.push("Job description is required");
    }

    if (!jobData.categoryId) {
      errors.push("Category is required");
    }

    if (!jobData.serviceTypeId) {
      errors.push("Service type is required");
    }

    return errors;
  };

  const handleReset = () => {
    const defaultDates = getDefaultDates();
    setJobData({
      jobTitle: "User Experience Designer",
      jobType: "Full Time",
      jobLink: "https://yourcompany.com/job123",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      uploadedImage: null,
      description: "",
      categoryId: "",
      serviceTypeId: "",
    });
    setResetFormTrigger(prev => !prev);
  };

  const handlePostJob = async () => {
    try {
      // Validate data first
      const validationErrors = validateJobData();

      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          console.error("Validation error:", error);
        });
        alert("Please fix the following errors:\n" + validationErrors.join("\n"));
        return;
      }

      // Format data for API
      const formData = new FormData();

      // Add basic fields
      formData.append('title', jobData.jobTitle);
      formData.append('jobType', jobData.jobType);
      formData.append('websiteLink', jobData.jobLink);
      formData.append('description', jobData.description);
      formData.append('categoryId', jobData.categoryId);
      formData.append('serviceTypeId', jobData.serviceTypeId);

      // Add image if uploaded
      if (jobData.uploadedImage) {
        formData.append('image', jobData.uploadedImage);
      }

      formData.append('startDate', jobData.startDate.toISOString());
      formData.append('endDate', jobData.endDate.toISOString());

      // Make API call
      const response = await createJob(formData).unwrap();
      console.log('Job created successfully:', response);

    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All unsaved data will be lost.")) {
      handleReset();
      router.back();
    }
  };

  return (
    <div className="space-y-6">
      <CreateJobTopForm
        onDataChange={handleTopFormDataChange}
        resetForm={resetFormTrigger}
        initialStartDate={jobData.startDate}
        initialEndDate={jobData.endDate}
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

export default CreateJobClientLayout;