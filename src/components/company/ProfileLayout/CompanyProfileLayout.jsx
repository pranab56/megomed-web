"use client";
import React from "react";
import CompanyHeaderPrivate from "../Private/companyHeader";
import CompanyHeaderPublic from "../Public/companyHeader";
import { usePathname, useParams } from "next/navigation";

function CompanyProfileLayout() {
  const pathname = usePathname();
  const params = useParams();
  const id = params.id;

  console.log("pathname", pathname);
  console.log("id", id);

  const isPrivate = pathname.includes("private");
  const isPublic = pathname.includes("public");

  // console.log("isPrivate", isPrivate);
  // console.log("isPublic", isPublic);

  if (isPrivate) {
    return <CompanyHeaderPrivate />;
  }

  if (isPublic && id) {
    return <CompanyHeaderPublic id={id} />;
  }
}

export default CompanyProfileLayout;
