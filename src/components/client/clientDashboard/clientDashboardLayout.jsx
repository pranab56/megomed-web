"use client";
import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientAppliedJobsTender from "./clientAppliedJobsTender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClientDashboardQuery } from "@/features/clientDashboard/clientDashboardApi";

function ClientDashboardLayout() {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [selectedCategory, setSelectedCategory] = useState("jobs");
  const [selectedTab, setSelectedTab] = useState("applied");
  const {
    data: clientDashboard,
    isLoading,
    error,
  } = useGetClientDashboardQuery();

  // Organize dashboard data by category and status
  const organizedData = React.useMemo(() => {
    if (!clientDashboard?.data) return { jobs: {}, tenders: {} };

    const result = {
      jobs: {
        applied: [],
        shortlisted: [],
        accepted: [],
        rejected: [],
      },
      tenders: {
        applied: [],
        shortlisted: [],
        accepted: [],
        rejected: [],
      },
    };

    // Sort applications by category and status
    clientDashboard.data.forEach((item) => {
      // Check if it's a job or tender based on jobId or tenderId
      const category = item.jobId ? "jobs" : "tenders";

      // Map status to the correct tab
      let status = "applied";
      if (item.status === "shortlist") status = "shortlisted";
      else if (item.status === "accepted") status = "accepted";
      else if (item.status === "rejected") status = "rejected";

      // Add to the right category and status bucket
      result[category][status].push(item);
    });

    return result;
  }, [clientDashboard?.data]);
  if (userType !== "client") {
    return <div>You are not authorized to access this page</div>;
  }
  return (
    <div className="max-w-7xl mx-auto py-6 ">
      <div className="animate-fade-in-up flex flex-col gap-y-6 md:flex-row gap-x-6 mx-4 md:mx-0">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <MainContent
          selectedCategory={selectedCategory}
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

export default ClientDashboardLayout;

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="w-full md:w-1/4 ">
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
  isLoading,
  error,
  data,
}) => {
  const getTabLabels = () => {
    if (selectedCategory === "jobs") {
      return {
        applied: `Job Proposals (${data?.jobs?.applied?.length})`,
        shortlisted: `Shortlisted Proposals (${data?.jobs?.shortlisted?.length})`,
        accepted: `Accepted Proposals (${data?.jobs?.accepted?.length})`,
        rejected: `Rejected Proposals (${data?.jobs?.rejected?.length})`,
      };
    } else {
      return {
        applied: `Tender Proposals (${data.tenders.applied.length})`,
        shortlisted: `Shortlisted Proposals (${data.tenders.shortlisted.length})`,
        accepted: `Accepted Proposals (${data.tenders.accepted.length})`,
        rejected: `Rejected Proposals (${data.tenders.rejected.length})`,
      };
    }
  };

  const tabLabels = getTabLabels();

  if (isLoading) {
    return (
      <Card className="w-full md:w-3/4">
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
    <Card className="w-full md:w-3/4">
      <CardHeader>
        <CardTitle>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="applied">{tabLabels.applied}</TabsTrigger>
              <TabsTrigger value="shortlisted">
                {tabLabels.shortlisted}
              </TabsTrigger>
              <TabsTrigger value="accepted">{tabLabels.accepted}</TabsTrigger>
              <TabsTrigger value="rejected">{tabLabels.rejected}</TabsTrigger>
            </TabsList>
            <TabsContent value="applied" className="mt-4">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="applied"
                items={
                  selectedCategory === "jobs"
                    ? data.jobs.applied
                    : data.tenders.applied
                }
              />
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-5">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="shortlisted"
                items={
                  selectedCategory === "jobs"
                    ? data.jobs.shortlisted
                    : data.tenders.shortlisted
                }
              />
            </TabsContent>
            <TabsContent value="accepted" className="mt-5">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="accepted"
                items={
                  selectedCategory === "jobs"
                    ? data.jobs.accepted
                    : data.tenders.accepted
                }
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-5">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="rejected"
                items={
                  selectedCategory === "jobs"
                    ? data.jobs.rejected
                    : data.tenders.rejected
                }
              />
            </TabsContent>
          </Tabs>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
