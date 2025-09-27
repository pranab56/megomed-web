"use client";
import Image from "next/image";
import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";

function ProfileEditDialog() {
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
        changeProfilePicture: "Change Profile Picture",
        changeCover: "Change Cover",
        cancel: "Cancel",
        saveChanges: "Save Changes",
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
      },
    [messages]
  );

  return (
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
          {translations.changeProfilePicture}
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
          {translations.changeCover}
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
          <Select defaultValue="Design">
            <SelectTrigger>
              <SelectValue placeholder={translations.serviceTypePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Design">
                {translations.serviceTypes.design}
              </SelectItem>
              <SelectItem value="Development">
                {translations.serviceTypes.development}
              </SelectItem>
              <SelectItem value="Marketing">
                {translations.serviceTypes.marketing}
              </SelectItem>
              <SelectItem value="Writing">
                {translations.serviceTypes.writing}
              </SelectItem>
              <SelectItem value="Consulting">
                {translations.serviceTypes.consulting}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{translations.categoryTypeLabel}</Label>
          <Select defaultValue="UI/UX Designer">
            <SelectTrigger>
              <SelectValue placeholder={translations.categoryTypePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UI/UX Designer">
                {translations.categoryTypes.uiUxDesigner}
              </SelectItem>
              <SelectItem value="Graphic Designer">
                {translations.categoryTypes.graphicDesigner}
              </SelectItem>
              <SelectItem value="Web Designer">
                {translations.categoryTypes.webDesigner}
              </SelectItem>
              <SelectItem value="Product Designer">
                {translations.categoryTypes.productDesigner}
              </SelectItem>
              <SelectItem value="Frontend Developer">
                {translations.categoryTypes.frontendDeveloper}
              </SelectItem>
              <SelectItem value="Backend Developer">
                {translations.categoryTypes.backendDeveloper}
              </SelectItem>
              <SelectItem value="Full Stack Developer">
                {translations.categoryTypes.fullStackDeveloper}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{translations.locationLabel}</Label>
          <Select defaultValue="Bangladesh">
            <SelectTrigger>
              <SelectValue placeholder={translations.locationPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangladesh">
                {translations.locations.bangladesh}
              </SelectItem>
              <SelectItem value="India">
                {translations.locations.india}
              </SelectItem>
              <SelectItem value="USA">{translations.locations.usa}</SelectItem>
              <SelectItem value="UK">{translations.locations.uk}</SelectItem>
              <SelectItem value="Canada">
                {translations.locations.canada}
              </SelectItem>
              <SelectItem value="Australia">
                {translations.locations.australia}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{translations.languageLabel}</Label>
          <Select defaultValue="Bengali">
            <SelectTrigger>
              <SelectValue placeholder={translations.languagePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bengali">
                {translations.languages.bengali}
              </SelectItem>
              <SelectItem value="English">
                {translations.languages.english}
              </SelectItem>
              <SelectItem value="Hindi">
                {translations.languages.hindi}
              </SelectItem>
              <SelectItem value="Urdu">
                {translations.languages.urdu}
              </SelectItem>
              <SelectItem value="Arabic">
                {translations.languages.arabic}
              </SelectItem>
              <SelectItem value="Spanish">
                {translations.languages.spanish}
              </SelectItem>
              <SelectItem value="French">
                {translations.languages.french}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditDialog;
