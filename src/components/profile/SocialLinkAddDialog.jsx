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
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import { useUpdateSocialLinkMutation } from "../../features/clientProfile/ClientProfile";
import { socialPlatforms } from "./socialPlatforms";

export default function SocialLinkAddDialog({ isOpen, onClose }) {
  const [updateSocialLink, { isLoading }] = useUpdateSocialLinkMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      link: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const socialLinkData = {
        type: "socialLink",
        operation: "add",
        name: data.name,
        link: data.link,
      };

      console.log("Submitting social link:", socialLinkData);

      const response = await updateSocialLink(socialLinkData).unwrap();
      console.log("API Response:", response);

      toast.success("Social link added successfully!");
      reset();
      onClose?.();
    } catch (error) {
      console.error("Failed to add social link:", error);
      toast.error("Failed to add social link. Please try again.");
    }
  };

  const onCancel = () => {
    reset();
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add Social Link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {/* Social Platform Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Social Platform <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("name", value)}
                required
              >
                <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select social platform">
                    {watch("name") &&
                      (() => {
                        const selectedPlatform = socialPlatforms.find(
                          (p) => p.value === watch("name")
                        );
                        if (selectedPlatform) {
                          return (
                            <div className="flex items-center gap-2">
                              {selectedPlatform.icon && (
                                <Image
                                  src={selectedPlatform.icon}
                                  alt={selectedPlatform.label}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4"
                                />
                              )}
                              {selectedPlatform.label}
                            </div>
                          );
                        }
                        return null;
                      })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        {platform.icon && (
                          <Image
                            src={platform.icon}
                            alt={platform.label}
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        )}
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <Label
                htmlFor="link"
                className="text-sm font-medium text-gray-900"
              >
                Link <span className="text-red-500">*</span>
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com"
                className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                {...register("link", {
                  required: "Link is required",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message:
                      "Please enter a valid URL starting with http:// or https://",
                  },
                })}
              />
              {errors.link && (
                <p className="text-sm text-red-600">{errors.link.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Adding..." : "Add Social Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
