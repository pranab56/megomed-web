"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

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

export default function CreateTenderTopForm() {
  const [projectTitle, setProjectTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle date selection
  const handleStartDateSelect = (date) => {
    setStartDate(date);
  };

  const handleEndDateSelect = (date) => {
    setEndDate(date);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="grid  lg:grid-cols-2 gap-6 ">
        {/* Greeting */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium h2-gradient-text">
            Hi MD SABBIR,
          </h2>
          <h1 className="text-5xl mb-8">
            Discover top talent for your next project.
          </h1>
        </div>

        {/* Job Title */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2 ">
            <label className="font-medium">Project title*</label>
            <Select
              value={projectTitle}
              onValueChange={(value) => setProjectTitle(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ux-designer">
                  User Experience Designer
                </SelectItem>
                <SelectItem value="ui-designer">UI Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 ">
            <label className="font-medium">Category*</label>
            <Select
              value={projectTitle}
              onValueChange={(value) => setProjectTitle(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ux-designer">
                  User Experience Designer
                </SelectItem>
                <SelectItem value="ui-designer">UI Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="flex flex-col gap-2 ">
            <label className="font-medium">Service Type*</label>
            <Select
              value={projectTitle}
              onValueChange={(value) => setProjectTitle(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ux-designer">
                  User Experience Designer
                </SelectItem>
                <SelectItem value="ui-designer">UI Designer</SelectItem>
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
                  {uploadedImage ? uploadedImage.name : "Upload Image"}
                </span>
              </label>
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
                    onSelect={handleEndDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}