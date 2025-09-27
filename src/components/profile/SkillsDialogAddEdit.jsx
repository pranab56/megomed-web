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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SkillsDialogAddEdit({
  isOpen,
  onClose,
  skillCategory = "soft",
  editingSkill = null,
  updateSkills,
}) {
  const [skillType, setSkillType] = useState(skillCategory);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingSkill;

  const translations = {
    addTitle: "Add Skill",
    editTitle: "Edit Skill",
    skillTypeLabel: "Skill Type",
    skillTypes: {
      soft: "Soft Skills",
      technical: "Technical Skills",
      functional: "Functional Skills",
    },
    skillsLabel: "Skill Name",
    skillsPlaceholder: "Enter skill name",
    categoryLabel: "Category",
    categoryPlaceholder: "Select category",
    cancelButton: "Cancel",
    saveButton: "Save Changes",
    addSuccessMessage: "Skill added successfully!",
    editSuccessMessage: "Skill updated successfully!",
    errorMessage: "Failed to save skill. Please try again.",
    duplicateSkillMessage:
      "This skill already exists! Please choose a different skill name.",
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
      skill: "",
      category: skillCategory,
    },
  });

  // Load initial data for edit mode
  useEffect(() => {
    if (isEditing && editingSkill) {
      setSkillType(editingSkill.category || skillCategory);
      setValue("skill", editingSkill.skill || "");
      setValue("category", editingSkill.category || skillCategory);
    } else {
      // Reset for add mode
      setSkillType(skillCategory);
      setValue("skill", "");
      setValue("category", skillCategory);
    }
  }, [isEditing, editingSkill, setValue, skillCategory]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const skillData = {
        type: "skill",
        category: data.category,
        skill: data.skill,
        operation: isEditing ? "update" : "add", // 'add' | 'update' | 'delete'
      };

      // If editing, include the skill ID
      if (isEditing && editingSkill) {
        skillData._id = editingSkill._id;
      }

      const response = await updateSkills(skillData).unwrap();
      console.log("API Response:", response);

      toast.success(
        isEditing
          ? translations.editSuccessMessage
          : translations.addSuccessMessage
      );
      reset();
      onClose?.();
    } catch (error) {
      console.error("API Error:", error);

      // Check if it's a duplicate skill error
      if (
        error?.data?.message?.includes("already exists") ||
        error?.data?.message?.includes("skills item already exists")
      ) {
        toast.error(translations.duplicateSkillMessage);
      } else {
        toast.error(translations.errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    reset();
    setSkillType(skillCategory);
    onClose?.();
  };

  const handleSkillTypeChange = (value) => {
    setSkillType(value);
    setValue("category", value);
  };

  const categories = [
    { value: "soft", label: "Soft Skills" },
    { value: "technical", label: "Technical Skills" },
    { value: "functional", label: "Functional Skills" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b-0">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {isEditing ? translations.editTitle : translations.addTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pb-6 space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">
                {translations.categoryLabel} *
              </Label>
              <RadioGroup
                value={skillType}
                onValueChange={handleSkillTypeChange}
                className="flex flex-col space-y-2"
              >
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={category.value}
                      id={category.value}
                    />
                    <Label
                      htmlFor={category.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Skill Name Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {translations.skillsLabel} *
              </Label>
              <Input
                placeholder={translations.skillsPlaceholder}
                className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...register("skill", {
                  required: "Skill name is required",
                  minLength: {
                    value: 2,
                    message: "Skill name must be at least 2 characters",
                  },
                })}
              />
              {errors.skill && (
                <p className="text-sm text-red-600">{errors.skill.message}</p>
              )}
            </div>

            {/* Hidden category field for form submission */}
            <input type="hidden" {...register("category")} />
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
              {translations.cancelButton}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 button-gradient py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Saving..." : translations.saveButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
