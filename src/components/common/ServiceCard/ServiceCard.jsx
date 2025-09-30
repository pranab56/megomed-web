import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";
import { baseURL } from "../../../utils/BaseURL";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useHireFreelancerMutation } from "@/features/hireFreelancer/hireFreelancerApi";

function ServiceCard({ data, freelancer }) {
  // Use either data or freelancer prop, prefer freelancer if both exist
  const item = freelancer || data;
  const router = useRouter();
  const [hireFreelancer, { isLoading: isHiring }] = useHireFreelancerMutation();

  const currentUser = localStorage.getItem("role");
  const userType = currentUser;

  // Handle hire freelancer
  const handleHireFreelancer = async () => {
    if (userType !== "client") {
      toast.error("Only clients can hire freelancers");
      return;
    }

    if (!item._id) {
      toast.error("Freelancer ID not found");
      return;
    }

    try {
      await hireFreelancer(item._id).unwrap();
      toast.success("Freelancer hired successfully!");
      router.push("/chat");
    } catch (error) {
      console.error("Failed to hire freelancer:", error);
      toast.error("Failed to hire freelancer. Please try again.");
    }
  };

  // Check if it's a project (has title and _id)
  const isProject = item && item._id && item.title;

  if (isProject) {
    // Project data structure
    const {
      _id,
      name = "Unknown Developer",
      title = "Project Title",
      description = "Project description",
      image = "/services/card.png",
      completedDate = new Date().toISOString(),
    } = item;

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
    location = "",
    jobsDone = 0,
    coverPhoto = "/services/service_1.png",
  } = item || {};

  // Handle default images
  const coverPhotoUrl =
    coverPhoto && coverPhoto !== "undefined"
      ? `${baseURL}/${coverPhoto}`
      : "/services/service_1.png";

  const profilePhotoUrl =
    profile && profile !== "undefined"
      ? `${baseURL}/${profile}`
      : "/default-avatar.png";

  // Safely extract nested data
  const { experience = [], skills = [] } = freelancerId || {};

  return (
    <Card className="w-full border-none bg-white overflow-hidden h-[450px] flex flex-col p-0">
      {/* Header with larger proportional height */}
      <div className="h-[180px] w-full relative flex-shrink-0">
        <Image
          src={coverPhotoUrl}
          alt="card background"
          fill
          className="object-cover"
        />
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage
                src={profilePhotoUrl}
                alt={fullName}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fullName}
              </p>
              <p className="text-xs text-gray-500">
                {yearsOfExperience} experience
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-xs text-gray-500 whitespace-nowrap">
              Job Completed: {jobsDone}
            </p>
            <p className="text-sm font-bold text-blue-600">
              Daily Rate: ${dailyRate}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <h4 className="text-sm font-medium text-blue-600 mb-1">
            {designation}
          </h4>
          <p className="text-lg text-gray-900 font-semibold">{designation}</p>
        </div>

        {/* Skills section */}
        {skills.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
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
        {location && (
          <p className="text-xs text-gray-500 mb-2">📍 {location}</p>
        )}

        {/* Button at bottom */}
        <Button
          onClick={handleHireFreelancer}
          disabled={isHiring || userType !== "client"}
          className="w-full bg-[#00298A] hover:bg-[#00298A]/90 text-white py-2.5 font-medium mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isHiring ? "Hiring..." : "Hire Freelancer →"}
        </Button>
      </div>
    </Card>
  );
}

export default ServiceCard;
