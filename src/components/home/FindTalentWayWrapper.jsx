"use client";
import React from "react";
import { useLocale } from "@/components/common/TranslationWrapper";
import FindTalentWay from "./FindTalentWay";

function FindTalentWayWrapper() {
  const locale = useLocale();

  // Force complete re-render when locale changes
  return <FindTalentWay key={`find-talent-way-${locale}`} />;
}

export default FindTalentWayWrapper;
