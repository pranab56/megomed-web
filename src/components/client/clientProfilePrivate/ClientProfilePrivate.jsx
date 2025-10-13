"use client";
import { Button } from "@/components/ui/button";
import provideIcon from "@/utils/IconProvider/provideIcon";
import Image from "next/image";
import { useState } from "react";
import { useGetMyprofileQuery } from "../../../features/clientProfile/ClientProfile";
import EditProfileDialog from "./EditProfileDialog";
import ClientInfoEditModal from "./ClientInfoEditModal";
import { getImageUrl } from "@/utils/getImageUrl";
import { FaRegFaceSmile } from "react-icons/fa6";
import { Edit, FileText } from "lucide-react";

function ClientProfilePrivate({ translations }) {
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isClientInfoModalOpen, setIsClientInfoModalOpen] = useState(false);
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
    companyName: "",
    followers: "",
  };

  const handleEditProfileClose = () => {
    setIsEditProfileDialogOpen(false);
    // Refetch data after closing dialog to get updated profile
    refetch();
  };

  const handleClientInfoModalClose = () => {
    setIsClientInfoModalOpen(false);
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
        <Button className="button-gradient">Get Verified</Button>
      </div>

      <div className="flex gap-10 items-start py-2">
        <Image
          src={getImageUrl(clientInfo.profile) || "/client/profile/client.png"}
          alt="client-profile"
          width={150}
          height={150}
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{clientInfo.fullName}</h1>
          <p className="">Company Name : {clientInfo.companyName}</p>
          <p>
            {translations.location}: {clientInfo.location || "Not specified"}
          </p>
          <p>
            {translations.email}: {clientInfo.email}
          </p>

          {/* Display languages */}
          {clientInfo.language && clientInfo.language.length > 0 && (
            <p>Languages: {clientInfo.language.join(", ")}</p>
          )}

          {clientInfo.isVarified && (
            <div className="flex items-center gap-2">
              <span>{provideIcon({ name: "verified" })}</span>{" "}
              {translations.verifiedClient}
            </div>
          )}
        </div>

        <Button className="button-gradient">
          <FaRegFaceSmile className="w-4 h-4 mr-2 animate-bounce" />
          Followers ({clientInfo?.followers || 0})
        </Button>
      </div>
      <div className="space-y-2">
        <h1 className="h2-gradient-text text-2xl font-bold text-justify">
          {translations.aboutCompany}
        </h1>
        <p>{clientInfo.aboutCompany || translations.companyDescription}</p>
      </div>
      <ClientInformationSection
        onEditClick={() => setIsClientInfoModalOpen(true)}
      />
      <EditProfileDialog
        isOpen={isEditProfileDialogOpen}
        onClose={handleEditProfileClose}
        profileData={clientInfo}
      />
      <ClientInfoEditModal
        isOpen={isClientInfoModalOpen}
        onClose={handleClientInfoModalClose}
        clientInfo={clientInfo}
      />
    </div>
  );
}

export default ClientProfilePrivate;

const ClientInformationSection = ({ onEditClick }) => {
  return (
    <div>
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        Client Information{" "}
        <Edit
          className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-700"
          onClick={onEditClick}
        />
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            SIREN (Company Registration Number)
          </p>
          <p className="text-base font-semibold mt-1">XXX XXX XXX</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            SIRET (Establishment Number)
          </p>
          <p className="text-base font-semibold mt-1">XXX XXX XXX XXXXX</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Numéro de TVA (VAT ID)
          </p>
          <p className="text-base font-semibold mt-1">FR XX XXXXXXXXX</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">KBIS ou Statut (EI)</p>
                <p className="text-xs text-gray-500">
                  Business Registration or Articles of Association
                </p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">RC Pro</p>
                <p className="text-xs text-gray-500">
                  Professional Liability Insurance
                </p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Certificat de TVA</p>
                <p className="text-xs text-gray-500">VAT Certificate</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
