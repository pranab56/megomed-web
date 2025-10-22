"use client";
import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyAppliedJobsTender from "./companyAppliedJobsTender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCompanyDashboardQuery } from "@/features/companyDashboard/companyDashboardApi";

function CompanyDashboardLayout() {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [selectedCategory, setSelectedCategory] = useState("jobs");
  const [selectedTab, setSelectedTab] = useState("applied");
  const {
    data: companyDashboard,
    isLoading,
    error,
  } = useGetCompanyDashboardQuery();

  // Organize dashboard data by status (only jobs for companies)
  const organizedData = React.useMemo(() => {
    if (!companyDashboard?.data) return { jobs: {} };

    const result = {
      jobs: {
        applied: [],
        shortlisted: [],
        accepted: [],
        rejected: [],
      },
    };

    // Sort applications by status (all are jobs for companies)
    companyDashboard.data.forEach((item) => {
      // Map status to the correct tab
      let status = "applied";
      if (item.status === "shortlist") status = "shortlisted";
      else if (item.status === "accepted") status = "accepted";
      else if (item.status === "rejected") status = "rejected";

      // Add to the jobs status bucket
      result.jobs[status].push(item);
    });

    return result;
  }, [companyDashboard?.data]);
  if (userType !== "company") {
    return <div>You are not authorized to access this page</div>;
  }
  return (
    <div className="max-w-7xl mx-auto py-6 ">
      <div className="animate-fade-in-up mx-4 md:mx-0">
        <MainContent
          selectedCategory="jobs"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isLoading={isLoading}
          error={error}
          data={organizedData}
        />
      </div>
    </div>
  );
}

export default CompanyDashboardLayout;

const MainContent = ({
  selectedCategory,
  selectedTab,
  setSelectedTab,
  isLoading,
  error,
  data,
}) => {
  const getTabLabels = () => {
    return {
      applied: `Job Proposals (${data?.jobs?.applied?.length || 0})`,
      shortlisted: `Shortlisted Proposals (${
        data?.jobs?.shortlisted?.length || 0
      })`,
      accepted: `Accepted Proposals (${data?.jobs?.accepted?.length || 0})`,
      rejected: `Rejected Proposals (${data?.jobs?.rejected?.length || 0})`,
    };
  };

  const tabLabels = getTabLabels();

  if (isLoading) {
    return (
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Loading dashboard data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full md:w-3/4">
        <CardHeader>
          <CardTitle className="text-red-500">
            Error loading dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            There was an error loading your dashboard. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="flex flex-col flex-wrap">
              <TabsTrigger value="applied">{tabLabels.applied}</TabsTrigger>
              <TabsTrigger value="shortlisted">
                {tabLabels.shortlisted}
              </TabsTrigger>
              <TabsTrigger value="accepted">{tabLabels.accepted}</TabsTrigger>
              <TabsTrigger value="rejected">{tabLabels.rejected}</TabsTrigger>
            </TabsList>
            <TabsContent value="applied" className="mt-4">
              <CompanyAppliedJobsTender
                category="jobs"
                type="applied"
                items={data.jobs.applied}
              />
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-5">
              <CompanyAppliedJobsTender
                category="jobs"
                type="shortlisted"
                items={data.jobs.shortlisted}
              />
            </TabsContent>
            <TabsContent value="accepted" className="mt-5">
              <CompanyAppliedJobsTender
                category="jobs"
                type="accepted"
                items={data.jobs.accepted}
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-5">
              <CompanyAppliedJobsTender
                category="jobs"
                type="rejected"
                items={data.jobs.rejected}
              />
            </TabsContent>
          </Tabs>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
