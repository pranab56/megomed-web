import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { baseURL } from '../../../utils/BaseURL';

function ServiceCard({ freelancer }) {



  // Handle default images
  const coverPhoto = freelancer?.coverPhoto && freelancer.coverPhoto !== "undefined"
    ? `${baseURL}/${freelancer.coverPhoto}`
    : "/services/service_1.png"; // fallback image

  const profilePhoto = freelancer?.profile && freelancer.profile !== "undefined"
    ? `${baseURL}/${freelancer.profile}`
    : "/default-avatar.png"; // fallback avatar

  return (
    <Card className="w-full border-none bg-white overflow-hidden h-[450px] flex flex-col p-0">
      {/* Header with larger proportional height */}
      <div className="h-[180px] w-full relative flex-shrink-0">
        <Image
          src={coverPhoto}
          alt="card background"
          fill
          className="object-cover"
          onError={(e) => {
            e.target.src = "/services/service_1.png";
          }}
        />
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage
                src={profilePhoto}
                alt={freelancer?.fullName}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {freelancer?.fullName || "Unknown Freelancer"}
              </p>
              <p className="text-xs text-gray-500">
                {freelancer?.yearsOfExperience || "No"} experience
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-xs text-gray-500 whitespace-nowrap">
              Job Completed: {freelancer?.jobsDone || 0}
            </p>
            <p className="text-sm font-bold text-blue-600">
              Daily Rate: ${freelancer?.dailyRate || 0}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <h4 className="text-sm font-medium text-blue-600 mb-1">
            {freelancer?.designation || "Freelancer"}
          </h4>
          <p className="text-lg text-gray-900 font-semibold">
            {freelancer?.designation || "Specialist"}
          </p>
        </div>

        {/* Skills section */}
        {freelancer?.freelancerId?.skills && (
          <div className="mb-3 flex flex-wrap gap-1">
            {freelancer.freelancerId.skills.slice(0, 3).map((skill, index) => (
              <span
                key={skill._id || index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {skill.skill}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {freelancer?.location && (
          <p className="text-xs text-gray-500 mb-2">
            📍 {freelancer.location}
          </p>
        )}

        {/* Button at bottom */}
        <Button className="w-full bg-[#00298A] hover:bg-[#00298A]/90 text-white py-2.5 font-medium mt-auto">
          Hire Freelancer →
        </Button>
      </div>
    </Card>
  );
}

export default ServiceCard;