"use client";
import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientAppliedJobsTender from "./clientAppliedJobsTender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ClientDashboardLayout() {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [selectedCategory, setSelectedCategory] = useState("jobs");
  const [selectedTab, setSelectedTab] = useState("applied");

  //   if (userType !== "client") {
  //     return <div>You are not authorized to access this page</div>;
  //   }
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

const MainContent = ({ selectedCategory, selectedTab, setSelectedTab }) => {
  const getTabLabels = () => {
    if (selectedCategory === "jobs") {
      return {
        applied: "Job Proposals",
        shortlisted: "Shortlisted Proposals",
        accepted: "Accepted Proposals",
        rejected: "Rejected Proposals",
      };
    } else {
      return {
        applied: "Tender Proposals",
        shortlisted: "Shortlisted Proposals",
        accepted: "Accepted Proposals",
        rejected: "Rejected Proposals",
      };
    }
  };

  const tabLabels = getTabLabels();

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
              />
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-5">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="shortlisted"
              />
            </TabsContent>
            <TabsContent value="accepted" className="mt-5">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="accepted"
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-5">
              <ClientAppliedJobsTender
                category={selectedCategory}
                type="rejected"
              />
            </TabsContent>
          </Tabs>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
