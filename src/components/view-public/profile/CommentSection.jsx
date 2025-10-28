import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { useGetFreelancerPublicProfileQuery } from "@/features/clientProfile/ClientProfile";
import { useParams } from "next/navigation";

function CommentSection() {
  const [comment, setComment] = useState("");
  const params = useParams();
  const id = params.id;

  console.log("ProfileHeader - Params object:", params);
  console.log("ProfileHeader - Extracted ID:", id);

  const { data, isLoading, error } = useGetFreelancerPublicProfileQuery(id, {
    skip: !id, // Skip the query if no ID is available
  });

  // Load existing comment when component mounts
  useEffect(() => {
    if (data?.data?.freelancerId?.comments) {
      setComment(data.data.freelancerId.comments);
    }
  }, [data]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-blue-600 h2-gradient-text">
          Comment Section
        </h1>
      </div>

      <Card className=" shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="">
          <div
            className={`h-24 flex  text-gray-500 overflow-y-auto ${
              comment
                ? "items-start justify-start"
                : "items-center justify-center"
            }`}
          >
            {comment ? (
              <p className="text-sm leading-relaxed text-left">{comment}</p>
            ) : (
              <p className="text-sm text-gray-400 ">
                No comment added yet. Click edit to add a comment.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CommentSection;
