"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetMyprofileQuery,
  useUpdateProfileInfoMutation,
} from "../../features/clientProfile/ClientProfile";
import SkillsDialogAddEdit from "./SkillsDialogAddEdit";


function SkillsSection() {
  const isFreelancerAndLoggedIn = true;
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [currentSkillCategory, setCurrentSkillCategory] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const { data, isLoading } = useGetMyprofileQuery();
  const [updateSkills, { isLoading: updatingLoading }] =
    useUpdateProfileInfoMutation();


  // Get skills data from API response
  const apiSkills = data?.data?.freelancerId?.skills || [];


  // Categorize skills based on their category from API
  const categorizeSkills = (skills) => {
    const categorized = {
      soft: [],
      technical: [],
      functional: [],
    };


    skills.forEach((skill) => {
      const category = skill.category?.toLowerCase();
      if (
        category.includes("soft") ||
        category.includes("communication") ||
        category.includes("team")
      ) {
        categorized.soft.push(skill);
      } else if (
        category.includes("technical") ||
        category.includes("programming") ||
        category.includes("development")
      ) {
        categorized.technical.push(skill);
      } else if (
        category.includes("functional") ||
        category.includes("project") ||
        category.includes("management")
      ) {
        categorized.functional.push(skill);
      } else {
        // Default to technical if no clear category
        categorized.technical.push(skill);
      }
    });


    return categorized;
  };


  const categorizedSkills = categorizeSkills(apiSkills);


  const handleAddSkill = (category) => {
    setCurrentSkillCategory(category);
    setEditingSkill(null);
    setIsSkillsDialogOpen(true);
  };


  const handleEditSkill = (skill) => {
    setCurrentSkillCategory(skill.category?.toLowerCase() || "technical");
    setEditingSkill(skill);
    setIsSkillsDialogOpen(true);
  };


  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await updateSkills({
          type: "skill",
          operation: "delete",
          _id: skillId,
        }).unwrap();
        toast.success("Skill deleted successfully!");
      } catch (error) {
        console.error("Error deleting skill:", error);
        toast.error("Failed to delete skill. Please try again.");
      }
    }
  };


  if (isLoading) {
    return (
      <div className="w-full py-6">
        <h2 className="text-xl font-bold mb-4 h2-gradient-text">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="max-h-auto">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-bold mb-4 h2-gradient-text">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Soft Skills */}
        <Card className="max-h-auto relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="h2-gradient-text font-medium text-base">
                Soft Skills
              </CardTitle>
              {isFreelancerAndLoggedIn && (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-full border border-blue-600 text-xs font-bold transition-colors"
                    onClick={() => handleAddSkill("soft")}
                    title="Add Soft Skill"
                  >
                    +
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categorizedSkills.soft.length > 0 ? (
                categorizedSkills.soft.map((skill, index) => (
                  <div key={skill._id || index} className="relative group">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-full pr-8"
                    >
                      {skill.skill}
                    </Badge>
                    {isFreelancerAndLoggedIn && (
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Edit3
                          className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() => handleEditSkill(skill)}
                          title="Edit skill"
                        />
                        <Trash2
                          className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800"
                          onClick={() => handleDeleteSkill(skill._id)}
                          title="Delete skill"
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No soft skills added</p>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Technical Skills */}
        <Card className="max-h-auto relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="h2-gradient-text font-medium text-base">
                Technical Skills
              </CardTitle>
              {isFreelancerAndLoggedIn && (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-full border border-blue-600 text-xs font-bold transition-colors"
                    onClick={() => handleAddSkill("technical")}
                    title="Add Technical Skill"
                  >
                    +
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categorizedSkills.technical.length > 0 ? (
                categorizedSkills.technical.map((skill, index) => (
                  <div key={skill._id || index} className="relative group">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-full pr-8"
                    >
                      {skill.skill}
                    </Badge>
                    {isFreelancerAndLoggedIn && (
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Edit3
                          className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() => handleEditSkill(skill)}
                          title="Edit skill"
                        ></Edit3>
                        <Trash2
                          className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800"
                          onClick={() => handleDeleteSkill(skill._id)}
                          title="Delete skill"
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No technical skills added
                </p>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Functional Skills */}
        <Card className="max-h-auto relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="h2-gradient-text font-medium text-base">
                Functional Skills
              </CardTitle>
              {isFreelancerAndLoggedIn && (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-full border border-blue-600 text-xs font-bold transition-colors"
                    onClick={() => handleAddSkill("functional")}
                    title="Add Functional Skill"
                  >
                    +
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categorizedSkills.functional.length > 0 ? (
                categorizedSkills.functional.map((skill, index) => (
                  <div key={skill._id || index} className="relative group">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-full pr-8"
                    >
                      {skill.skill}
                    </Badge>
                    {isFreelancerAndLoggedIn && (
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Edit3
                          className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() => handleEditSkill(skill)}
                          title="Edit skill"
                        />
                        <Trash2
                          className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800"
                          onClick={() => handleDeleteSkill(skill._id)}
                          title="Delete skill"
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No functional skills added
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Skills Dialog */}
      {isSkillsDialogOpen && (
        <SkillsDialogAddEdit
          isOpen={isSkillsDialogOpen}
          onClose={() => {
            setIsSkillsDialogOpen(false);
            setEditingSkill(null);
          }}
          skillCategory={currentSkillCategory}
          editingSkill={editingSkill}
          updateSkills={updateSkills}
        />
      )}
    </div>
  );
}


export default SkillsSection;



