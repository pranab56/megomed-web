"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  // useGetMyprofileQuery,
  useUpdateProfileInfoMutation,
} from "../../features/clientProfile/ClientProfile";
import ExperienceDialogAddEdit from "./ExperienceDialogAddEdit";

function ExperienceSection({ freelancerInfo }) {
  const isFreelancerAndLoggedIn = true;
  // const { data, isLoading } = useGetMyprofileQuery();
  const [updateExperience, { isLoading: updatingLoading }] =
    useUpdateProfileInfoMutation();

  const translations = useMemo(
    () => ({
      title: "Experience",
      addButton: "Add Experience",
      editButton: "Edit",
    }),
    []
  );

  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  // Get experience data from API response
  const apiExperiences = freelancerInfo?.experience || [];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Format duration for display
  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    if (startYear === endYear) {
      return `${startYear}`;
    }
    return `${startYear} - ${endDate ? endYear : "Present"}`;
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceDialogOpen(true);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setIsExperienceDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingExperience(null);
    setIsExperienceDialogOpen(false);
  };

  const handleDeleteExperience = async (experienceId) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await updateExperience({
          type: "experience",
          operation: "delete",
          _id: experienceId,
        }).unwrap();
        toast.success("Experience deleted successfully!");
      } catch (error) {
        console.error("Error deleting experience:", error);
        toast.error("Failed to delete experience. Please try again.");
      }
    }
  };

  // if (isLoading || updatingLoading) {
  //   return (
  //     <div className="w-full bg-gray-50 mb-10 px-4 md:px-6 2xl:px-0">
  //       <Card className="max-w-7xl mx-auto h-fit border-none shadow-none bg-transparent">
  //         <CardHeader className="pb-4 px-0">
  //           <div className="flex items-center justify-between">
  //             <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
  //             <div className="flex items-center gap-4">
  //               <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
  //               <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
  //             </div>
  //           </div>
  //         </CardHeader>
  //         <CardContent className="px-0">
  //           <div className="space-y-6">
  //             {[...Array(2)].map((_, index) => (
  //               <div key={index} className="flex gap-4">
  //                 <div className="flex flex-col items-center">
  //                   <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
  //                   {index < 1 && (
  //                     <div className="w-0.5 h-16 bg-gray-200 mt-2 animate-pulse"></div>
  //                   )}
  //                 </div>
  //                 <div className="flex-1 pb-6">
  //                   <div className="flex items-start justify-between mb-2">
  //                     <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
  //                     <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
  //                   </div>
  //                   <div className="space-y-2">
  //                     <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
  //                     <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
  //                     <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full bg-gray-50 mb-10 px-4 md:px-6 2xl:px-0">
      <Card className="max-w-7xl mx-auto h-fit border-none shadow-none bg-transparent">
        <CardHeader className="pb-4 px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg font-semibold text-blue-600">
                {translations.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-4">
              {isFreelancerAndLoggedIn && (
                <button
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={handleAddExperience}
                  aria-label="Add Experience"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>{translations.addButton}</span>
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {apiExperiences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-4">
                No experience records found
              </p>
              {isFreelancerAndLoggedIn && (
                <button
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mx-auto"
                  onClick={handleAddExperience}
                  aria-label="Add your first experience"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Add your first experience</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {apiExperiences.map((exp, index) => (
                <div
                  key={exp._id || index}
                  className="flex gap-4 group relative"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    {index < apiExperiences.length - 1 && (
                      <div className="w-0.5 h-16 bg-blue-600 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.project || "Project"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">
                          {formatDuration(exp.startDate, exp.endDate)}
                        </span>
                        {isFreelancerAndLoggedIn && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1 hover:bg-blue-50 rounded"
                              onClick={() => handleEditExperience(exp)}
                              aria-label="Edit experience"
                            >
                              <Edit3 className="w-3 h-3 text-blue-600" />
                            </button>
                            <button
                              className="p-1 hover:bg-red-50 rounded"
                              onClick={() => handleDeleteExperience(exp._id)}
                              aria-label="Delete experience"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {exp.companyName || "Company"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Period:</span>{" "}
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Description:</span>{" "}
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Dialog */}
      {isExperienceDialogOpen && (
        <ExperienceDialogAddEdit
          isOpen={isExperienceDialogOpen}
          onClose={handleDialogClose}
          experience={editingExperience}
          updateExperience={updateExperience}
        />
      )}
    </div>
  );
}

export default ExperienceSection;
