"use client";
import { Button } from "@/components/ui/button";
import provideIcon from "@/utils/IconProvider/provideIcon";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { useGetClientPublicProfileQuery } from "@/features/clientProfile/ClientProfile";
import { getImageUrl } from "@/utils/getImageUrl";
import {
  useFollowFreelancerMutation,
  useIsFollowedQuery,
} from "@/features/hireFreelancer/hireFreelancerApi";
import toast from "react-hot-toast";
function ClientProfile() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading, error } = useGetClientPublicProfileQuery(id, {
    skip: !id, // Skip the query if no ID is available
  });

  const [followClient, { isLoading: isFollowing }] =
    useFollowFreelancerMutation();
  const { data: isFollowed, isLoading: isFollowedLoading } =
    useIsFollowedQuery(id);

  const followed = isFollowed?.data;

  const clientInfo = {
    name: data?.data?.fullName,
    companyName: data?.data?.companyName,
    profilePicture: getImageUrl(data?.data?.profile),
    bio: data?.data?.aboutCompany,
    location: data?.data?.location,
    email: data?.data?.email,
    phone: data?.data?.phone,
    isVerified: data?.data?.isVarified,
    role: data?.data?.role,
    designation: data?.data?.designation,
    yearsOfExperience: data?.data?.yearsOfExperience,
    dailyRate: data?.data?.dailyRate,
    jobsDone: data?.data?.jobsDone,
    followers: data?.data?.followers,
    isAvailable: data?.data?.isAvailable,
  };

  const handleFollow = async () => {
    try {
      const response = await followClient({
        followerUserId: id,
      }).unwrap();
      toast.success(response?.data || "Client followed successfully!");
    } catch (error) {
      console.error("Failed to follow client:", error);
      toast.error("Failed to follow client. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading client profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="flex gap-2 justify-center md:justify-end ">
        <Button className="button-gradient" onClick={handleFollow}>
          {provideIcon({ name: "user_plus" })}
          {followed === "true" ? "Unfollow" : "Follow"}{" "}
        </Button>
        <Button className="button-gradient">
          Share {provideIcon({ name: "user_user" })}
        </Button>
        <Button className="button-gradient">
          Consult Website {provideIcon({ name: "globe" })}
        </Button>
      </div>
      <div className="flex gap-10 items-start py-2">
        <Image
          src={clientInfo.profilePicture}
          alt="client-profile"
          width={150}
          height={150}
          className="rounded-full object-cover"
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{clientInfo.name}</h1>
            {clientInfo.isVerified && (
              <div className="flex items-center gap-1 text-green-600">
                <span>{provideIcon({ name: "verified" })}</span>
                <span className="text-sm">Verified</span>
              </div>
            )}
          </div>

          {clientInfo.companyName && (
            <p className="text-lg text-gray-600 font-medium">
              <span className="font-bold">Company Name:</span>{" "}
              {clientInfo.companyName}
            </p>
          )}

          <div className="space-y-1 text-sm">
            <span className="font-bold">Location:</span> {clientInfo.location}
          </div>
        </div>
      </div>

      {clientInfo.bio && (
        <div className="space-y-2">
          <h2 className="h2-gradient-text text-2xl font-bold text-justify">
            About The Company
          </h2>
          <p className="text-gray-700 leading-relaxed">{clientInfo.bio}</p>
        </div>
      )}
    </div>
  );
}

export default ClientProfile;
