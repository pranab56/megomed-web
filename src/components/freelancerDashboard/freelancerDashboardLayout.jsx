"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppliedJobsTender from "./appliedJobsTender";
import {
  useAllFollowPendingQuery,
  useAllFollowAcceptedQuery,
  useGetAppliedJobsQuery,
  useGetAppliedTendersQuery,
  useFollowBackMutation,
} from "@/features/freelancer/freelancerApi";
import toast from "react-hot-toast";

function FreelancerDashboardLayout() {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [selectedCategory, setSelectedCategory] = useState("jobs");
  const [selectedTab, setSelectedTab] = useState("applied");
  const { data: appliedJobs } = useGetAppliedJobsQuery();
  const { data: appliedTenders } = useGetAppliedTendersQuery();

  const { data: allFollowPending } = useAllFollowPendingQuery();
  const { data: allFollowAccepted } = useAllFollowAcceptedQuery();
  console.log("allFollowPending //////////////////////////", allFollowPending);
  console.log(
    "allFollowAccepted //////////////////////////",
    allFollowAccepted
  );
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
          allFollowPending={allFollowPending}
          allFollowAccepted={allFollowAccepted}
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
            <li
              className={`text-lg font-medium cursor-pointer rounded-lg p-1 hover:ml-1 transition-all ${
                selectedCategory === "follows"
                  ? "gradient bg-primary/10 border-l-4 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSelectedCategory("follows")}
            >
              Follows
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
  allFollowPending,
  allFollowAccepted,
}) => {
  // Handle follows category differently
  if (selectedCategory === "follows") {
    // Set default tab to follow-requests only if no valid tab is selected
    const validFollowTabs = ["follow-requests", "followers"];
    if (!validFollowTabs.includes(selectedTab)) {
      setSelectedTab("follow-requests");
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="follow-requests">
                  Follow Requests
                </TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
              </TabsList>
              <TabsContent value="follow-requests" className="mt-4">
                <FollowRequestsContent followRequests={allFollowPending} />
              </TabsContent>
              <TabsContent value="followers" className="mt-4">
                <FollowersContent followers={allFollowAccepted} />
              </TabsContent>
            </Tabs>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

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

// Follow Requests Content Component
const FollowRequestsContent = ({ followRequests }) => {
  // Get follow requests data from API
  const requests = followRequests?.data || [];

  const [followBack, { isLoading: isFollowing }] = useFollowBackMutation();
  const handleAccept = async (id) => {
    console.log("Follow back:", id);
    try {
      const response = await followBack(id).unwrap();
      toast.success(response?.data?.message || "Follow back successfully!");
    } catch (error) {
      console.error("Failed to follow back:", error);
      toast.error("Failed to follow back. Please try again.");
    }
  };

  const handleReject = (id) => {
    console.log("Reject follow request:", id);
    // Add API call to reject follow request
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No follow requests at the moment</p>
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {request.followerUserId?.slice(-2) || "U"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  User ID: {request.followerUserId?.slice(0, 3)}...
                  {request.followerUserId?.slice(-3)}
                </h3>
                <p className="text-sm text-gray-600">
                  Status: {request.status}
                </p>
                <p className="text-xs text-gray-500">
                  Requested {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAccept(request._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Follow Back
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Followers Content Component
const FollowersContent = ({ followers }) => {
  // Get followers data from API
  const followersList = followers?.data || [];

  const handleUnfollow = (id) => {
    console.log("Unfollow user:", id);
    // Add API call to unfollow user
  };

  return (
    <div className="space-y-4">
      {followersList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No followers yet</p>
        </div>
      ) : (
        followersList.map((follower) => (
          <div
            key={follower._id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {follower.followerUserId?.slice(-2) || "U"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  User ID: {follower.followerUserId?.slice(0, 3)}...
                  {follower.followerUserId?.slice(-3)}
                </h3>
                <p className="text-sm text-gray-600">
                  Status: {follower.status}
                </p>
                <p className="text-xs text-gray-500">
                  Following since{" "}
                  {new Date(follower.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  window.open(
                    `/profile/view-public/${follower.followerUserId}`,
                    "_blank"
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => handleUnfollow(follower._id)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Unfollow
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
