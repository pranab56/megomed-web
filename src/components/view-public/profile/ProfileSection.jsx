"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";
import { Calendar, Eye, MessageCircle, UserPlus } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
function ProfileSections() {
  const router = useRouter();
  const { data, isLoading } = useGetMyprofileQuery();

  const educationCertifications =
    data?.data?.freelancerId?.educationCertifications || [];

  const formatDateRange = (startDate, endDate) => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return `${startYear} - ${endYear}`;
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="max-h-60">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-600 h2-gradient-text">
                Education & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-20 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="max-h-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col items-center">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>

          <Card className="max-h-60">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 flex flex-col items-center">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-full bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Education & Certifications */}
        <Card className="max-h-60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-600 h2-gradient-text">
              Education & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {educationCertifications.length > 0 ? (
                educationCertifications.map((item, index) => (
                  <Tooltip key={item._id || index}>
                    <TooltipTrigger>
                      <div className="relative group">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1 pr-8"
                        >
                          {item.degree}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{item.degree}</p>
                      <p>Institution: {item.institution}</p>
                      <p>
                        Duration:{" "}
                        {formatDateRange(item.startDate, item.endDate)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <div className="text-center w-full py-2">
                  <p className="text-gray-500 text-sm">
                    No education records found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="max-h-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex flex-col items-center">
            <p className="text-gray-600 text-sm leading-tight text-center">
              Discover my achievements and detailed case studies.
            </p>

            <Link href={`/showcase-projects`} className="w-full md:w-auto">
              <Button className="button-gradient w-full md:w-auto">
                <Eye className="w-4 h-4 mr-2" />
                View All Project
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="max-h-60">
          <CardHeader className="">
            <CardTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 flex flex-col items-center">
              <Button className="w-full md:w-40 button-gradient ">
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Link href="https://calendly.com/" target="_blank">
                <Button className="w-full md:w-40 button-gradient ">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
              <Button
                className="w-full md:w-40 button-gradient "
                onClick={() => router.push("/chat")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfileSections;
