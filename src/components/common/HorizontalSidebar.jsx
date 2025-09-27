"use client";
import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "../ui/label";

function HorizontalSidebar() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const serviceType = [
    "Web Development",
    "Graphic Design",
    "Writing & Content",
    "Digital Marketing",
    "Video Production",
    "Mobile App Development",
    "Virtual Assistant",
    "Translation & Languages",
    "Consulting & Strategy",
    "Software Development",
  ];

  const categoryType = [
    "Front-End Development",
    "Back-End Development",
    "Full Stack Development",
    "E-commerce Development",
    "CMS Development",
    "WordPress Development",
  ];

  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className=" mb-6">
      <Label className="text-sm font-medium text-gray-700">Service Type</Label>
      <ScrollArea className="w-full mt-2">
        <div
          className="flex flex-wrap space-x-3 pb-2"
          style={{ minWidth: "max-content" }}
        >
          {/* Service Type Filters */}
          {serviceType.map((service, index) => (
            <button
              key={index}
              onClick={() => handleServiceToggle(service)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedServices.includes(service)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {service}
            </button>
          ))}

          {/* Category Type Filters */}
          {categoryType.map((category, index) => (
            <button
              key={`category-${index}`}
              onClick={() => handleCategoryToggle(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategories.includes(category)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Label className="text-sm font-medium text-gray-700 mt-4">
        Category Type
      </Label>
      <ScrollArea className="w-full mt-2">
        <div
          className="flex flex-wrap space-x-3 pb-2 "
          style={{ minWidth: "max-content" }}
        >
          {/* Category Type Filters */}
          {categoryType.map((category, index) => (
            <button
              key={`category-${index}`}
              onClick={() => handleCategoryToggle(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategories.includes(category)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export default HorizontalSidebar;
