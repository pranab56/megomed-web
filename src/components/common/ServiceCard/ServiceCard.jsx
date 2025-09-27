import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
function ServiceCard({ data }) {
  // Handle both freelancer and project data
  const isProject = data && data._id && data.title;
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  if (isProject) {
    // Project data structure
    const {
      _id,
      name = "Unknown Developer",
      title = "Project Title",
      description = "Project description",
      image = "/services/card.png",
      completedDate = new Date().toISOString(),
    } = data;

    // Format completion date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    };

    return (
      <Card className="w-full border-none bg-white flex flex-col h-[24rem]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="w-full h-40 relative overflow-hidden rounded-t-lg">
            <Image
              src={getImageUrl(image)}
              alt="Project image"
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">
                  Completed {formatDate(completedDate)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium h2-gradient-text">{title}</h4>
            <p className="text-lg text-black font-semibold">Project Showcase</p>
          </div>

          {/* <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p> */}
        </CardContent>
        {userType === "client" && (
          <CardFooter className="flex justify-end mt-auto pt-4">
            <Button className="button-gradient">View Project →</Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  // Freelancer data structure (fallback)
  const {
    profile = "/services/avatar.png",
    fullName = "Unknown Freelancer",
    designation = "Freelancer",
    dailyRate = 0,
    yearsOfExperience = "0 years",
    freelancerId = null,
  } = data || {};

  // Safely extract nested data (handles null freelancerId)
  const { experience = [], skills = [] } = freelancerId || {};

  // Derived values with safe defaults
  const jobCompleted = experience.length;
  const primarySkill = skills.length > 0 ? skills[0].skill : "General";

  // Generate avatar initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Safely get first experience description
  const firstDescription =
    experience.length > 0 ? experience[0]?.description || "" : "";

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

            <div>
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground">
                {yearsOfExperience} experience

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


      <CardFooter className="flex justify-end mt-auto pt-4">
        <Button className="button-gradient">Hire Freelancer →</Button>
      </CardFooter>
    </Card>

    // pronab

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
