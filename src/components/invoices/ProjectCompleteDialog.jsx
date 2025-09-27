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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProjectCompleteDialog({ isOpen, onClose }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Static translations object (you can pass this as props or use context instead)
  const dialogTranslations = useMemo(
    () => ({
      title: "Complete Project",
      completeMessageLabel: "Complete Message",
      completeMessagePlaceholder: "Write Message",
      fileMessageLabel: "File/Message",
      fileMessagePlaceholder: "Write Message/ Send Message",
      uploadedImagesLabel: "Uploaded Images",
      cancelButton: "Cancel",
      completeButton: "Mark as Completed",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      completeMessage: "",
      fileMessage: "",
    },
  });

  // Complete message options
  const completeMessages = [
    "Project completed successfully",
    "All deliverables have been finished",
    "Work completed as per requirements",
    "Project finished ahead of schedule",
    "All tasks completed and tested",
    "Ready for client review",
    "Project delivered with all features",
    "Custom message...",
  ];

  const onSubmit = (data) => {
    const projectData = {
      ...data,
      uploadedFiles: uploadedFiles,
    };
    console.log("Project completion data:", projectData);
    alert("Project marked as completed successfully!");
    onClose?.();
  };

  const onCancel = () => {
    reset();
    setUploadedFiles([]);
    onClose?.();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: e.target?.result,
            file: file,
          };
          setUploadedFiles((prev) => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] md:min-w-3xl lg:min-w-5xl p-0 gap-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b-0">
            <DialogTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
              {dialogTranslations.title}
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Complete Message Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {dialogTranslations.completeMessageLabel}
              </Label>
              <Select
                onValueChange={(value) => setValue("completeMessage", value)}
              >
                <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue
                    placeholder={dialogTranslations.completeMessagePlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  {completeMessages.map((message) => (
                    <SelectItem key={message} value={message}>
                      {message}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.completeMessage && (
                <p className="text-sm text-red-600">
                  {errors.completeMessage.message}
                </p>
              )}
            </div>

            {/* File/Message Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                {dialogTranslations.fileMessageLabel}
              </Label>
              <div className="relative">
                <Textarea
                  placeholder={dialogTranslations.fileMessagePlaceholder}
                  className="w-full min-h-[200px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400 pr-12"
                  {...register("fileMessage")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFileUpload}
                  className="absolute bottom-3 right-3 h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Paperclip size={16} className="text-gray-400" />
                </Button>
              </div>
              {errors.fileMessage && (
                <p className="text-sm text-red-600">
                  {errors.fileMessage.message}
                </p>
              )}
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  {dialogTranslations.uploadedImagesLabel} (
                  {uploadedFiles.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative group  w-34">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-32 h-32">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-32 h-32 object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-4 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </Button>
                      <div className="mt-1">
                        <p
                          className="text-xs text-gray-600 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100"
            >
              {dialogTranslations.cancelButton}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="px-6 button-gradient py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {dialogTranslations.completeButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden h-20 w-20"
      />
    </>
  );
}