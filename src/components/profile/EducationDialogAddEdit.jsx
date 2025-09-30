"use client";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUpdateProfileInfoMutation } from "../../features/clientProfile/ClientProfile";

export default function EducationDialogAddEdit({
  isOpen,
  onClose,
  education,
  isEditing,
}) {
  const translations = {
    addTitle: "Add Education & Certifications",
    editTitle: "Edit Education & Certifications",
    degree: "Degree",
    degreePlaceholder: "Select Degree",
    degreeRequired: "Degree is required",
    school: "School/University",
    schoolPlaceholder: "Select School / University",
    schoolRequired: "School/University is required",
    startYear: "Select Start Year",
    startYearRequired: "Start year is required",
    endYear: "Select End Year",
    endYearRequired: "End year is required",
    yearPlaceholder: "Year",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    addSuccessMessage: "Education added successfully!",
    editSuccessMessage: "Education updated successfully!",
    errorMessage: "Failed to save education. Please try again.",
    duplicateEducationMessage:
      "This education record already exists! Please check your entries.",
    // Degree options
    associateDegree: "Associate Degree",
    bachelorsDegree: "Bachelor's Degree",
    mastersDegree: "Master's Degree",
    doctorate: "Doctorate (PhD)",
    professionalDegree: "Professional Degree",
    certificate: "Certificate",
    diploma: "Diploma",
    highSchoolDiploma: "High School Diploma",
    other: "Other",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      degree: "",
      school: "",
      startYear: "",
      endYear: "",
    },
  });

  const [updateEducation, { isLoading }] = useUpdateProfileInfoMutation();

  // Set form values when editing
  useEffect(() => {
    if (isEditing && education) {
      setValue("degree", education.degree);
      setValue("school", education.institution);
      setValue(
        "startYear",
        new Date(education.startDate).getFullYear().toString()
      );
      setValue("endYear", new Date(education.endDate).getFullYear().toString());
    } else {
      // Reset form when adding new
      reset();
    }
  }, [isEditing, education, setValue, reset]);

  const onSubmit = async (data) => {
    // Convert year to full date format (YYYY-MM-DD)
    const formatDateFromYear = (year) => `${year}-01-01`;

    const educationData = {
      type: "education",
      degree: data.degree,
      institution: data.school,
      startDate: formatDateFromYear(data.startYear),
      endDate: formatDateFromYear(data.endYear),
      operation: isEditing ? "update" : "add", // 'add' | 'update' | 'delete',
    };

    // If editing, include the education ID
    if (isEditing && education) {
      educationData._id = education._id;
    }

    try {
      const response = await updateEducation(educationData).unwrap();
      console.log("API Response:", response);

      // Show appropriate success message
      toast.success(
        isEditing
          ? translations.editSuccessMessage
          : translations.addSuccessMessage
      );
      reset();
      onClose?.();
    } catch (error) {
      console.error("API Error:", error);

      // Check if it's a duplicate education error
      if (
        error?.data?.message?.includes("already exists") ||
        error?.data?.message?.includes("education item already exists")
      ) {
        toast.error(translations.duplicateEducationMessage);
      } else {
        toast.error(translations.errorMessage);
      }
    }
  };

  const onCancel = () => {
    reset();
    onClose?.();
  };

  // Generate years for select options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i + 10);

  const degrees = [
    translations.associateDegree,
    translations.bachelorsDegree,
    translations.mastersDegree,
    translations.doctorate,
    translations.professionalDegree,
    translations.certificate,
    translations.diploma,
    translations.highSchoolDiploma,
    translations.other,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl lg:min-w-5xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b-0">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {isEditing ? translations.editTitle : translations.addTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pb-6 space-y-6">
            {/* Degree Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {translations.degree} *
              </Label>
              <Select
                onValueChange={(value) => setValue("degree", value)}
                defaultValue={
                  Array.isArray(education?.degree)
                    ? String(education.degree[0] || "")
                    : String(education?.degree || "")
                }
                required
              >
                <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={translations.degreePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.degree && (
                <p className="text-sm text-red-600">{errors.degree.message}</p>
              )}
            </div>

            {/* School/University Field */}
            <div className="space-y-2">
              <Label
                htmlFor="school"
                className="text-sm font-medium text-gray-900"
              >
                {translations.school} *
              </Label>
              <Input
                id="school"
                placeholder={translations.schoolPlaceholder}
                className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                {...register("school", {
                  required: translations.schoolRequired,
                })}
              />
              {errors.school && (
                <p className="text-sm text-red-600">{errors.school.message}</p>
              )}
            </div>

            {/* Start Year Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {translations.startYear} *
              </Label>
              <div className="relative">
                <Select
                  onValueChange={(value) => setValue("startYear", value)}
                  defaultValue={
                    education
                      ? new Date(education.startDate).getFullYear().toString()
                      : ""
                  }
                  required
                >
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={translations.yearPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {errors.startYear && (
                <p className="text-sm text-red-600">
                  {errors.startYear.message}
                </p>
              )}
            </div>

            {/* End Year Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {translations.endYear} *
              </Label>
              <div className="relative">
                <Select
                  onValueChange={(value) => setValue("endYear", value)}
                  defaultValue={
                    education
                      ? new Date(education.endDate).getFullYear().toString()
                      : ""
                  }
                  required
                >
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={translations.yearPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {errors.endYear && (
                <p className="text-sm text-red-600">{errors.endYear.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 w-full md:w-auto"
              disabled={isLoading}
            >
              {translations.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 button-gradient py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Saving..." : translations.saveChanges}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
