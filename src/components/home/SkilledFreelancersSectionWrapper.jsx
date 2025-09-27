"use client";
import React from "react";
import { useLocale } from "@/components/common/TranslationWrapper";
import SkilledFreelancersSection from "./SkilledFreelancersSection";

function SkilledFreelancersSectionWrapper() {
  const locale = useLocale();

  // Force complete re-render when locale changes
  return <SkilledFreelancersSection key={`skilled-freelancers-${locale}`} />;
}

export default SkilledFreelancersSectionWrapper;
