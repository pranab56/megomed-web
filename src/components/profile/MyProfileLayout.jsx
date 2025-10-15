"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";
import CommentSection from "./CommentSection";
import FreeLancerInfoEditModal from "./FreeLancerInfoEditModal";
import { Edit } from "lucide-react";
import { FileText } from "lucide-react";
import CertificationSection from "./certificationSection/CertificationSection";
import { useGetMyprofileQuery } from "../../features/clientProfile/ClientProfile";

// Helper function to handle file viewing based on file type
const handleFileView = (filePath) => {
  const fileUrl = getImageUrl(filePath);
  const fileExtension = filePath.split(".").pop().toLowerCase();

  // For images, use direct link
  if (
    ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(fileExtension)
  ) {
    window.open(fileUrl, "_blank");
  } else {
    // For documents (PDF, DOC, etc.), create a link that forces new tab
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

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
  isFreelancerInfoModalOpen,
  setIsFreelancerInfoModalOpen,
  freelancerInfo,
  profileData,
  isLoading,
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
        <FreelancerInformationSection
          onEditClick={() => setIsFreelancerInfoModalOpen(true)}
          freelancerData={profileData?.freelancerId}
        />
        <ProfileSections profileData={profileData} />
        <SkillsSection freelancerInfo={freelancerInfo} />
        <CertificationSection
          certificationData={
            profileData?.freelancerId?.academicCertificateFiles
          }
          isLoading={isLoading}
        />
        <CommentSection freelancerInfo={freelancerInfo} />
      </div>
      <ExperienceSection freelancerInfo={freelancerInfo} />
      <FreeLancerInfoEditModal
        isOpen={isFreelancerInfoModalOpen}
        onClose={() => setIsFreelancerInfoModalOpen(false)}
        clientInfo={freelancerInfo}
      />
    </div>
  );
}

function MyProfileLayout() {
  // Client-side only state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isFreelancerInfoModalOpen, setIsFreelancerInfoModalOpen] =
    useState(false);

  // Fetch profile data using the API
  const { data: profileResponse, isLoading, error } = useGetMyprofileQuery();
  const profileData = profileResponse?.data;

  // Extract freelancer info from API response
  const freelancerInfo = profileData?.freelancerId || {
    siren: "",
    siret: "",
    vatId: "",
  };

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

  // Show loading state until client-side hydration is complete or data is loading
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

  return (
    <div className="animate-fade-in-up">
      <MyProfileLayoutContent
        translations={translations}
        isClient={isClient}
        coverPhoto={coverPhoto}
        setCoverPhoto={setCoverPhoto}
        isFreelancerInfoModalOpen={isFreelancerInfoModalOpen}
        setIsFreelancerInfoModalOpen={setIsFreelancerInfoModalOpen}
        freelancerInfo={freelancerInfo}
        profileData={profileData}
        isLoading={isLoading}
      />
    </div>
  );
}

export default MyProfileLayout;

const FreelancerInformationSection = ({ onEditClick, freelancerData }) => {
  return (
    <div className="mb-10">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        Freelancer Information{" "}
        <Edit
          className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-700"
          onClick={onEditClick}
        />
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            Freelancer SIREN ( Registration Number)
          </p>
          <p className="text-base font-semibold mt-1">
            {freelancerData?.registrationNumber || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Freelancer SIRET (Establishment Number)
          </p>
          <p className="text-base font-semibold mt-1">
            {freelancerData?.establishmentNumber || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Freelancer Numéro de TVA (VAT ID)
          </p>
          <p className="text-base font-semibold mt-1">
            {freelancerData?.freelancerVatNumber || "Not provided"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">
                  Freelancer KBIS ou Statut (EI)
                </p>
                <p className="text-xs text-gray-500">
                  Business Registration or Articles of Association
                </p>
              </div>
            </div>
            {freelancerData?.freelancerKBISFile ? (
              <a
                href={getImageUrl(freelancerData.freelancerKBISFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleFileView(freelancerData.freelancerKBISFile);
                }}
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Not uploaded</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Freelancer RC Pro</p>
                <p className="text-xs text-gray-500">
                  Professional Liability Insurance
                </p>
              </div>
            </div>
            {freelancerData?.freelancerRCFile ? (
              <a
                href={getImageUrl(freelancerData.freelancerRCFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleFileView(freelancerData.freelancerRCFile);
                }}
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Not uploaded</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">
                  Freelancer Certificat de TVA
                </p>
                <p className="text-xs text-gray-500">VAT Certificate</p>
              </div>
            </div>
            {freelancerData?.freelancerCertificateFile ? (
              <a
                href={getImageUrl(freelancerData.freelancerCertificateFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleFileView(freelancerData.freelancerCertificateFile);
                }}
              >
                View
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Not uploaded</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
