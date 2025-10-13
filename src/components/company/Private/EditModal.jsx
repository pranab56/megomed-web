import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

function EditModal({ isOpen, onClose, companyData }) {
  const [profileImage, setProfileImage] = useState("/card_image.png");
  const [coverPhoto, setCoverPhoto] = useState("/card_image.png");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      companyName: "",
      location: "",
      aboutCompany: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && companyData) {
      reset({
        companyName: companyData.companyName || "",
        location: companyData.location || "",
        aboutCompany: companyData.aboutCompany || "",
      });
      setProfileImage(companyData.profileImage || "/card_image.png");
      setCoverPhoto(companyData.coverPhoto || "/card_image.png");
      setSelectedProfileFile(null);
      setSelectedCoverFile(null);
    }
  }, [isOpen, companyData, reset]);

  const handleProfileImageClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverPhotoClick = () => {
    coverInputRef.current?.click();
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    console.log("Company Edit Form Data:", formData);

    try {
      const payload = new FormData();

      // Append form fields
      payload.append("companyName", formData.companyName);
      payload.append("location", formData.location);
      payload.append("aboutCompany", formData.aboutCompany);

      // Append files if selected
      if (selectedProfileFile) {
        payload.append("profileImage", selectedProfileFile);
      }
      if (selectedCoverFile) {
        payload.append("coverPhoto", selectedCoverFile);
      }

      console.log("Sending company edit payload:", {
        companyName: formData.companyName,
        location: formData.location,
        aboutCompany: formData.aboutCompany,
        hasProfileImage: !!selectedProfileFile,
        hasCoverPhoto: !!selectedCoverFile,
      });

      // TODO: Replace with actual API call
      // const response = await updateCompany(payload).unwrap();
      // console.log("Company updated successfully:", response);

      onClose();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Company Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Photo Uploads */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Photos</h3>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div
                  className="relative w-32 h-32 rounded-full overflow-hidden border cursor-pointer group mx-auto"
                  onClick={handleProfileImageClick}
                >
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    className="object-cover transition-opacity group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black group-hover:bg-opacity-50 transition-all">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm">
                      Change Image
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={profileInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleProfileImageClick}
                  className="w-full"
                >
                  Upload Profile Image
                </Button>
              </div>

              {/* Cover Photo */}
              <div className="space-y-2">
                <Label>Cover Photo</Label>
                <div
                  className="relative w-full h-32 rounded-lg overflow-hidden border cursor-pointer group"
                  onClick={handleCoverPhotoClick}
                >
                  <Image
                    src={coverPhoto}
                    alt="Cover"
                    fill
                    className="object-cover transition-opacity group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black group-hover:bg-opacity-50 transition-all">
                    <span className="text-white opacity-0 group-hover:opacity-100">
                      Change Cover Photo
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverPhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCoverPhotoClick}
                  className="w-full"
                >
                  Upload Cover Photo
                </Button>
              </div>
            </div>

            {/* Right Side - Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>

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
                      placeholder="Enter company name"
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
                <Label htmlFor="location">Location</Label>
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
                      placeholder="Enter location"
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
                <Label htmlFor="aboutCompany">About Company</Label>
                <Controller
                  name="aboutCompany"
                  control={control}
                  rules={{
                    required: "About company is required",
                    maxLength: {
                      value: 300,
                      message: "About company must not exceed 300 words",
                    },
                    minLength: {
                      value: 10,
                      message: "About company must be at least 10 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="aboutCompany"
                      placeholder="Tell us about your company (max 300 words)"
                      className="h-32 resize-none"
                    />
                  )}
                />
                {errors.aboutCompany && (
                  <span className="text-sm text-red-500">
                    {errors.aboutCompany.message}
                  </span>
                )}
                <p className="text-xs text-gray-500">
                  {control._formValues?.aboutCompany?.length || 0}/300 words
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="button-gradient">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditModal;
