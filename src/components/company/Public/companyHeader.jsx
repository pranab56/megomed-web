"use client";
import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import JobsFollowersLinks from "../JobsFollowersLinks";

function CompanyHeaderPublic() {
  return (
    <>
      <div className="w-full h-full">
        <div className="w-full h-40 md:h-80 relative">
          <Image
            src="/card_image.png"
            alt="company-logo"
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
          <div className="absolute -bottom-25 md:-bottom-25 left-1/2 md:left-80 -translate-x-1/2 ">
            <div className="flex flex-col items-center md:items-start ">
              <Image
                src="/card_image.png"
                alt="company-logo"
                width={100}
                height={100}
                className="object-cover w-24 h-24 md:w-50 md:h-50  rounded-md border-4 border-white"
              />
              <h1 className="text-2xl font-bold mt-2 ">Company Name</h1>
              <p className="text-sm text-gray-500">Webisite Link</p>
              <p className="text-sm text-gray-500">Location</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-40">
        <AboutCompanySection />
        <JobsFollowersLinks />
        <CompanyInformationSection />
      </div>
    </>
  );
}

export default CompanyHeaderPublic;

const CompanyInformationSection = () => {
  return (
    <div className=" mb-10 ">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        Company Information
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            Company SIREN ( Registration Number)
          </p>
          <p className="text-base font-semibold mt-1">XXX XXX XXX</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Company SIRET (Establishment Number)
          </p>
          <p className="text-base font-semibold mt-1">XXX XXX XXX XXXXX</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">
            Company Numéro de TVA (VAT ID)
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
                <p className="text-sm font-medium">
                  Company KBIS ou Statut (EI)
                </p>
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
                <p className="text-sm font-medium">Company RC Pro</p>
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
                <p className="text-sm font-medium">Company Certificat de TVA</p>
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

const AboutCompanySection = () => {
  return (
    <div className="mb-10">
      <h1 className="h2-gradient-text text-2xl font-bold text-justify flex items-center gap-2">
        About Company{" "}
      </h1>
      <p className="text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
    </div>
  );
};
