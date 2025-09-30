import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";

function CommentSection() {
  const [comment, setComment] = useState("");

  const { data } = useGetMyprofileQuery();

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
          CommentSection
        </h1>
      </div>

      <Card className=" shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="">
          <div
            className={`h-20 flex  text-gray-500 ${
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
