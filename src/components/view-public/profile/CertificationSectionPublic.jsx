import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Calendar, CheckCircle, X } from "lucide-react";
import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";
import { VscEye } from "react-icons/vsc";

function CertificationSectionPublic({ freelancerData }) {
  // Extract academic certificates from the data
  const academicCertificates =
    freelancerData?.freelancerId?.academicCertificateFiles || [];

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewingCertification, setViewingCertification] = useState(null);

  // Generate random colors for certification icons
  const getCertificationColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
  };

  const handleViewCertification = (certification) => {
    console.log("viewingCertification", certification);
    setViewingCertification(certification);
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerOpen(false);
    setViewingCertification(null);
  };

  // Don't render anything if no certificates
  if (academicCertificates.length === 0) {
    return null;
  }

  return (
    <div className="my-5 space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-blue-600" />
            <h1 className="h2-gradient-text text-2xl font-bold">
              Certifications
            </h1>
          </div>
          {academicCertificates && academicCertificates.length > 0 && (
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {academicCertificates.length}
            </div>
          )}
        </div>
      </div>

      {/* Certifications Grid with ScrollArea */}
      <ScrollArea className="h-[300px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {academicCertificates.map((certification, index) => (
            <Card
              key={index}
              className="p-6 relative hover:shadow-lg transition-shadow duration-200"
            >
              {/* Verification Status Icon */}
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>

              {/* Certification Icon */}
              <div
                className={`w-12 h-12 ${getCertificationColor(
                  index
                )} rounded-lg flex items-center justify-center mb-4`}
              >
                <Award className="w-6 h-6 text-white" />
              </div>

              {/* Certification Details */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {certification.name || `Certification ${index + 1}`}
                </h3>
                <p className="text-gray-600 text-sm">
                  {certification.institution || "Institution Name"}
                </p>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Obtained in{" "}
                    {certification.obtainedDate
                      ? new Date(certification.obtainedDate).getFullYear()
                      : "2023"}
                  </span>
                </div>
              </div>

              {/* Verified Button and View Button */}
              <div className="flex items-center justify-between">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                  Verified
                </button>
                <VscEye
                  onClick={() => handleViewCertification(certification)}
                  size={25}
                  className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                />
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Image Viewer Modal */}
      <Dialog open={isImageViewerOpen} onOpenChange={handleCloseImageViewer}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] max-w-[95vw] max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600" />
                <span>
                  {viewingCertification?.name || "Certification View"}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Certification Details */}
            {viewingCertification && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {viewingCertification.name || "Certification Name"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Institution:</strong>{" "}
                      {viewingCertification.institution || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Obtained:</strong>{" "}
                      {viewingCertification.obtainedDate
                        ? new Date(
                            viewingCertification.obtainedDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Display */}
            <div className="flex justify-center">
              {viewingCertification?.image ? (
                <div className="relative w-full max-w-4xl max-h-[60vh] overflow-hidden">
                  <Image
                    src={getImageUrl(viewingCertification.image)}
                    alt={`Certification ${
                      viewingCertification.name || "image"
                    }`}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain rounded-lg border shadow-lg"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No images available for this certification
                  </p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleCloseImageViewer}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CertificationSectionPublic;
