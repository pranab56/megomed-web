"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

function FilterDrawer({ isOpen, onClose }) {
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

  const handleServiceChange = (service, checked) => {
    if (checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    }
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleReset = () => {
    setSelectedServices([]);
    setSelectedCategories([]);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="left">
      <DrawerContent className="w-[70%] h-full left-0 right-auto top-0 bottom-0">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-lg font-semibold text-gray-900">
            Filters
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-8">
          {/* Service Type Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Service Type
            </h2>
            <div className="space-y-3">
              {serviceType.map((service, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`service-${index}`}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={(checked) =>
                      handleServiceChange(service, checked)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`service-${index}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Category Type Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Category Type
            </h2>
            <div className="space-y-3">
              {categoryType.map((category, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${index}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`category-${index}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>

          {/* Selected Items Summary */}
          {(selectedServices.length > 0 || selectedCategories.length > 0) && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Selected Filters (
                {selectedServices.length + selectedCategories.length})
              </h3>
              <div className="space-y-2">
                {selectedServices.map((service, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {service}
                  </div>
                ))}
                {selectedCategories.map((category, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mr-2 mb-2"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default FilterDrawer;
