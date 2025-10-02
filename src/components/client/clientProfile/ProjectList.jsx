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
import { getImageUrl } from "@/utils/getImageUrl";
import {
  useGetAllTenderByClientPublicQuery,
  useGetAllPostByClientPublicQuery,
} from "@/features/tender/tenderApi";
import { useParams } from "next/navigation";
function ProjectListPrivate({ translations }) {
  const params = useParams();
  const id = params.id;
  const [isCompanyLifeDialogOpen, setIsCompanyLifeDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Add state for selected post
  const { data: tenderResponse, isLoading: tenderLoading } =
    useGetAllTenderByClientPublicQuery({ id: id }, { skip: !id });
  const router = useRouter();

  const { data: postResponse, isLoading: postLoading } =
    useGetAllPostByClientPublicQuery({ id: id }, { skip: !id });
  // Extract posts data from API response
  const posts = postResponse?.data || [];
  const meta = postResponse?.meta || {};

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

  // Extract tender data from API response
  const tenders = tenderResponse?.data || [];

  // Debug logging
  console.log("🔍 ProjectListPrivate Debug:");
  console.log("tenderResponse:", tenderResponse);
  console.log("tenderLoading:", tenderLoading);
  console.log("tenders:", tenders);
  console.log("tenders.length:", tenders.length);

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto py-6 my-6 px-4">
        <div className="space-y-4 w-full max-w-7xl mx-auto py-6">
          <h1 className="h2-gradient-text text-2xl font-bold text-justify">
            Ongoing Tenders
          </h1>
          {tenderLoading ? (
            // Loading state
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : tenders.length > 0 ? (
            tenders.map((tender) => (
              <div key={tender._id} className="flex justify-between">
                <div className="space-y-1">
                  <h1 className="text-lg font-bold">{tender.title}</h1>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span>{" "}
                    {tender.categoryName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Service Type:</span>{" "}
                    {tender.serviceTypeName}
                  </p>
                </div>
                <Button
                  className="button-gradient"
                  onClick={() => router.push(`/tenders-details/${tender._id}`)}
                >
                  View Tender
                </Button>
              </div>
            ))
          ) : (
            // Empty state with debug info
            <div className="text-center py-8">
              <p className="text-gray-500">No tenders found</p>
              <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs">
                <p>
                  <strong>Debug Info:</strong>
                </p>
                <p>Loading: {tenderLoading ? "true" : "false"}</p>
                <p>Response: {JSON.stringify(tenderResponse, null, 2)}</p>
                <p>Tenders: {JSON.stringify(tenders, null, 2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto py-6 my-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-between items-center">
          <h1 className="h2-gradient-text text-2xl font-bold text-justify">
            Company Life
          </h1>
          <div className="flex gap-2">
            <Button
              className="bg-transparent shadow-none h2-gradient-text"
              onClick={handleAddPost}
            >
              Add New Post <LucideCirclePlus className="text-blue-500" />
            </Button>
            {/* Remove the general edit button or keep it for bulk edit if needed */}
            {/* <Button
              className="bg-transparent shadow-none h2-gradient-text"
              onClick={() => handleEditPost(posts[0])} // Example: edit first post
            >
              Edit Post <FiEdit className="text-blue-500" />
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
          View Post
        </Button>
      </CardFooter>
    </Card>
  );
}
