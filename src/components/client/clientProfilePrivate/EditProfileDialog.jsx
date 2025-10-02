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
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateMyprofileMutation } from "../../../features/clientProfile/ClientProfile";
import { getImageUrl } from "@/utils/getImageUrl";

function EditProfileDialog({ isOpen, onClose, profileData }) {
  const [updateProfile, { isLoading }] = useUpdateMyprofileMutation();

  const [profileImage, setProfileImage] = useState(
    "/client/profile/client.png"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      companyName: "",
      aboutCompany: "",
      location: "",
    },
  });

  // Reset form when dialog opens or profileData changes
  useEffect(() => {
    if (isOpen && profileData) {
      reset({
        fullName: profileData.fullName || "",
        companyName: profileData.companyName || "",
        aboutCompany: profileData.aboutCompany || "",
        location: profileData.location || "",
      });
      setProfileImage(profileData.profile || "/client/profile/client.png");
      setSelectedFile(null);
    }
  }, [isOpen, profileData, reset]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);

    try {
      const payload = new FormData();

      // Use correct field names that match your API
      payload.append("fullName", formData.fullName);
      payload.append("companyName", formData.companyName);
      payload.append("aboutCompany", formData.aboutCompany);
      payload.append("location", formData.location);
      // Only append file if a new one was selected
      if (selectedFile) {
        payload.append("profile", selectedFile);
      }

      console.log("Sending payload:", {
        fullName: formData.fullName,
        companyName: formData.companyName,
        aboutCompany: formData.aboutCompany,
        hasFile: !!selectedFile,
        location: formData.location,
      });

      const response = await updateProfile(payload).unwrap();
      console.log("Profile updated successfully:", response);
      onClose(); // Close the dialog after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden border cursor-pointer group"
                onClick={handleImageClick}
              >
                <Image
                  src={getImageUrl(profileImage)}
                  alt="Profile"
                  fill
                  className="object-cover transition-opacity group-hover:opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                  <span className="text-white opacity-0 group-hover:opacity-100">
                    Change Image
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
                className="button-gradient"
                onClick={handleImageClick}
              >
                Edit Image
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="fullName"
                      placeholder="Full Name"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.fullName && (
                  <span className="text-sm text-red-500">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="companyName">Company Name</Label>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{
                    required: "Company name is required",
                    minLength: {
                      value: 2,
                      message: "Company name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="companyName"
                      placeholder="Company Name"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.companyName && (
                  <span className="text-sm text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="companyName">Location</Label>
                <Controller
                  name="location"
                  control={control}
                  rules={{
                    required: "Location is required",
                    minLength: {
                      value: 2,
                      message: "Location must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="location"
                      placeholder="Location"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.location && (
                  <span className="text-sm text-red-500">
                    {errors.location.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="aboutCompany">About Your Company</Label>
                <Controller
                  name="aboutCompany"
                  control={control}
                  rules={{
                    required: "About Your Company is required",
                    minLength: {
                      value: 10,
                      message: "About must be at least 10 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="aboutCompany"
                      placeholder="Tell us about your company"
                      className="h-24 resize-none w-full"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.aboutCompany && (
                  <span className="text-sm text-red-500">
                    {errors.aboutCompany.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 ">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="button-gradient"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;
