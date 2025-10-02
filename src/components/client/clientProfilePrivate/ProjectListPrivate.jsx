"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LucideCirclePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useAllPostQuery } from "../../../features/post/postApi";
import CompanyLifeAddEditDialog from "./CompanyLifeAddEditDialog";
import { getImageUrl } from "@/utils/getImageUrl";

function ProjectListPrivate({ translations }) {
  const [isCompanyLifeDialogOpen, setIsCompanyLifeDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Add state for selected post
  const { data: apiResponse } = useAllPostQuery();

  const router = useRouter();

  // Extract posts data from API response
  const posts = apiResponse?.data || [];
  const meta = apiResponse?.meta || {};

  const handleAddPost = () => {
    setIsEditing(false);
    setSelectedPost(null); // Clear selected post when adding new
    setIsCompanyLifeDialogOpen(true);
  };

  const handleEditPost = (post) => {
    // Accept post parameter
    setIsEditing(true);
    setSelectedPost(post); // Set the selected post
    setIsCompanyLifeDialogOpen(true);
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const projects = [
    {
      id: 1,
      name: "CRMS Alignment",
      role: "Business Analyst",
    },
    {
      id: 2,
      name: "Datahub Creation",
      role: "Project Manager",
    },
    {
      id: 3,
      name: "Refining Data Models1",
      role: "Data Engineer",
    },
  ];

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto py-6 my-6 px-4">
        <div className="space-y-4 w-full max-w-7xl mx-auto py-6">
          <h1 className="h2-gradient-text text-2xl font-bold text-justify">
            {translations.ongoingTenders}
          </h1>
          {projects.map((project) => (
            <div key={project.id} className=" flex justify-between">
              <div className="space-y-1">
                {" "}
                <h1 className="text-lg font-bold">
                  {translations.project} {project.id}: {project.name}
                </h1>
                <p>
                  {translations.role}: {project.role}
                </p>
              </div>
              <Button className="button-gradient">
                {translations.viewTender}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto py-6 my-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-between items-center">
          <h1 className="h2-gradient-text text-2xl font-bold text-justify">
            {translations.companyLife}
          </h1>
          <div className="flex gap-2">
            <Button
              className="bg-transparent shadow-none h2-gradient-text"
              onClick={handleAddPost}
            >
              {translations.addNewPost}{" "}
              <LucideCirclePlus className="text-blue-500" />
            </Button>
            {/* Remove the general edit button or keep it for bulk edit if needed */}
            {/* <Button
              className="bg-transparent shadow-none h2-gradient-text"
              onClick={() => handleEditPost(posts[0])} // Example: edit first post
            >
              {translations.editPost} <FiEdit className="text-blue-500" />
            </Button> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.length > 0
            ? posts.map((post) => (
                <ServiceCard
                  key={post._id}
                  post={post}
                  translations={translations}
                  formatDate={formatDate}
                  getImageUrl={getImageUrl}
                  onEdit={() => handleEditPost(post)} // Pass edit handler
                />
              ))
            : // Show empty state or loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <ServiceCard
                  key={index}
                  translations={translations}
                  isLoading={true}
                />
              ))}
        </div>
      </div>

      {/* Company Life Dialog */}
      <CompanyLifeAddEditDialog
        isOpen={isCompanyLifeDialogOpen}
        onClose={() => setIsCompanyLifeDialogOpen(false)}
        isEditing={isEditing}
        selectedPost={selectedPost} // Pass the selected post
      />
    </>
  );
}

export default ProjectListPrivate;

function ServiceCard({
  post,
  translations,
  formatDate,
  isLoading = false,
  onEdit,
}) {
  const router = useRouter();
  if (isLoading) {
    return (
      <Card className="max-w-sm border-none animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="w-full h-48 bg-gray-300 rounded"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-full"></div>
          </div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </CardContent>
        <CardFooter>
          <div className="h-10 bg-gray-300 rounded w-24"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Image
          src={getImageUrl(post.image)}
          alt={post.description || "Post image"}
          width={400}
          height={400}
          className="w-full h-48 object-cover rounded"
          onError={(e) => {
            e.target.src = "/services/card.png";
          }}
        />
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {formatDate(post.createdAt)}
        </p>

        <div>
          <h4 className="text-sm font-medium h2-gradient-text">
            {post.userId?.fullName || "Unknown User"}
          </h4>
          <p className="text-lg text-black font-semibold truncate">
            {post.description || translations.uxReviewPresentations}
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.description || translations.uiuxDescription}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <FiEdit className="text-blue-500" />
          Edit
        </Button>
        <Button
          onClick={() => router.push(`postDetails/${post._id}`)}
          className="button-gradient"
        >
          {translations.viewPosts}
        </Button>
      </CardFooter>
    </Card>
  );
}
