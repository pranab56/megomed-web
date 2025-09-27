"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

// Dynamic imports with SSR disabled to prevent hydration errors
const ClientProfilePrivate = dynamic(() => import("./ClientProfilePrivate"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
        <div className="flex gap-10">
          <div className="w-[150px] h-[150px] bg-gray-200 rounded-full"></div>
          <div className="space-y-3 flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  ),
});

const ProjectListPrivate = dynamic(() => import("./ProjectListPrivate"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-100 mx-auto py-6 my-6 px-4">
      <div className="space-y-4 w-full max-w-7xl mx-auto py-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  ),
});

function ClientProfilePrivateLayout() {
  const [isClient, setIsClient] = useState(false);

  // Local translations (no Redux)
  const translations = useMemo(
    () => ({
      editProfile: "Edit Profile",
      ongoingTenders: "Ongoing Tenders",
      companyLife: "Company Life",
      addNewPost: "Add New Post",
      editPost: "Edit Post",
      viewTender: "View Tender",
      project: "Project",
      role: "Role",
      aboutCompany: "About The Company",
      companyDescription:
        "At [Freelancer Name], we connect businesses with talented professionals from around the world. Our platform offers a wide range of skilled freelancers, ready to deliver high-quality work across various industries. Whether you're looking for web development, graphic design, content writing, or marketing expertise, we make it easy to find the perfect match for your project. With a focus on efficiency, reliability, and client satisfaction, we ensure every collaboration is seamless and successful. Join us today and experience the power of skilled freelancers tailored to your needs",
      verifiedClient: "Verified Client",
      department: "Department",
      location: "Location",
      email: "Email",
      viewPosts: "View Posts →",
      uiuxDesigner: "UI/UX Designer",
      uxReviewPresentations: "UX review presentations",
      uiuxDescription:
        "I will do ui ux design for saas, web app, dashboard in figma",
      dateFormat: "20 Jan 2022",
    }),
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full">
        <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <ClientProfilePrivate translations={translations} />
      <ProjectListPrivate translations={translations} />
    </div>
  );
}

export default ClientProfilePrivateLayout;
