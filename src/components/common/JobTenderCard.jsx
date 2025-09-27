"use client";
import Image from "next/image";
import { baseURL } from "../../utils/BaseURL";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";

function JobTenderCard({ type = "tender", data }) {
  const router = useRouter();
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

  console.log("job portal", data);

  const cardData =
    data || (type === "job" ? defaultJobData : defaultTenderData);

  const handleViewJob = (e) => {
    e.preventDefault();
    // Navigate to job details page
    window.location.href = `/${
      type === "job" ? "job-details" : "tenders-details"
    }/${cardData._id}`;
  };

  const handleApplyJob = (e) => {
    e.preventDefault();
    // Handle apply job logic here
    console.log("Apply for job:", cardData._id);
    router.push(
      `/${type === "job" ? "job-details" : "tenders-details"}/${cardData._id}`
    );
    // You can add your apply logic here
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
                View Job
              </button>
              <button
                onClick={handleApplyJob}
                className="px-4 py-2 bg-white text-black rounded-lg cursor-pointer font-medium hover:bg-gray-100 transition-all duration-200 text-sm"
              >
                Apply Job
              </button>
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
    </div>
  );
}

export default JobTenderCard;
