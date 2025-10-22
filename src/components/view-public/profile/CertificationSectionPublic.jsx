import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";
import React from "react";

function CertificationSectionPublic({ freelancerData }) {
  // Extract academic certificates from the data
  const academicCertificates =
    freelancerData?.freelancerId?.academicCertificateFiles || [];

  // Don't render anything if no certificates
  if (academicCertificates.length === 0) {
    return null;
  }

  return (
    <div className="my-5 space-y-4">
      <h1 className="text-2xl  text-blue-600 h2-gradient-text font-bold text-justify flex items-center gap-4">
        Academic Certificates
      </h1>
      <Card className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        {academicCertificates.map((certImage, index) => (
          <div
            key={index}
            className="h-40 w-full rounded-lg mx-auto relative group overflow-hidden"
          >
            <Image
              src={getImageUrl(certImage)}
              alt={`Certificate ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              width={500}
              height={500}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}

export default CertificationSectionPublic;
