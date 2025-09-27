"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Search } from "lucide-react";
import dynamic from "next/dynamic";

// Define translations locally
const translations = {
  title: "Ongoing Projects",
  subtitle: "Stay on top of your work and ensure smooth collaboration until project completion!",
  search: "Search",
  filter: {
    all: "All Projects",
    inProgress: "In Progress",
    completed: "Completed",
    pending: "Pending",
  },
  projectDetails: {
    client: "Client",
    deadline: "Deadline",
    amount: "Amount",
    status: "Status",
    viewDetails: "View Details",
  },
  statuses: {
    inProgress: "In Progress",
    completed: "Completed",
  },
};

const projects = [
  {
    id: 1,
    title: "Project 1: CRM System",
    client: "XYZ Corp",
    deadline: "05/2023",
    amount: "$500",
    status: translations.statuses.inProgress,
    statusColor: "bg-blue-600",
  },
  {
    id: 2,
    title: "Project 1: CRM System",
    client: "XYZ Corp",
    deadline: "05/2023",
    amount: "$500",
    status: translations.statuses.completed,
    statusColor: "bg-blue-600",
  },
];

// Main component content
const OngoingProjectsContent = () => {
  return (
    <div className="w-full bg-white py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 2xl:px-0">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold h2-gradient-text mb-2 leading-relaxed">
            {translations.title}
          </h1>
          <p className="text-gray-600">{translations.subtitle}</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full md:max-w-md ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={translations.search}
              className="pl-10 border-gray-300 w-full"
            />
          </div>

          <Select defaultValue="all-invoice">
            <SelectTrigger className="w-full md:w-48 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-invoice">
                {translations.filter.all}
              </SelectItem>
              <SelectItem value="in-progress">
                {translations.filter.inProgress}
              </SelectItem>
              <SelectItem value="completed">
                {translations.filter.completed}
              </SelectItem>
              <SelectItem value="pending">
                {translations.filter.pending}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  {/* Project Info */}
                  <div className="flex-1 ">
                    <h3 className="text-xl font-semibold h2-gradient-text mb-3">
                      {project.title}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">
                          {translations.projectDetails.client}:
                        </span>{" "}
                        {project.client}
                      </p>
                      <p>
                        <span className="font-medium">
                          {translations.projectDetails.deadline}:
                        </span>{" "}
                        {project.deadline}
                      </p>
                      <p>
                        <span className="font-medium">
                          {translations.projectDetails.amount}:
                        </span>{" "}
                        {project.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 ">
                    <Badge
                      className={`${project.statusColor} text-white hover:${project.statusColor} h-9 px-4 py-1 gradient`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-4 ">
                    <Button className="button-gradient">
                      <FileText className="w-4 h-4 mr-2" />
                      {translations.projectDetails.viewDetails}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dynamic import with no SSR (simplified)
const OngoingProjectsDynamic = dynamic(
  () => Promise.resolve(OngoingProjectsContent),
  { ssr: false }
);

function OngoingProjects() {
  return <OngoingProjectsDynamic />;
}

export default OngoingProjects;