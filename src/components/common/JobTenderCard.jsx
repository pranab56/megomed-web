"use client";
import useToast from "@/hooks/showToast/ShowToast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useRespondMutation,
  useApplyTenderMutation,
} from "../../features/tender/tenderApi";
import { baseURL } from "../../utils/BaseURL";
import { Card, CardContent, CardFooter } from "../ui/card";
import ProposalModalJobTender from "./ProposalModalJobTender";

function JobTenderCard({ type = "tender", data }) {
  const router = useRouter();
  const showToast = useToast();
  const [respond, { isLoading: respondLoading }] = useRespondMutation();
  const [openProposalModal, setOpenProposalModal] = useState(false);

  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const defaultJobData = {
    jobImg: "/jobtender/job_tender.png",
    name: "CONLINE",
    designation: "Senior Graphic Designer",
    location: "Austin",
    jobType: "Remote",
  };
  const defaultTenderData = {
    jobImg: "/jobtender/job_tender.png",
    projectName: "CRMS Alignment",
    projectRole: "Business Analyst",
    posted: "03/2023",
    deadline: "05/2023",
  };

  const cardData =
    data || (type === "job" ? defaultJobData : defaultTenderData);

  // Check if job end date is today
  const isJobClosed = (endDateString) => {
    if (!endDateString) return false;
    const endDate = new Date(endDateString);
    const today = new Date();

    // Reset time to compare only dates
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return endDate <= today;
  };

  const handleViewJob = (e) => {
    e.preventDefault();
    // Navigate to job details page with smooth transition
    router.push(
      `/${type === "job" ? "job-details" : "tenders-details"}/${cardData._id}`
    );
  };

  // const handleApplyJob = async (e) => {
  //   e.preventDefault();

  //   if (type === "tender") {
  //     // Handle tender application
  //     try {
  //       const result = await respond(cardData._id).unwrap();
  //       if (result.success) {
  //         router.push(`/chat`);
  //         toast.success(result.message || "Tender applied successfully!");
  //       }
  //     } catch (error) {
  //       console.error("Error applying to tender:", error);
  //       showToast.error("Failed to apply for tender. Please try again.");
  //     }
  //   } else {
  //     // Handle job application (redirect to job details)
  //     console.log("Apply for job:", cardData._id);
  //     router.push(`/job-details/${cardData._id}`);
  //   }
  // };

  const handleRespondToJob = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't allow any action if job is closed
    if (isJobClosed(data?.endDate)) {
      return;
    }

    console.log("JobTenderCard - Opening proposal modal");
    setOpenProposalModal(true);
  };

  return (
    <div className="h-full group">
      <Card className="max-w-[20rem] mx-auto h-full flex flex-col p-1 md:p-2 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-1 md:p-2 flex-1 relative">
          <div className="aspect-video relative w-full">
            <Image
              src={baseURL + "/" + data.image}
              fill
              alt=""
              className="object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
            />

            {/* Hover overlay with buttons */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 rounded-md">
              <button
                onClick={handleViewJob}
                className="px-4 py-2 bg-transparent border-2 cursor-pointer border-white text-white rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-200 text-sm"
              >
                {type === "job" ? "View Job" : "View Tender"}
              </button>
              {userType === "freelancer" && (
                <button
                  onClick={handleRespondToJob}
                  disabled={respondLoading || isJobClosed(data?.endDate)}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    isJobClosed(data?.endDate)
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {isJobClosed(data?.endDate)
                    ? "Job Closed"
                    : respondLoading
                    ? "Applying..."
                    : type === "job"
                    ? "Apply Job"
                    : "Respond"}
                </button>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-1 md:p-2">
          <div className="flex flex-col items-start justify-between w-full px-1 md:px-2">
            <div className="space-y-1 md:space-y-2 w-full">
              <h1 className="text-base font-bold line-clamp-2">
                {data?.title}
              </h1>
              <p className="text-sm">{data?.jobType}</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Proposal Modal */}
      <ProposalModalJobTender
        open={openProposalModal}
        onOpenChange={setOpenProposalModal}
        jobId={data._id}
        type={type}
      />
    </div>
  );
}

export default JobTenderCard;
