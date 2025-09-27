// app/post/[id]/page.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSinglePostQuery } from '../../../features/post/postApi';

export default function PostDetails() {
  const params = useParams();
  const postId = params.id;

  const { data, isLoading, isError } = useSinglePostQuery(postId, { skip: !postId });

  console.log("post details ", data)





  // Handle API base URL (adjust based on your setup)
  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-image.jpg";
    return path.startsWith("http")
      ? path
      : `http://10.10.7.107:5006/${path.replace(/\\/g, "/")}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card className="border-0 shadow-none">
          <Skeleton className="w-full h-[400px] rounded-xl mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </Card>
      </div>
    );
  }



  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card className="p-8 text-center">
          <div className="text-gray-500">Post not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="border-0 shadow-none">
        {/* Post Image */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6">
          <Image
            src={getFullImageUrl(data?.data?.image)}
            alt={"Post image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Post Content */}
        <CardContent className="p-0 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={getFullImageUrl(data?.data?.userId.profile)}
                alt={data?.data?.userId?.fullName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{data?.data?.userId.fullName}</h3>
              <p className="text-sm text-gray-500">
                {new Date(data?.data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {data?.data?.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}