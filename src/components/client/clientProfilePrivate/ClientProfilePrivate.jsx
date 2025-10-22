"use client";
import { Button } from "@/components/ui/button";
import provideIcon from "@/utils/IconProvider/provideIcon";
import Image from "next/image";
import { useState } from "react";
import {
  useClientVerificationRequestMutation,
  useGetMyprofileQuery,
} from "../../../features/clientProfile/ClientProfile";
import EditProfileDialog from "./EditProfileDialog";
import ClientInfoEditModal from "./ClientInfoEditModal";
import { getImageUrl } from "@/utils/getImageUrl";
import { FaRegFaceSmile } from "react-icons/fa6";
import { Edit, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";
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
    isVarified: "",
    language: [],
    companyName: "",
    followers: "",
  };

  const documentInfo = data?.data?.clientId;
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

  const [
    clientVerificationRequest,
    { isLoading: isClientVerificationRequestLoading },
  ] = useClientVerificationRequestMutation();
  const handleGetVerified = async () => {
    try {
      const response = await clientVerificationRequest({
        type: "client",
      }).unwrap();
      toast.success(
        response?.message || "Client verification request sent successfully!"
      );
      refetch();
    } catch (error) {
      console.error("Failed to send client verification request:", error);
      toast.error(
        "Failed to send client verification request. Please try again."
      );
    }
  };

  const handleViewDocument = (documentUrl, documentName) => {
    if (!documentUrl || documentUrl === "Not uploaded") {
      toast.error("No document available to view");
      return;
    }
    const fileExtension = documentUrl.split(".").pop().toLowerCase();
    const fullUrl = getImageUrl(documentUrl);
    if (
      fileExtension === "pdf" ||
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)
    ) {
      window.open(fullUrl, "_blank");
    } else if (fileExtension === "docx" || fileExtension === "doc") {
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = documentName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      try {
        window.open(fullUrl, "_blank");
      } catch (error) {
        const link = document.createElement("a");
        link.href = fullUrl;
        link.download = documentName || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
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
        {clientInfo.isVarified === "verified_request" ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-yellow-100 rounded-full px-2 py-1">
            <Shield className="w-4 h-4 text-yellow-600" />
            <span>Pending Verification</span>
          </div>
        ) : clientInfo.isVarified === "varified" ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-green-100 rounded-full px-2 py-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Verified Client</span>
          </div>
        ) : clientInfo.isVarified === "revision" ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-red-100 rounded-full px-2 py-1">
            <Shield className="w-4 h-4 text-red-600" />
            <span>Revision</span>
          </div>
        ) : (
          <Button
            className="button-gradient"
            onClick={() => handleGetVerified()}
          >
            {isClientVerificationRequestLoading ? "Sending..." : "Get Verified"}
          </Button>
        )}
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

          {clientInfo.isVarified === "varified" && (
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
        documentInfo={documentInfo}
        onEditClick={() => setIsClientInfoModalOpen(true)}
        onViewDocument={handleViewDocument}
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
        documentInfo={documentInfo}
      />
    </div>
  );
}

export default ClientProfilePrivate;

const ClientInformationSection = ({
  onEditClick,
  documentInfo,
  onViewDocument,
}) => {
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
          <p className="text-base font-semibold mt-1">
            {documentInfo?.registrationNumber}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            SIRET (Establishment Number)
          </p>
          <p className="text-base font-semibold mt-1">
            {documentInfo?.establishmentNumber}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Numéro de TVA (VAT ID)
          </p>
          <p className="text-base font-semibold mt-1">
            {documentInfo?.clientVatNumber}
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
                  {documentInfo?.clientKBISFile || "KBIS ou Statut (EI)"}
                </p>
                <p className="text-xs text-gray-500">
                  Business Registration or Articles of Association
                </p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium border p-2 rounded-md cursor-pointer"
              onClick={() =>
                onViewDocument(documentInfo?.clientKBISFile, "KBIS Document")
              }
            >
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">
                  {documentInfo?.clientRCFile || "RC Pro"}
                </p>
                <p className="text-xs text-gray-500">
                  Professional Liability Insurance
                </p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium border p-2 rounded-md cursor-pointer"
              onClick={() =>
                onViewDocument(documentInfo?.clientRCFile, "RC Pro Document")
              }
            >
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">
                  {documentInfo?.clientCertificateFile || "Certificat de TVA"}
                </p>
                <p className="text-xs text-gray-500">VAT Certificate</p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium border p-2 rounded-md cursor-pointer"
              onClick={() =>
                onViewDocument(
                  documentInfo?.clientCertificateFile,
                  "VAT Certificate"
                )
              }
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
