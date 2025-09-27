"use client";
import React from "react";
import { useLocale } from "@/components/common/TranslationWrapper";
import WhyChooseUs from "./WhyChooseUs";

function WhyChooseUsWrapper() {
  const locale = useLocale();

  // Force complete re-render when locale changes
  return <WhyChooseUs key={`why-choose-us-${locale}`} />;
}

export default WhyChooseUsWrapper;
