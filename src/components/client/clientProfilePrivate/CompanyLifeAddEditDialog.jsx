"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useCreatePostMutation, useUpdatePostMutation } from '../../../features/post/postApi';

function CompanyLifeAddEditDialog({ isOpen, onClose, isEditing, selectedPost }) {
  const defaultImage = "/card_image.png";
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const [createPost, { isLoading: creatingLoading }] = useCreatePostMutation();
  const [updatePost, { isLoading: updatingLoading }] = useUpdatePostMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      description: "",
    },
  });

  // Watch the description field to see current value
  const descriptionValue = watch("description");

  // Set default values when editing - WITH SAFETY CHECKS
  useEffect(() => {
    if (isOpen) {
      if (isEditing && selectedPost) {
        console.log("Editing post:", selectedPost); // Debug log
        setValue("description", selectedPost?.description || "");

        // Set the image with safety check
        if (selectedPost?.image) {
          const imageUrl = getImageUrl(selectedPost.image);
          setProfileImage(imageUrl);
          console.log("Setting image URL:", imageUrl); // Debug log
        } else {
          setProfileImage(defaultImage);
          console.log("No image found, using default"); // Debug log
        }
        setImageFile(null);
      } else {
        // Reset for new post
        console.log("Creating new post"); // Debug log
        setValue("description", "");
        setProfileImage(defaultImage);
        setImageFile(null);
      }
    }
  }, [isOpen, isEditing, selectedPost, setValue]);

  // Get image URL helper function with safety check
  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultImage;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://10.10.7.107:5006/${imagePath.replace(/\\/g, '/')}`;
  };

  const handleClose = () => {
    setProfileImage(defaultImage);
    setImageFile(null);
    reset();
    onClose();
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image file size must be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);

      console.log("Image file selected:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitting form data:", data); // Debug log
      console.log("Image file:", imageFile); // Debug log
      console.log("Is editing:", isEditing); // Debug log
      console.log("Selected post:", selectedPost); // Debug log

      const formData = new FormData();
      formData.append("description", data.description);

      // Handle image file properly
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let response;

      if (isEditing && selectedPost) {
        // Update existing post
        console.log("Updating post with ID:", selectedPost._id); // Debug log


        response = await updatePost({
          id: selectedPost._id,
          data: formData
        }).unwrap();

        toast.success("Post updated successfully!");
        console.log("Update response:", response);
      } else {
        // Create new post - image is required for new posts
        if (!imageFile) {
          toast.error("Please select an image for the post");
          return;
        }

        response = await createPost(formData).unwrap();
        toast.success("Post created successfully!");
        console.log("Create response:", response);
      }

      handleClose();
    } catch (error) {
      console.error("Error submitting post:", error);

      // More detailed error handling
      const errorMessage = error?.data?.message || error?.message || "An error occurred";
      toast.error(
        isEditing
          ? `Failed to update post: ${errorMessage}`
          : `Failed to create post: ${errorMessage}`
      );
    }
  };

  const isLoading = creatingLoading || updatingLoading;

  // Early return if dialog is not open (optimization)
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Company Life Post" : "Add New Company Life Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4 w-full">
              <Label className="self-start">
                Post Image {!isEditing && <span className="text-red-500">*</span>}
              </Label>
              <div
                className={`relative w-full h-40 rounded-lg overflow-hidden border cursor-pointer group transition-all ${!imageFile && !isEditing && profileImage === defaultImage
                  ? "border-red-300 border-dashed"
                  : "border-gray-300"
                  }`}
                onClick={handleImageClick}
              >
                <img
                  src={profileImage}
                  alt="Post"
                  className="object-cover w-full h-full transition-opacity group-hover:opacity-75"
                  onError={(e) => {
                    e.currentTarget.src = defaultImage;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                    {profileImage === defaultImage ? "Add Image" : "Change Image"}
                  </span>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleImageClick}
                className={
                  !imageFile && !isEditing && profileImage === defaultImage
                    ? "border-red-300 text-red-600 hover:bg-red-50"
                    : ""
                }
              >
                {profileImage === defaultImage ? "Add Image" : "Change Image"}
              </Button>

              {!imageFile && !isEditing && profileImage === defaultImage && (
                <p className="text-red-500 text-sm text-center">
                  Image is required for new posts
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Post Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Write your post here..."
                    rows={4}
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters long"
                      }
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                  {/* Debug info - remove in production */}
                  <p className="text-xs text-gray-500">
                    Current value: {descriptionValue || "empty"} |
                    Editing: {isEditing ? "Yes" : "No"} |
                    Has selected post: {selectedPost ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="button-gradient"
              disabled={isLoading}
            >
              {isLoading
                ? (isEditing ? "Updating..." : "Creating...")
                : (isEditing ? "Update Post" : "Create Post")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CompanyLifeAddEditDialog;