"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  useMySubcriptionQuery,
  useSubcriptionReneiewMutation,
} from "../../features/subcription/subcriptionApi";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

// Helper function to check if end date is expired
const isEndDateExpired = (endDate) => {
  if (!endDate) return true;
  const currentDate = new Date();
  const subscriptionEndDate = new Date(endDate);
  return subscriptionEndDate < currentDate;
};

// Helper function to check if end date is greater than or equal to current date
const isEndDateRunning = (endDate) => {
  if (!endDate) return false;
  const currentDate = new Date();
  const subscriptionEndDate = new Date(endDate);
  return subscriptionEndDate >= currentDate;
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Dynamic import with no SSR to prevent hydration errors
const SubscriptionPlanContent = dynamic(
  () =>
    Promise.resolve(({ userType, messages }) => {
      const subscriptionPlanTranslations = messages?.subscriptionPlan || {};

      const { data, isLoading, isError, refetch } = useMySubcriptionQuery();
      const [subcriptionRenew, { isLoading: renewLoading }] =
        useSubcriptionReneiewMutation();
      const [renewingSubscriptionId, setRenewingSubscriptionId] =
        useState(null);
      const [errorMessage, setErrorMessage] = useState("");

      // Format API data into subscription plans
      const formatSubscriptionPlans = () => {
        if (!data?.data) return [];

        return data.data.map((subscription, index) => {
          const expired = isEndDateExpired(subscription.endDate);
          const running = isEndDateRunning(subscription.endDate);

          return {
            id: subscription._id,
            title: subscription.title,
            type: subscription.type,
            price: subscription.price,
            tenderCount: subscription.tenderCount,
            takeTenderCount: subscription.takeTenderCount,
            status: subscription.status,
            endDate: subscription.endDate,
            benefits: subscription.packageId?.benefits || [],
            category: subscription.packageId?.category,
            isRunning: running,
            isExpired: expired,
            isBadge: subscription.packageId?.isBadge || false,
            isSupport: subscription.packageId?.isSupport || false,
            jobCount: subscription.jobCount || 0,
            takeJobCount: subscription.takeJobCount || 0,
            createdAt: subscription.createdAt,
          };
        });
      };

      // Handle subscription renewal
      const handleRenewSubscription = async (subscriptionId) => {
        try {
          setErrorMessage("");
          setRenewingSubscriptionId(subscriptionId);

          // Check if token exists
          const token = localStorage.getItem("loginToken");
          if (!token) {
            setErrorMessage("Please log in to renew your subscription");
            return;
          }

          const result = await subcriptionRenew(subscriptionId).unwrap();
          console.log("Renewal result:", result);

          // If the API returns a payment URL, redirect to it
          if (result?.data?.url) {
            window.location.href = result.data.url;
          } else if (result?.data?.url) {
            window.location.href = result.data.url;
          } else if (result?.url) {
            window.location.href = result.url;
          } else {
            // If no redirect URL, refetch the subscription data
            await refetch();
            setErrorMessage("Renewal initiated successfully!");
          }
        } catch (error) {
          console.error("Error renewing subscription:", error);

          // Handle specific error cases
          if (error?.status === 401) {
            setErrorMessage("Your session has expired. Please log in again.");
          } else if (error?.data?.message) {
            setErrorMessage(error.data.message);
          } else {
            setErrorMessage("Failed to renew subscription. Please try again.");
          }
        } finally {
          setRenewingSubscriptionId(null);
        }
      };

      // Get button text based on subscription status
      const getButtonText = (plan) => {
        if (plan.isRunning) {
          return subscriptionPlanTranslations.status?.running || "Running";
        } else if (plan.isExpired) {
          return subscriptionPlanTranslations.status?.upgrade || "Upgrade";
        } else {
          return subscriptionPlanTranslations.status?.inactive || "Inactive";
        }
      };

      // Get button variant based on subscription status
      const getButtonVariant = (plan) => {
        if (plan.isRunning) {
          return "default";
        } else if (plan.isExpired) {
          return "destructive";
        } else {
          return "outline";
        }
      };

      // Check if button should be disabled
      const isButtonDisabled = (plan) => {
        return (
          (renewLoading && renewingSubscriptionId === plan.id) || plan.isRunning
        );
      };

      // Check if button should show loading state
      const isLoadingState = (plan) => {
        return renewLoading && renewingSubscriptionId === plan.id;
      };

      const subscriptionPlans = formatSubscriptionPlans();

      if (isLoading) {
        return (
          <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center">Loading subscription plans...</div>
            </div>
          </div>
        );
      }

      if (isError) {
        return (
          <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center text-red-500">
                Error loading subscription plans
              </div>
              <Button
                onClick={() => refetch()}
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0 ">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Error Message */}
            {errorMessage && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  errorMessage.includes("successfully")
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {errorMessage.includes("successfully") ? (
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="animate-fade-in-up">
              {/* Header Section */}
              <div className="text-center mb-12">
                <Badge className="mb-6 px-4 py-2 text-sm font-medium rounded-full gradient">
                  {subscriptionPlanTranslations.badge || "Pricing plans"}
                </Badge>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {subscriptionPlanTranslations.title ||
                    "Your Subscription Plans"}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {subscriptionPlanTranslations.description ||
                    "Manage your current subscription plans and their features."}
                </p>
              </div>

              {/* Plans Grid */}
              {subscriptionPlans.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No subscription plans found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {subscriptionPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className="h-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white py-0"
                    >
                      <div className="p-6 h-full flex flex-col">
                        {/* Plan Icon and Title */}
                        <div className="text-center mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {plan.category === "freelancher" ? "F" : "C"}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-600 mb-2">
                            {plan.title}
                          </h3>
                          <div className="flex justify-center gap-2">
                            <Badge
                              variant={
                                plan.isRunning
                                  ? "default"
                                  : plan.isExpired
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {plan.isRunning
                                ? "Running"
                                : plan.isExpired
                                ? "Expired"
                                : plan.status}
                            </Badge>
                            {plan.isBadge && (
                              <Badge variant="outline">Badge</Badge>
                            )}
                            {plan.isSupport && (
                              <Badge variant="outline">Support</Badge>
                            )}
                          </div>
                        </div>

                        {/* Price and Type */}
                        <div className="mb-6 text-center">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-gray-900">
                              ${plan.price}
                            </span>
                            <span className="text-lg text-gray-600 ml-1">
                              /{plan.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Tenders: {plan.takeTenderCount || 0}/
                            {plan.tenderCount}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Jobs: {plan.takeJobCount || 0}/{plan.jobCount}
                          </p>
                        </div>

                        {/* Benefits/Features */}
                        <div className="flex-1 space-y-3 mb-6">
                          <h4 className="font-medium text-gray-900">
                            Benefits:
                          </h4>
                          {plan.benefits.length > 0 ? (
                            plan.benefits.map((benefit, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span className="text-green-500 mt-0.5 flex-shrink-0">
                                  ✓
                                </span>
                                <span className="text-sm text-gray-700 leading-relaxed">
                                  {benefit}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No benefits listed
                            </p>
                          )}
                        </div>

                        {/* Additional Info */}
                        <div className="mb-6 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium capitalize">
                              {plan.category}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">End Date:</span>
                            <span
                              className={`font-medium ${
                                plan.isExpired ? "text-red-600" : ""
                              }`}
                            >
                              {formatDate(plan.endDate)}
                              {plan.isExpired && " (Expired)"}
                            </span>
                          </div>
                        </div>

                        {/* Button */}
                        <Button
                          className="w-full font-medium button-gradient"
                          variant={getButtonVariant(plan)}
                          onClick={() => {
                            if (plan.isExpired) {
                              handleRenewSubscription(plan.id);
                            }
                          }}
                          disabled={isButtonDisabled(plan)}
                        >
                          {isLoadingState(plan) ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            getButtonText(plan)
                          )}
                        </Button>

                        {/* Status Message */}
                        {plan.isExpired && (
                          <p className="text-xs text-red-600 mt-2 text-center">
                            Your subscription has expired. Click "Upgrade" to
                            renew and continue.
                          </p>
                        )}
                        {plan.isRunning && (
                          <p className="text-xs text-green-600 mt-2 text-center">
                            Your subscription is currently active and running.
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }),
  { ssr: false }
);

function SubscriptionPlan({ userType = "freelancer", messages = "EN" }) {
  return <SubscriptionPlanContent userType={userType} messages={messages} />;
}

export default SubscriptionPlan;
