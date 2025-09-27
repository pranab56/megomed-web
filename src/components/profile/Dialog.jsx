"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function EditProfileDialog({ open, onClose }) {
  // Get translations from Redux
  const messages = useSelector((state) => state.language.messages);
  const translations = useMemo(
    () =>
      messages?.profile?.profileEditDialog || {
        title: "Edit Profile",
        nameLabel: "Name",
        namePlaceholder: "Enter your full name",
        dailyRateLabel: "Daily Rate",
        dailyRatePlaceholder: "Enter daily rate",
        serviceTypeLabel: "Service Type",
        serviceTypePlaceholder: "Select service type",
        categoryTypeLabel: "Category Type",
        categoryTypePlaceholder: "Select category",
        locationLabel: "Location",
        locationPlaceholder: "Select location",
        languageLabel: "Language",
        languagePlaceholder: "Select language",
        serviceTypes: {
          design: "Design",
          development: "Development",
          marketing: "Marketing",
          writing: "Writing",
          consulting: "Consulting",
        },
        categoryTypes: {
          uiUxDesigner: "UI/UX Designer",
          graphicDesigner: "Graphic Designer",
          webDesigner: "Web Designer",
          productDesigner: "Product Designer",
          frontendDeveloper: "Frontend Developer",
          backendDeveloper: "Backend Developer",
          fullStackDeveloper: "Full Stack Developer",
        },
        locations: {
          bangladesh: "Bangladesh",
          india: "India",
          pakistan: "Pakistan",
          usa: "USA",
          uk: "UK",
          canada: "Canada",
          australia: "Australia",
        },
        languages: {
          bengali: "Bengali",
          english: "English",
          hindi: "Hindi",
          urdu: "Urdu",
          arabic: "Arabic",
          spanish: "Spanish",
          french: "French",
        },
        cancelButton: "Cancel",
        saveChangesButton: "Save Changes",
        changeProfilePicture: "Change Profile Picture",
        changeCover: "Change Cover",
      },
    [messages]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {translations.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Profile & Cover Images */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border">
              <Image
                src="/profile-pic.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <Button variant="ghost" className="text-sm">
              {translations.changeProfilePicture} ✏️
            </Button>

            <div className="relative w-full rounded-lg overflow-hidden border h-40">
              <Image
                src="/cover-pic.jpg"
                alt="Cover"
                fill
                className="object-cover"
              />
            </div>
            <Button variant="ghost" className="text-sm">
              {translations.changeCover} ✏️
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label>{translations.nameLabel}</Label>
              <Input
                placeholder={translations.namePlaceholder}
                defaultValue="Sabbir Ahmed"
              />
            </div>

            <div>
              <Label>{translations.dailyRateLabel}</Label>
              <Input
                placeholder={translations.dailyRatePlaceholder}
                defaultValue="$500"
              />
            </div>

            <div>
              <Label>{translations.serviceTypeLabel}</Label>
              <Select defaultValue="design">
                <SelectTrigger>
                  <SelectValue
                    placeholder={translations.serviceTypePlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">
                    {translations.serviceTypes.design}
                  </SelectItem>
                  <SelectItem value="development">
                    {translations.serviceTypes.development}
                  </SelectItem>
                  <SelectItem value="marketing">
                    {translations.serviceTypes.marketing}
                  </SelectItem>
                  <SelectItem value="writing">
                    {translations.serviceTypes.writing}
                  </SelectItem>
                  <SelectItem value="consulting">
                    {translations.serviceTypes.consulting}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{translations.categoryTypeLabel}</Label>
              <Select defaultValue="uiUxDesigner">
                <SelectTrigger>
                  <SelectValue
                    placeholder={translations.categoryTypePlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uiUxDesigner">
                    {translations.categoryTypes.uiUxDesigner}
                  </SelectItem>
                  <SelectItem value="graphicDesigner">
                    {translations.categoryTypes.graphicDesigner}
                  </SelectItem>
                  <SelectItem value="webDesigner">
                    {translations.categoryTypes.webDesigner}
                  </SelectItem>
                  <SelectItem value="productDesigner">
                    {translations.categoryTypes.productDesigner}
                  </SelectItem>
                  <SelectItem value="frontendDeveloper">
                    {translations.categoryTypes.frontendDeveloper}
                  </SelectItem>
                  <SelectItem value="backendDeveloper">
                    {translations.categoryTypes.backendDeveloper}
                  </SelectItem>
                  <SelectItem value="fullStackDeveloper">
                    {translations.categoryTypes.fullStackDeveloper}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{translations.locationLabel}</Label>
              <Select defaultValue="bangladesh">
                <SelectTrigger>
                  <SelectValue placeholder={translations.locationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh">
                    {translations.locations.bangladesh}
                  </SelectItem>
                  <SelectItem value="india">
                    {translations.locations.india}
                  </SelectItem>
                  <SelectItem value="pakistan">
                    {translations.locations.pakistan}
                  </SelectItem>
                  <SelectItem value="usa">
                    {translations.locations.usa}
                  </SelectItem>
                  <SelectItem value="uk">
                    {translations.locations.uk}
                  </SelectItem>
                  <SelectItem value="canada">
                    {translations.locations.canada}
                  </SelectItem>
                  <SelectItem value="australia">
                    {translations.locations.australia}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{translations.languageLabel}</Label>
              <Select defaultValue="english">
                <SelectTrigger>
                  <SelectValue placeholder={translations.languagePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bengali">
                    {translations.languages.bengali}
                  </SelectItem>
                  <SelectItem value="english">
                    {translations.languages.english}
                  </SelectItem>
                  <SelectItem value="hindi">
                    {translations.languages.hindi}
                  </SelectItem>
                  <SelectItem value="urdu">
                    {translations.languages.urdu}
                  </SelectItem>
                  <SelectItem value="arabic">
                    {translations.languages.arabic}
                  </SelectItem>
                  <SelectItem value="spanish">
                    {translations.languages.spanish}
                  </SelectItem>
                  <SelectItem value="french">
                    {translations.languages.french}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>
            {translations.cancelButton}
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            {translations.saveChangesButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
