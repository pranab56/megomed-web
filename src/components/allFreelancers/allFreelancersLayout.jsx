"use client";
import React, { useState, useEffect } from "react";
import { Search, Briefcase, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useAllFreelancersQuery } from "@/features/freelancer/freelancerApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { useRouter } from "next/navigation";
const FreelancerCards = () => {
  const [particles, setParticles] = useState([]);
  const { data, isLoading, isError, refetch } = useAllFreelancersQuery();
  const router = useRouter();
  console.log(data);
  // Get current user ID with proper parsing
  let currentUserID;
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      // Try to parse as JSON first
      try {
        const parsedUser = JSON.parse(userData);
        currentUserID = parsedUser._id || parsedUser;
      } catch (e) {
        // If not JSON, use as string
        currentUserID = userData;
      }
    }
  } catch (error) {
    console.error("Error getting user ID:", error);
  }

  console.log("Raw user data from localStorage:", localStorage.getItem("user"));
  console.log("Parsed currentUserID:", currentUserID);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  // Get freelancers data from API or fallback to empty array, excluding current user
  const allFreelancers = data?.data || [];
  const freelancers = allFreelancers.filter(
    (freelancer) => freelancer._id !== currentUserID
  );

  // Debug logging
  console.log("All freelancers count:", allFreelancers.length);
  console.log("Filtered freelancers count:", freelancers.length);
  console.log("Current user ID:", currentUserID);
  console.log(
    "All freelancer IDs:",
    allFreelancers.map((f) => f._id)
  );
  console.log(
    "Filtered freelancer IDs:",
    freelancers.map((f) => f._id)
  );

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, rgba(56, 189, 248, 0.9), rgba(59, 130, 246, 0.8))`,
              animation: `smoothFloat ${particle.duration}s infinite ease-in-out ${particle.delay}s`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes smoothFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(30px, -40px) scale(1.2);
            opacity: 0.5;
          }
          66% {
            transform: translate(-20px, -80px) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-full md:max-w-7xl  mx-auto px-4 sm:px-6 2xl:px-0 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Freelancers
          </h1>
          <p className="text-gray-600">
            Discover talented professionals ready to bring your projects to life
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search freelancers by name, skill, or category..."
            className="pl-12 py-6 bg-white/80 backdrop-blur-sm border-gray-200"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-gray-600">Loading freelancers...</div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-red-600">
              Error loading freelancers. Please try again.
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && freelancers.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-gray-600">No freelancers found.</div>
          </div>
        )}

        {/* Freelancer Cards Grid */}
        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <Card
                key={freelancer._id}
                className="card-hover overflow-hidden bg-white/90 backdrop-blur-sm border-gray-200 p-0"
              >
                {/* Cover Photo */}
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={
                      freelancer.coverPhoto
                        ? getImageUrl(freelancer.coverPhoto)
                        : "/services/service_1.png"
                    }
                    width={400}
                    height={200}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile Photo - Overlapping Cover */}
                <div className="relative px-6 -mt-20 mb-2">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={
                        freelancer.profile
                          ? getImageUrl(freelancer.profile)
                          : "/client/profile/client.png"
                      }
                      alt={freelancer.fullName}
                    />
                    <AvatarFallback>
                      {freelancer.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <CardContent className="px-6 pb-6">
                  {/* Name and Designation */}
                  <div className="flex items-start justify-between">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {freelancer.fullName || "Unknown"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {freelancer.designation || "Freelancer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {freelancer.location && `📍 ${freelancer.location}`}
                      </p>
                    </div>
                    <Button className="button-gradient text-white">
                      Follow
                    </Button>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {freelancer.freelancerId?.skills
                        ?.slice(0, 4)
                        .map((skillObj, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-sky-50 text-sky-700 border-sky-200 text-xs"
                          >
                            {skillObj.skill}
                          </Badge>
                        ))}
                      {freelancer.freelancerId?.skills?.length > 4 && (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
                        >
                          +{freelancer.freelancerId.skills.length - 4} more
                        </Badge>
                      )}
                      {(!freelancer.freelancerId?.skills ||
                        freelancer.freelancerId.skills.length === 0) && (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
                        >
                          No skills listed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-x-2 text-gray-600">
                      <Briefcase size={18} className=" text-sky-500" />

                      <p className="text-xs text-gray-500">Completed Jobs</p>
                      <p className="text-sm font-semibold">
                        {freelancer.jobsDone || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-2 text-gray-900">
                      <p className="text-xs text-gray-500">Daily Rate</p>
                      <p className="text-sm font-bold">
                        ${freelancer.dailyRate || 0}/day
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mb-4 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>
                        Experience:{" "}
                        {freelancer.yearsOfExperience || "Not specified"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          freelancer.isVarified === "varified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {freelancer.isVarified === "varified"
                          ? "✓ Verified"
                          : "⏳ Pending"}
                      </span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button
                    className="w-full button-gradient text-white"
                    onClick={() =>
                      router.push(`/profile/view-public/${freelancer._id}`)
                    }
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerCards;
