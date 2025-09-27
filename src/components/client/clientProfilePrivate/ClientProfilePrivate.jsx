"use client";
import { Button } from "@/components/ui/button";
import provideIcon from "@/utils/IconProvider/provideIcon";
import Image from "next/image";
import { useState } from "react";
import { useGetMyprofileQuery } from '../../../features/clientProfile/ClientProfile';
import EditProfileDialog from "./EditProfileDialog";

function ClientProfilePrivate({ translations }) {
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const { data, error, isLoading, refetch } = useGetMyprofileQuery();

  // Use API data or fallback to empty values
  const clientInfo = data?.data || {
    fullName: "",
    profile: "",
    aboutCompany: "",
    designation: "",
    location: "",
    email: "",
    isVarified: false,
    language: [],
    companyName: ""
  };

  const handleEditProfileClose = () => {
    setIsEditProfileDialogOpen(false);
    // Refetch data after closing dialog to get updated profile
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-center items-center h-64">
          <p>Error loading profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="flex gap-2 justify-center md:justify-end ">
        <Button
          className="button-gradient"
          onClick={() => setIsEditProfileDialogOpen(true)}
        >
          {translations.editProfile} {provideIcon({ name: "edit" })}
        </Button>
      </div>
      <div className="flex gap-10 items-start py-2">
        <Image
          src={clientInfo.profile || "/client/profile/client.png"}
          alt="client-profile"
          width={150}
          height={150}
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{clientInfo.fullName}</h1>
          <p className="">Company Name : {clientInfo.companyName}</p>
          <p>
            {translations.department}: {clientInfo.designation || "Not specified"}
          </p>
          <p>
            {translations.location}: {clientInfo.location || "Not specified"}
          </p>
          <p>
            {translations.email}: {clientInfo.email}
          </p>

          {/* Display languages */}
          {clientInfo.language && clientInfo.language.length > 0 && (
            <p>
              Languages: {clientInfo.language.join(", ")}
            </p>
          )}

          {clientInfo.isVarified && (
            <div className="flex items-center gap-2">
              <span>{provideIcon({ name: "verified" })}</span>{" "}
              {translations.verifiedClient}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="h2-gradient-text text-2xl font-bold text-justify">
          {translations.aboutCompany}
        </h1>
        <p>{clientInfo.aboutCompany || translations.companyDescription}</p>
      </div>
      <EditProfileDialog
        isOpen={isEditProfileDialogOpen}
        onClose={handleEditProfileClose}
        profileData={clientInfo}
      />
    </div>
  );
}

export default ClientProfilePrivate;