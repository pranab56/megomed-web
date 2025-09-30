"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  Edit3,
  Eye,
  MessageCircle,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import {
  useGetMyprofileQuery,
  useUpdateProfileInfoMutation,
} from "../../features/clientProfile/ClientProfile";
import AddNewProjectDialog from "./AddNewProjectDialog";
import EducationDialogAddEdit from "./EducationDialogAddEdit";
import { useRouter } from "next/navigation";
function ProfileSections() {
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddEducationDialogOpen, setIsAddEducationDialogOpen] =
    useState(false);
  const [editingEducation, setEditingEducation] = useState(null); // Track which education is being edited
  const router = useRouter();
  const { data, isLoading } = useGetMyprofileQuery();
  const [updateProfileInfo, { isLoading: isDeleting }] =
    useUpdateProfileInfoMutation();

  const isFreelancerAndLoggedIn = true;

  const educationCertifications =
    data?.data?.freelancerId?.educationCertifications || [];

  const formatDateRange = (startDate, endDate) => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return `${startYear} - ${endYear}`;
  };

  // Function to handle edit click
  const handleEditEducation = (education) => {
    setEditingEducation(education);
    setIsAddEducationDialogOpen(true);
  };

  // Function to handle dialog close
  const handleEducationDialogClose = () => {
    setEditingEducation(null);
    setIsAddEducationDialogOpen(false);
  };

  // Function to handle add new education
  const handleAddNewEducation = () => {
    setEditingEducation(null);
    setIsAddEducationDialogOpen(true);
  };

  // Function to handle delete education
  const handleDeleteEducation = async (educationId) => {
    try {
      const deleteData = {
        type: "education",
        operation: "delete",
        _id: educationId,
      };

      await updateProfileInfo(deleteData).unwrap();
      toast.success("Education deleted successfully!");
    } catch (error) {
      console.error("Failed to delete education:", error);
      toast.error("Failed to delete education. Please try again.");
    }
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
              {isFreelancerAndLoggedIn && (
                <>
                  <Plus
                    className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-700"
                    onClick={handleAddNewEducation}
                  />
                </>
              )}
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
                        {isFreelancerAndLoggedIn && (
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 items-center">
                            <Edit3
                              className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-700"
                              onClick={() => handleEditEducation(item)}
                            />
                            <Trash2
                              className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-700"
                              onClick={() => handleDeleteEducation(item._id)}
                            />
                          </div>
                        )}
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
                  {isFreelancerAndLoggedIn && (
                    <Button
                      variant="link"
                      className="text-blue-600 p-0 h-auto"
                      onClick={handleAddNewEducation}
                    >
                      Add your first education
                    </Button>
                  )}
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

            {isFreelancerAndLoggedIn && (
              <Button
                className="button-gradient w-full md:w-auto"
                onClick={() => setIsAddProjectDialogOpen(true)}
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add new project
              </Button>
            )}
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

      {/* Add New Project Dialog */}
      {isAddProjectDialogOpen && (
        <AddNewProjectDialog
          isOpen={isAddProjectDialogOpen}
          onClose={() => setIsAddProjectDialogOpen(false)}
        />
      )}

      {/* Add/Edit Education Dialog */}
      {isAddEducationDialogOpen && (
        <EducationDialogAddEdit
          isOpen={isAddEducationDialogOpen}
          onClose={handleEducationDialogClose}
          education={editingEducation} // Pass the education data to edit
          isEditing={!!editingEducation} // Indicate if we're editing or adding
        />
      )}
    </div>
  );
}

export default ProfileSections;
