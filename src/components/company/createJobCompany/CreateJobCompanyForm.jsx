"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { useGetAllCategoryQuery } from "../../../features/category/categoryApi";

export default function CreateJobCompanyForm({
  onDataChange,
  resetForm,
  initialEndDate,
}) {
  // Function to get default dates
  const getDefaultDates = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 1); // End date is one day ahead

    return { startDate, endDate };
  };

  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [jobLink, setJobLink] = useState("https://yourcompany.com/job123");
  const [duration, setDuration] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState(
    initialEndDate || getDefaultDates().endDate
  );
  const [uploadedImage, setUploadedImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  // const [serviceTypeId, setServiceTypeId] = useState("");
  const [location, setLocation] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useGetAllCategoryQuery();

  // Update application deadline when initial date changes
  useEffect(() => {
    if (initialEndDate) {
      setApplicationDeadline(initialEndDate);
    }
  }, [initialEndDate]);

  // Send data to parent component whenever it changes
  useEffect(() => {
    const formData = {
      jobTitle,
      jobType,
      jobLink,
      duration,
      applicationDeadline,
      uploadedImage,
      categoryId,
      // serviceTypeId,
      location,
      minBudget,
      maxBudget,
      skills,
    };

    if (onDataChange) {
      onDataChange(formData);
    }
  }, [
    jobTitle,
    jobType,
    jobLink,
    duration,
    applicationDeadline,
    uploadedImage,
    categoryId,
    // serviceTypeId,
    location,
    minBudget,
    maxBudget,
    skills,
    onDataChange,
  ]);

  // Reset form when resetForm prop changes
  useEffect(() => {
    if (resetForm) {
      const defaultDates = getDefaultDates();
      setJobTitle("");
      setJobType("Full Time");
      setJobLink("https://yourcompany.com/job123");
      setDuration("");
      setApplicationDeadline(defaultDates.endDate);
      setUploadedImage(null);
      setCategoryId("");
      setLocation("");
      setMinBudget("");
      setMaxBudget("");
      setSkills([]);
      setSkillInput("");
    }
  }, [resetForm]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleSkillAdd = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Greeting */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-blue-600">Hi MD SABBIR,</h2>
          <h1 className="text-5xl mb-8">Find your next great hire</h1>
        </div>

        {/* Job Form Fields */}
        <div className="space-y-4">
          {/* Job Title */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Job title*</label>
            <Input
              placeholder="e.g., Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {/* Job Type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Job Type</label>
            <Select
              value={jobType}
              onValueChange={(value) => setJobType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Time">Full Time</SelectItem>
                <SelectItem value="Part Time">Part Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Category Type*</label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value)}
              disabled={categoryLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : categoryError ? (
                  <SelectItem value="error" disabled>
                    Error loading categories
                  </SelectItem>
                ) : (
                  categoryData?.data?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Job Link */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Job Apply Website Link*</label>
            <Input
              placeholder="https://yourcompany.com/job123"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Location*</label>
            <Input
              placeholder="e.g., New York, NY or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Min Budget ($)*</label>
              <Input
                type="number"
                placeholder="1000"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                min="0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Max Budget ($)*</label>
              <Input
                type="number"
                placeholder="5000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Required Skills*</label>
            <Input
              placeholder="Type a skill and press Enter (e.g., JavaScript, React, Node.js)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillAdd}
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Image */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Upload Image</label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="button-gradient cursor-pointer w-fit  gap-2 border px-4 py-2 rounded-md"
            >
              {uploadedImage ? uploadedImage.name : "Upload Image"}
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Duration */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Duration*</label>
          <Input
            placeholder="e.g., 10 days, 2 weeks, 3 months"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {/* Application Deadline */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Application Deadline*</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !applicationDeadline && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {applicationDeadline
                  ? format(applicationDeadline, "MM/dd/yyyy")
                  : "mm/dd/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={applicationDeadline}
                onSelect={(date) => setApplicationDeadline(date)}
                initialFocus
                disabled={(date) => {
                  // Disable dates that are before today
                  return date < new Date();
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
