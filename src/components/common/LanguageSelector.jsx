"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

export default function LanguageSelector({ className = "" }) {
  // Default to 'en', but you could load from localStorage if needed
  const [locale, setLocale] = useState("en");

  // Optional: Load initial language from localStorage on mount
  useEffect(() => {
    const savedLocale = typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    if (savedLocale === "en" || savedLocale === "fr") {
      setLocale(savedLocale);
    }
  }, []);

  const handleLanguageChange = (newLocale) => {
    setLocale(newLocale);
    // Optional: persist in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
    // Note: Without Redux or context, this change only affects this component
    // If you need to update the whole app language, you'd need a context provider
  };

  const getFlagAndLabel = (loc) => {
    if (loc === "en") {
      return { countryCode: "GB", label: "English" };
    } else if (loc === "fr") {
      return { countryCode: "FR", label: "Français" };
    }
    return { countryCode: "GB", label: "English" };
  };

  const current = getFlagAndLabel(locale);

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className={`w-[130px] !h-10 ${className} ring-0 outline-none focus:border-none `}>
        <div className="flex items-center">
          <ReactCountryFlag
            countryCode={current.countryCode}
            svg
            className="mr-2"
            style={{ width: "18px", height: "18px" }}
          />
          <SelectValue>{current.label}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <div className="flex items-center">
            <ReactCountryFlag
              countryCode="GB"
              svg
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
            English
          </div>
        </SelectItem>
        <SelectItem value="fr">
          <div className="flex items-center">
            <ReactCountryFlag
              countryCode="FR"
              svg
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
            Français
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}