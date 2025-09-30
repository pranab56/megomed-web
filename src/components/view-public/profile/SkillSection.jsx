"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFreelancerPublicProfileQuery } from "@/features/clientProfile/ClientProfile";
import { useParams } from "next/navigation";

function SkillsSection() {
  const params = useParams();
  const id = params.id;

  console.log("ProfileHeader - Params object:", params);
  console.log("ProfileHeader - Extracted ID:", id);

  const { data, isLoading, error } = useGetFreelancerPublicProfileQuery(id, {
    skip: !id, // Skip the query if no ID is available
  });

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading freelancer profile: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const apiSkills = data?.data?.freelancerId?.skills || [];

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
        categorized.technical.push(skill);
      }
    });

    return categorized;
  };

  const categorizedSkills = categorizeSkills(apiSkills);

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

  if (!id) {
    return (
      <div className="w-full">
        <div className="text-center py-8">
          <p className="text-gray-500">No freelancer ID provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-bold mb-4 h2-gradient-text">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="max-h-auto relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="h2-gradient-text font-medium text-base">
                Soft Skills
              </CardTitle>
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
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No soft skills added</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="max-h-auto relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="h2-gradient-text font-medium text-base">
                Technical Skills
              </CardTitle>
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
    </div>
  );
}

export default SkillsSection;
