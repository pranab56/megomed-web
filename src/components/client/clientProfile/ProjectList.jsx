"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function ProjectList() {
  const projects = [
    {
      id: 1,
      name: "CRMS Alignment",
      role: "Business Analyst",
    },
    {
      id: 2,
      name: "Datahub Creation",
      role: "Project Manager",
    },
    {
      id: 3,
      name: "Refining Data Models1",
      role: "Data Engineer",
    },
  ];
  return (
    <>
      <div className="w-full bg-gray-100 mx-auto py-6 my-6 px-4">
        <div className="space-y-4 w-full max-w-7xl mx-auto py-6">
          <h1 className="h2-gradient-text text-2xl font-bold text-justify">
            Recent Projects
          </h1>
          {projects.map((project) => (
            <div key={project.id}>
              <h1 className="text-lg font-bold">
                Project {project.id}: {project.name}
              </h1>
              <p>Role: {project.role}</p>
            </div>
          ))}
          <Button className="button-gradient">Respond to Tender</Button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto py-6 my-6 px-4 md:px-6 2xl:px-0">
        <h1 className="h2-gradient-text text-2xl font-bold text-justify">
          Company Life
        </h1>
        <div className="max-w-7xl mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ServiceCard key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default ProjectList;

function ServiceCard() {
  const router = useRouter();
  const handleViewPost = () => {
    router.push("/job-details/1");
  };
  return (
    <Card className="max-w-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Image src="/services/card.png" alt="card" width={400} height={400} />
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">20 Jan 2022</p>

        <div>
          <h4 className="text-sm font-medium h2-gradient-text">
            UI/UX Designer
          </h4>
          <p className="text-lg text-black font-semibold ">
            UX review presentations
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          I will do ui ux design for saas, web app, dashboard in figma
        </p>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button className="button-gradient" onClick={handleViewPost}>
          View Post →
        </Button>
      </CardFooter>
    </Card>
  );
}
