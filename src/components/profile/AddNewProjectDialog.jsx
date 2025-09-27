"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateShowCaseProjectMutation } from "@/features/showcaseProject/showCaseProjectApi";
import useToast from "@/hooks/showToast/ShowToast";
import { Calendar, Edit2, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddNewProjectDialog({ isOpen, onClose }) {
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const fileInputRef = useRef(null);
  const showToast = useToast();
  const [createShowCaseProject, { isLoading: isCreatingShowCaseProject }] =
    useCreateShowCaseProjectMutation();

  const translations = {
    title: "Add New Project",
    name: "Name",
    namePlaceholder: "Sabbir Ahmed",
    nameRequired: "Name is required",
    titleLabel: "Title",
    titlePlaceholder: "Write a title",
    titleRequired: "Title is required",
    completeDate: "Complete Date",
    completeDateRequired: "Complete date is required",
    description: "Description",
    descriptionPlaceholder: "Design",
    projectThumbnail: "Project Thumbnail",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    successMessage: "Project saved successfully!",
    updateThumbnail: "Update Thumbnail",
    updateThumbnailDescription:
      "Choose an option to update your project thumbnail.",
    uploadNewImage: "Upload New Image",
    removeCurrentImage: "Remove Current Image",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: translations.namePlaceholder,
      title: translations.titlePlaceholder,
      completeDate: "2020",
      description: translations.descriptionPlaceholder,
    },
  });

  const onSubmit = async (data) => {
    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();

      // Add text fields
      formData.append("name", data.name);
      formData.append("title", data.title);
      formData.append("completedDate", data.completeDate);
      formData.append("description", data.description);

      // Add image file if selected
      if (thumbnailImage && fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      console.log("Submitting project data:", {
        name: data.name,
        title: data.title,
        completedDate: data.completeDate,
        description: data.description,
        hasImage: !!thumbnailImage,
      });

      // Call the API
      await createShowCaseProject(formData).unwrap();

      showToast.success(translations.successMessage);
      onClose?.();
      reset();
      setThumbnailImage(null);
    } catch (error) {
      console.error("Error creating project:", error);
      showToast.error("Failed to create project. Please try again.");
    }
  };

  const onCancel = () => {
    reset();
    setThumbnailImage(null);
    onClose?.();
  };

  const handleEditThumbnail = () => {
    setShowUploadDialog(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
    setShowUploadDialog(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setThumbnailImage(null);
    setShowUploadDialog(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:min-w-3xl lg:min-w-5xl p-0 gap-0">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b-0">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {translations.title}
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Thumbnail */}
              <div className="space-y-1 md:space-y-4">
                <div className="relative  rounded-lg px-6 py-4 text-white min-h-42 border-2 border-gray-300 flex flex-col justify-between items-center overflow-hidden">
                  {thumbnailImage ? (
                    <div className="absolute inset-0">
                      <Image
                        src={thumbnailImage}
                        alt="Project thumbnail"
                        width={250}
                        height={150}
                        className="w-full h-42 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span>{translations.projectThumbnail}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleEditThumbnail}
                  >
                    <Edit2 size={14} />
                  </Button>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="space-y-3 md:space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-900"
                  >
                    {translations.name}
                  </Label>
                  <Input
                    id="name"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("name", {
                      required: translations.nameRequired,
                    })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Title Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-900"
                  >
                    {translations.titleLabel}
                  </Label>
                  <Input
                    id="title"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("title", {
                      required: translations.titleRequired,
                    })}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Complete Date Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="completeDate"
                    className="text-sm font-medium text-gray-900"
                  >
                    {translations.completeDate}
                  </Label>
                  <div className="relative">
                    <Input
                      id="completeDate"
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      {...register("completeDate", {
                        required: translations.completeDateRequired,
                      })}
                    />
                    <Calendar
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.completeDate && (
                    <p className="text-sm text-red-600">
                      {errors.completeDate.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-900"
                  >
                    {translations.description}
                  </Label>
                  <Textarea
                    id="description"
                    className="w-full h-24 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("description")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 w-full md:w-auto"
            >
              {translations.cancel}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isCreatingShowCaseProject}
              className="px-6 button-gradient py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingShowCaseProject
                ? "Creating..."
                : translations.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <AlertDialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ImageIcon size={20} />
              {translations.updateThumbnail}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {translations.updateThumbnailDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3 py-4">
            <Button
              onClick={handleFileSelect}
              className="flex items-center gap-2 justify-start h-12"
              variant="outline"
            >
              <Upload size={18} />
              {translations.uploadNewImage}
            </Button>
            {thumbnailImage && (
              <Button
                onClick={handleRemoveImage}
                className="flex items-center gap-2 justify-start h-12"
                variant="outline"
              >
                <X size={18} />
                {translations.removeCurrentImage}
              </Button>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{translations.cancel}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
