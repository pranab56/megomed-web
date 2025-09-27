"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";
import CommentSection from './CommentSection';



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
        <ProfileHeader setCoverPhoto={setCoverPhoto} />
        <ProfileSections />
        <SkillsSection />
        <CommentSection />
      </div>
      <ExperienceSection />
    </div>
  );
}


function MyProfileLayout() {
  // Client-side only state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);


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
  if (!isClient) {
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


  return (
    <div className="animate-fade-in-up">
      <MyProfileLayoutContent
        translations={translations}
        isClient={isClient}
        coverPhoto={coverPhoto}
        setCoverPhoto={setCoverPhoto}
      />
    </div>
  );
}


export default MyProfileLayout;



