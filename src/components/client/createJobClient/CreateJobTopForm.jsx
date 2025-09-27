"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
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
import { useGetAllCategoryQuery } from '../../../features/category/categoryApi';
import { useGetAllServicesQuery } from '../../../features/services/servicesApi';

export default function CreateJobTopForm({ onDataChange, resetForm, initialStartDate, initialEndDate }) {
  // Function to get default dates
  const getDefaultDates = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 1); // End date is one day ahead
    
    return { startDate, endDate };
  };

  const [jobTitle, setJobTitle] = useState("User Experience Designer");
  const [jobType, setJobType] = useState("Full Time");
  const [jobLink, setJobLink] = useState("https://yourcompany.com/job123");
  const [startDate, setStartDate] = useState(initialStartDate || getDefaultDates().startDate);
  const [endDate, setEndDate] = useState(initialEndDate || getDefaultDates().endDate);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");

  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useGetAllCategoryQuery();
  const { data: serviceData, isLoading: serviceLoading, isError: serviceError } = useGetAllServicesQuery();

  // Update dates when initial dates change
  useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
    }
    if (initialEndDate) {
      setEndDate(initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  // Send data to parent component whenever it changes
  useEffect(() => {
    const formData = {
      jobTitle,
      jobType,
      jobLink,
      startDate,
      endDate,
      uploadedImage,
      categoryId,
      serviceTypeId,
    };

    if (onDataChange) {
      onDataChange(formData);
    }
  }, [jobTitle, jobType, jobLink, startDate, endDate, uploadedImage, categoryId, serviceTypeId, onDataChange]);

  // Reset form when resetForm prop changes
  useEffect(() => {
    if (resetForm) {
      const defaultDates = getDefaultDates();
      setJobTitle("User Experience Designer");
      setJobType("Full Time");
      setJobLink("https://yourcompany.com/job123");
      setStartDate(defaultDates.startDate);
      setEndDate(defaultDates.endDate);
      setUploadedImage(null);
      setCategoryId("");
      setServiceTypeId("");
    }
  }, [resetForm]);

  // Update end date when start date changes to ensure it's always after start date
  useEffect(() => {
    if (startDate && endDate && startDate >= endDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
    }
  }, [startDate, endDate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    
    // If the selected start date is after or equal to the current end date,
    // automatically set end date to one day after the new start date
    if (date && endDate && date >= endDate) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Greeting */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-blue-600">
            Hi MD SABBIR,
          </h2>
          <h1 className="text-5xl mb-8">Find your next great hire</h1>
        </div>

        {/* Job Form Fields */}
        <div className="space-y-4">
          {/* Job Title */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Job title*</label>
            <Select
              value={jobTitle}
              onValueChange={(value) => setJobTitle(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select job title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User Experience Designer">
                  User Experience Designer
                </SelectItem>
                <SelectItem value="UI Designer">UI Designer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Service Type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Service Type*</label>
            <Select
              value={serviceTypeId}
              onValueChange={(value) => setServiceTypeId(value)}
              disabled={serviceLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading services...
                  </SelectItem>
                ) : serviceError ? (
                  <SelectItem value="error" disabled>
                    Error loading services
                  </SelectItem>
                ) : (
                  serviceData?.data?.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.name}
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

          {/* Upload Image */}
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
                  {uploadedImage ? uploadedImage.name : "Upload Image"}
                </span>
              </label>
            </div>
          </div>
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
                className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"
                  }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
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
                className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"
                  }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => setEndDate(date)}
                initialFocus
                disabled={(date) => {
                  // Disable dates that are before or equal to start date
                  return startDate ? date <= startDate : date < new Date();
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}