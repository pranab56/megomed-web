import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  // useGetMyprofileQuery,
  useUpdateProfileInfoMutation,
} from "../../features/clientProfile/ClientProfile";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";

import { Edit3, Save } from "lucide-react";

function CommentSection({ freelancerInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");

  // const { data } = useGetMyprofileQuery();
  const [updateMyprofile, { isLoading: isUpdating }] =
    useUpdateProfileInfoMutation();

  // Load existing comment when component mounts
  useEffect(() => {
    if (freelancerInfo?.comments) {
      setComment(freelancerInfo.comments);
    }
  }, [freelancerInfo]);

  const handleSave = async () => {
    try {
      const updateData = {
        type: "comments",
        operation: "update",
        comments: comment,
      };

      await updateMyprofile(updateData).unwrap();
      toast.success("Comment updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment. Please try again.");
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-blue-600 h2-gradient-text">
          Comment Section
        </h1>

        {isEditing ? (
          <Save
            className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-700"
            onClick={handleSave}
            disabled={isUpdating}
          />
        ) : (
          <Edit3
            className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-700"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border-blue-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 h-20 resize-none w-full shadow-sm"
          placeholder="Write your comment here..."
          autoFocus
        />
      ) : (
        <Card className=" shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="">
            <div
              className={`h-20 flex  text-gray-500 overflow-y-auto ${
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
      )}
    </div>
  );
}

export default CommentSection;
