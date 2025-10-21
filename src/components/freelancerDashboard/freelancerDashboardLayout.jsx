"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppliedJobsTender from "./appliedJobsTender";
import {
  useGetAppliedJobsQuery,
  useGetAppliedTendersQuery,
} from "@/features/freelancer/freelancerApi";

function FreelancerDashboardLayout() {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [selectedCategory, setSelectedCategory] = useState("jobs");
  const [selectedTab, setSelectedTab] = useState("applied");
  const { data: appliedJobs } = useGetAppliedJobsQuery();
  const { data: appliedTenders } = useGetAppliedTendersQuery();
  // console.log(appliedJobs, appliedTenders);
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
          appliedJobs={appliedJobs}
          appliedTenders={appliedTenders}
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

const MainContent = ({
  selectedCategory,
  selectedTab,
  setSelectedTab,
  appliedJobs,
  appliedTenders,
}) => {
  // Get current data based on selected category
  const currentData =
    selectedCategory === "jobs" ? appliedJobs : appliedTenders;

  // Calculate counts for each status
  const getCounts = () => {
    if (!currentData?.data) return { applied: 0, shortlisted: 0, current: 0 };

    const data = currentData.data;
    return {
      applied: data.filter((item) => item.status === "pending").length,
      shortlisted: data.filter((item) => item.status === "shortlist").length,
      current: data.filter((item) => item.status === "accepted").length,
    };
  };

  const counts = getCounts();

  // If current tab is selected but has no data, switch to applied tab
  React.useEffect(() => {
    if (selectedTab === "current" && counts.current === 0) {
      setSelectedTab("applied");
    }
  }, [selectedTab, counts.current, setSelectedTab]);

  const getTabLabels = () => {
    if (selectedCategory === "jobs") {
      return {
        applied: `Applied Jobs (${counts.applied})`,
        shortlisted: `Shortlisted Jobs (${counts.shortlisted})`,
        current: `Current Jobs (${counts.current})`,
      };
    } else {
      return {
        applied: `Applied Tenders (${counts.applied})`,
        shortlisted: `Shortlisted Tenders (${counts.shortlisted})`,
        current: `Current Tenders (${counts.current})`,
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
              {counts.current > 0 && (
                <TabsTrigger value="current" className="button-gradient">
                  {tabLabels.current}
                </TabsTrigger>
              )}
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
            {counts.current > 0 && (
              <TabsContent value="current" className="mt-4">
                <AppliedJobsTender category={selectedCategory} type="current" />
              </TabsContent>
            )}
          </Tabs>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
