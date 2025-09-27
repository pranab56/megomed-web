import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  return (
    <Card className="w-full border-none bg-white flex flex-col h-[28rem]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="w-full h-40 relative overflow-hidden rounded-t-lg">
          <Image
            src="/services/card.png"
            alt="card background"
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={profile} />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground">
                {yearsOfExperience} experience
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Job Completed: {jobCompleted}
            </p>
            <p className="text-normal h2-gradient-text font-bold">
              Daily Rate: ${dailyRate}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium h2-gradient-text">
            {designation}
          </h4>
          <p className="text-lg text-black font-semibold">
            {primarySkill} Specialist
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {firstDescription
            ? `${firstDescription.substring(0, 100)}...`
            : "Experienced professional ready to help with your project."}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end mt-auto pt-4">
        <Button className="button-gradient">Hire Freelancer →</Button>
      </CardFooter>
    </Card>

    // pronab
  );
}

export default ServiceCard;
