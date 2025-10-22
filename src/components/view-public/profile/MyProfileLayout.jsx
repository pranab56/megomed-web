"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";
import CommentSection from "./CommentSection";
import { useParams } from "next/navigation";
import { useGetFreelancerPublicProfileQuery } from "@/features/clientProfile/ClientProfile";

// Dynamic imports with ssr: false

const ProfileHeader = dynamic(() => import("./ProfileHeader"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    </div>
  ),
});

const ProfileSections = dynamic(() => import("./ProfileSection"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    </div>
  ),
});

const SkillsSection = dynamic(() => import("./SkillSection"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    </div>
  ),
});

const ExperienceSection = dynamic(() => import("./ExperienceSection"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
    </div>
  ),
});

function MyProfileLayoutContent({
  translations,
  isClient,
  coverPhoto,
  setCoverPhoto,
  freelancerData,
}) {
  return (
    <div className="w-full">
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
        <Image
          src={getImageUrl(coverPhoto) || "/myprofile/cover.png"}
          alt={isClient ? translations.coverPhotoAlt : "Cover Photo"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
        {/* Pass the API data to each component */}
        <ProfileHeader setCoverPhoto={setCoverPhoto} data={freelancerData} />
        <ProfileSections freelancerData={freelancerData} />
        <SkillsSection freelancerData={freelancerData} />
        <CertificationSectionPublic freelancerData={freelancerData} />
        <CommentSection freelancerData={freelancerData} />
      </div>
      <ExperienceSection freelancerData={freelancerData} />
    </div>
  );
}

function MyProfileLayoutPublic() {
  // Client-side only state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const params = useParams();
  const id = params?.id;

  // Make the API query here to pass to all child components
  const { data, isLoading, error } = useGetFreelancerPublicProfileQuery(id, {
    skip: !id, // Skip the query if no ID is available
  });

  // Extract freelancer data and cover photo if available
  useEffect(() => {
    if (data?.data?.coverPhoto) {
      setCoverPhoto(data.data.coverPhoto);
    }
  }, [data]);

  // Get translations from Redux (moved outside dynamic component)
  const messages = "EN";
  const translations = useMemo(
    () =>
      messages?.profile?.layout || {
        coverPhotoAlt: "Cover Photo",
      },
    [messages]
  );

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client-side hydration is complete
  if (!isClient || isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
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
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading freelancer profile: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <MyProfileLayoutContent
        translations={translations}
        isClient={isClient}
        coverPhoto={coverPhoto}
        setCoverPhoto={setCoverPhoto}
        freelancerData={data?.data}
      />
    </div>
  );
}

export default MyProfileLayoutPublic;

const CertificationSectionPublic = dynamic(
  () => import("./CertificationSectionPublic.jsx"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
      </div>
    ),
  }
);
