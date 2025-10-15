import React, { useState } from "react";
import { Card } from "../../ui/card";
import { Edit, Plus, Trash2 } from "lucide-react";
import CertificationAddEditModal from "./CertificationAddEditModal";
import {
  useUpdateFreelancerInfoCertificateMutation,
  useDeleteCertificateMutation,
} from "../../../features/freelancerInfo&Certificate/freelancerInfo&CertificateApi";
import { getImageUrl } from "../../../utils/getImageUrl";
import toast from "react-hot-toast";
import Image from "next/image";

function CertificationSection({ certificationData = [], isLoading = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [updateFreelancerInfoCertificate] =
    useUpdateFreelancerInfoCertificateMutation();
  const [deleteCertificate] = useDeleteCertificateMutation();
  const handleAddCertification = () => {
    setModalMode("add");
    setSelectedCertification(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertification(null);
  };

  const handleDeleteCertification = async (imageUrl) => {
    try {
      await deleteCertificate(imageUrl).unwrap();
      toast.success("Certification deleted successfully!");
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error("Failed to delete certification. Please try again.");
    }
  };

  return (
    <div className="my-5 space-y-4">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-4">
        Certification Section
        <Plus
          className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-700"
          onClick={handleAddCertification}
        />
      </h1>
      <Card className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 w-full bg-gray-200 rounded-lg animate-pulse"
            />
          ))
        ) : certificationData && certificationData.length > 0 ? (
          // Display actual certification images
          certificationData.map((certImage, index) => (
            <div
              key={index}
              className="h-40 w-full rounded-lg mx-auto relative group overflow-hidden"
            >
              <Image
                src={getImageUrl(certImage)}
                alt={`Certification ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                width={500}
                height={500}
              />
              {/* Edit overlay that appears on hover */}
              <div className="absolute inset-0 bg-blue-500 bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-3">
                <Trash2
                  className="w-6 h-6 text-white cursor-pointer"
                  onClick={() => handleDeleteCertification(certImage)}
                />
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 mb-4">No certifications uploaded yet</p>
            <p className="text-sm text-gray-400">
              Click the + button to add your first certification
            </p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <CertificationAddEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        certificationData={selectedCertification}
      />
    </div>
  );
}

export default CertificationSection;
