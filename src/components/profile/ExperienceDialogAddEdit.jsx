"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

export default function ExperienceDialogAddEdit({
  isOpen,
  onClose,
  experience = null,
  updateExperience,
}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!experience;

  const translations = useMemo(() => ({
    addTitle: "Add Experience",
    editTitle: "Edit Experience",
    companyNameLabel: "Company Name *",
    companyNamePlaceholder: "Enter Company Name",
    projectLabel: "Project *",
    projectPlaceholder: "Enter Project Name",
    descriptionLabel: "Description *",
    descriptionPlaceholder: "Enter Experience Description",
    startDateLabel: "Start Date *",
    endDateLabel: "End Date",
    startDatePlaceholder: "Pick a start date",
    endDatePlaceholder: "Pick an end date",
    presentLabel: "Present",
    cancelButton: "Cancel",
    saveButton: "Save Changes",
    addSuccessMessage: "Experience added successfully!",
    editSuccessMessage: "Experience updated successfully!",
    errorMessage: "Failed to save experience. Please try again.",
    validationMessages: {
      companyRequired: "Company name is required",
      projectRequired: "Project is required",
      descriptionRequired: "Description is required",
      startDateRequired: "Please select a start date",
    },
  }), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      companyName: "",
      project: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  // Reset form when dialog opens/closes or experience changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && experience) {
        // Set values for editing
        const start = experience.startDate ? new Date(experience.startDate) : null;
        const end = experience.endDate ? new Date(experience.endDate) : null;

        setStartDate(start);
        setEndDate(end);
        setValue("companyName", experience.companyName || "");
        setValue("project", experience.project || "");
        setValue("description", experience.description || "");
        setValue("startDate", experience.startDate || "");
        setValue("endDate", experience.endDate || "");
      } else {
        // Reset for adding new
        reset();
        setStartDate(null);
        setEndDate(null);
      }
    }
  }, [isOpen, isEditing, experience, setValue, reset]);

  const onSubmit = async (data) => {
    if (!startDate) {
      toast.error(translations.validationMessages.startDateRequired);
      return;
    }

    setIsLoading(true);

    try {
      const experienceData = {
        type: "experience",
        companyName: data.companyName,
        project: data.project,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
        description: data.description
      };

      // If editing, include the experience ID
      if (isEditing && experience) {
        experienceData.id = experience._id;
      }

      const response = await updateExperience(experienceData).unwrap();
      console.log("API Response:", response);

      toast.success(isEditing ? translations.editSuccessMessage : translations.addSuccessMessage);
      handleClose();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(translations.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setStartDate(null);
    setEndDate(null);
    onClose?.();
  };

  const handlePresentToggle = () => {
    if (endDate) {
      setEndDate(null);
      setValue("endDate", "");
    } else {
      setEndDate(new Date());
      setValue("endDate", format(new Date(), "yyyy-MM-dd"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-blue-600">
            {isEditing ? translations.editTitle : translations.addTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pb-6 space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-900">
                {translations.companyNameLabel}
              </Label>
              <Input
                id="companyName"
                placeholder={translations.companyNamePlaceholder}
                {...register("companyName", {
                  required: translations.validationMessages.companyRequired,
                })}
              />
              {errors.companyName && (
                <p className="text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium text-gray-900">
                {translations.projectLabel}
              </Label>
              <Input
                id="project"
                placeholder={translations.projectPlaceholder}
                {...register("project", {
                  required: translations.validationMessages.projectRequired,
                })}
              />
              {errors.project && (
                <p className="text-sm text-red-600">{errors.project.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                {translations.descriptionLabel}
              </Label>
              <Textarea
                id="description"
                placeholder={translations.descriptionPlaceholder}
                className="h-20 resize-none"
                {...register("description", {
                  required: translations.validationMessages.descriptionRequired,
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-900">
                {translations.startDateLabel}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : (
                      <span className="text-gray-400">{translations.startDatePlaceholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setValue("startDate", date ? format(date, "yyyy-MM-dd") : "");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-900">
                  {translations.endDateLabel}
                </Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="present"
                    checked={!endDate}
                    onChange={handlePresentToggle}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="present" className="text-sm text-gray-700">
                    {translations.presentLabel}
                  </Label>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                    disabled={!endDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : (
                      <span className="text-gray-400">{translations.endDatePlaceholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setValue("endDate", date ? format(date, "yyyy-MM-dd") : "");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {translations.cancelButton}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Saving..." : translations.saveButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}