"use client";
import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { X, Upload } from "lucide-react";
import { IoCalendarOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useToast from "@/hooks/showToast/ShowToast";
import { useSelector } from "react-redux";

export default function CreateInvoicesDialog({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();

  // Get translations from Redux
  const messages = useSelector((state) => state.language.messages);
  const dialogTranslations = useMemo(
    () =>
      messages?.invoiceDialogs?.createInvoice || {
        title: "Create New Invoice",
        logoUpload: "LOGO",
        clientLabel: "Client",
        clientPlaceholder: "Select Client",
        serviceTypeLabel: "Service Type",
        serviceTypePlaceholder: "Select Service Type",
        projectNameLabel: "Project Name",
        projectNamePlaceholder: "Select Project Name",
        dayLabel: "Day",
        dayPlaceholder: "Enter your working day",
        cancelButton: "Cancel",
        createButton: "Create Invoices",
      },
    [messages]
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
      client: "",
      serviceType: "",
      projectName: "",
      day: "",
    },
  });

  // Sample data - replace with your actual data
  const clients = [
    "ABC Corporation",
    "XYZ Company",
    "Tech Solutions Ltd",
    "Digital Agency Inc",
    "StartUp Ventures",
    "Global Enterprises",
  ];

  const serviceTypes = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Digital Marketing",
    "SEO Services",
    "Content Writing",
    "Consulting",
    "Maintenance & Support",
  ];

  const projectNames = [
    "E-commerce Platform",
    "Corporate Website",
    "Mobile Application",
    "Brand Identity Design",
    "Marketing Campaign",
    "System Integration",
    "Database Migration",
    "Performance Optimization",
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data) => {
    const invoiceData = {
      ...data,
      day: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
      logo: logoImage,
    };
    console.log("Invoice data:", invoiceData);
    success("Invoice created successfully!");
    onClose?.();
  };

  const onCancel = () => {
    reset();
    setSelectedDate(null);
    setLogoImage(null);
    setLogoPreview(null);
    onClose?.();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setValue("day", date ? date.toISOString().split("T")[0] : "");
    setIsCalendarOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b-0">
          <DialogTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
            {dialogTranslations.title}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Logo Upload Section */}
          <div className="flex justify-center">
            <div
              className="relative w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={handleLogoClick}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-white text-center">
                  <div className="text-xs font-bold tracking-wider">
                    CONLINE
                  </div>
                  <div className="text-[10px] opacity-80">
                    {dialogTranslations.logoUpload}
                  </div>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Upload className="w-3 h-3 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Client Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              {dialogTranslations.clientLabel}
            </Label>
            <Select onValueChange={(value) => setValue("client", value)}>
              <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue
                  placeholder={dialogTranslations.clientPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client && (
              <p className="text-sm text-red-600">{errors.client.message}</p>
            )}
          </div>

          {/* Service Type Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              {dialogTranslations.serviceTypeLabel}
            </Label>
            <Select onValueChange={(value) => setValue("serviceType", value)}>
              <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue
                  placeholder={dialogTranslations.serviceTypePlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((serviceType) => (
                  <SelectItem key={serviceType} value={serviceType}>
                    {serviceType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceType && (
              <p className="text-sm text-red-600">
                {errors.serviceType.message}
              </p>
            )}
          </div>

          {/* Project Name Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              {dialogTranslations.projectNameLabel}
            </Label>
            <Select onValueChange={(value) => setValue("projectName", value)}>
              <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue
                  placeholder={dialogTranslations.projectNamePlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {projectNames.map((projectName) => (
                  <SelectItem key={projectName} value={projectName}>
                    {projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectName && (
              <p className="text-sm text-red-600">
                {errors.projectName.message}
              </p>
            )}
          </div>

          {/* Day Field with Calendar */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              {dialogTranslations.dayLabel}
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <span
                    className={selectedDate ? "text-gray-900" : "text-gray-400"}
                  >
                    {selectedDate
                      ? formatDate(selectedDate)
                      : dialogTranslations.dayPlaceholder}
                  </span>
                  <IoCalendarOutline className="ml-auto h-4 w-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.day && (
              <p className="text-sm text-red-600">{errors.day.message}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            {dialogTranslations.cancelButton}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="px-6 button-gradient py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {dialogTranslations.createButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
