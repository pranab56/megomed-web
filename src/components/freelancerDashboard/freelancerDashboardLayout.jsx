"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppliedJobsTender from "./appliedJobsTender";
import { useGetAppliedJobsQuery } from "@/features/freelancer/freelancerApi";

function FreelancerDashboardLayout() {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [selectedCategory, setSelectedCategory] = useState("jobs");
  const [selectedTab, setSelectedTab] = useState("applied");
  const { data: appliedJobs } = useGetAppliedJobsQuery();
  console.log(appliedJobs);
  if (userType !== "freelancer") {
    return <div>You are not authorized to access this page</div>;
  }
  return (
    <div className="max-w-7xl mx-auto py-6 ">
      <div className="animate-fade-in-up flex gap-x-6">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <MainContent
          selectedCategory={selectedCategory}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </div>
  );
}

export default FreelancerDashboardLayout;

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="w-1/4 ">
      <Card>
        <CardContent>
          <ul className="space-y-3">
            <li
              className={`text-lg font-medium cursor-pointer rounded-lg p-1 hover:ml-1 transition-all ${
                selectedCategory === "jobs"
                  ? "gradient bg-primary/10 border-l-4 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSelectedCategory("jobs")}
            >
              Jobs
            </li>
            <li
              className={`text-lg font-medium cursor-pointer rounded-lg p-1 hover:ml-1 transition-all ${
                selectedCategory === "tenders"
                  ? "gradient bg-primary/10 border-l-4 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSelectedCategory("tenders")}
            >
              Tenders
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

const MainContent = ({ selectedCategory, selectedTab, setSelectedTab }) => {
  const getTabLabels = () => {
    if (selectedCategory === "jobs") {
      return {
        applied: "Applied Jobs",
        shortlisted: "Shortlisted Jobs",
      };
    } else {
      return {
        applied: "Applied Tenders",
        shortlisted: "Shortlisted Tenders",
      };
    }
  };

  const tabLabels = getTabLabels();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="applied">{tabLabels.applied}</TabsTrigger>
              <TabsTrigger value="shortlisted">
                {tabLabels.shortlisted}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="applied" className="mt-4">
              <AppliedJobsTender category={selectedCategory} type="applied" />
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-4">
              <AppliedJobsTender
                category={selectedCategory}
                type="shortlisted"
              />
            </TabsContent>
          </Tabs>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
