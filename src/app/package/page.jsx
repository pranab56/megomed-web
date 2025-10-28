"use client";
import dynamic from "next/dynamic";
import { useState } from "react"; // Import useState
import toast from "react-hot-toast";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useGetAllPlanQuery } from "../../features/plan/planApi";
import { useCreateSubcriptionMutation } from "../../features/subcription/subcriptionApi";
import { getImageUrl } from "../../utils/getImageUrl";
import Image from "next/image";

const SubscriptionPlanContent = dynamic(
  () =>
    Promise.resolve(({ userType, messages }) => {
      const subscriptionPlanTranslations = messages?.subscriptionPlan || {};

      // Add state to track which plan is loading
      const [loadingPlanId, setLoadingPlanId] = useState(null);
      const currentUser = localStorage.getItem("role");
      const {
        data: apiResponse,
        isLoading,
        isError,
      } = useGetAllPlanQuery(currentUser);
      const [createSubscription, { isLoading: createSubcLoading }] =
        useCreateSubcriptionMutation();

      if (isLoading) {
        return (
          <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center">Loading plans...</div>
            </div>
          </div>
        );
      }

      if (isError || !apiResponse?.success) {
        return (
          <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center text-red-500">
                Error loading plans
              </div>
            </div>
          </div>
        );
      }

      // Extract plans from API response
      const plans = apiResponse?.data || [];

      // Sort plans: monthly first, then yearly
      const sortedPlans = [...plans].sort((a, b) => {
        if (a.type === "month" && b.type === "year") return -1;
        if (a.type === "year" && b.type === "month") return 1;
        return 0;
      });

      const getPlanIcon = (title) => {
        if (
          title?.toLowerCase().includes("pro") ||
          title?.toLowerCase().includes("enterprise")
        ) {
          return "⭐";
        }
        return "👤";
      };

      const getCurrencySymbol = (title) => {
        if (
          title?.toLowerCase().includes("pro") ||
          title?.toLowerCase().includes("enterprise")
        ) {
          return "$";
        }
        return "€";
      };

      const formatTenderCount = (tenderCount) => {
        if (tenderCount === "unlimited" || tenderCount === "Unlimited") {
          return subscriptionPlanTranslations.unlimited || "Unlimited";
        }
        return tenderCount;
      };

      const getDurationText = (type) => {
        if (type === "year") {
          return subscriptionPlanTranslations.duration?.year || "year";
        }
        return subscriptionPlanTranslations.duration?.month || "mo";
      };

      const handleCreateSubscription = async (planId) => {
        console.log("Selected Plan ID:", planId);
        setLoadingPlanId(planId); // Set the specific plan that's loading
        try {
          const response = await createSubscription(planId).unwrap();
          console.log(response);
          toast.success(
            response?.message || "Subscription created successfully"
          );
          if (response?.data?.url) {
            window.location.href = response?.data?.url;
          }
        } catch (error) {
          console.log(error);
          toast.error(error?.data?.message || "Subscription failed");
        } finally {
          setLoadingPlanId(null); // Reset loading state
        }
      };

      return (
        <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0 ">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="animate-fade-in-up">
              {/* Header Section */}
              <div className="text-center mb-12">
                <Badge className="mb-6 px-4 py-2 text-sm font-medium rounded-full gradient">
                  {subscriptionPlanTranslations.badge || "Pricing plans"}
                </Badge>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {subscriptionPlanTranslations.title || "Plans for all sizes"}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {subscriptionPlanTranslations.description ||
                    "Simple, transparent pricing that grows with you. Try any plan free for 30 days."}
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                {sortedPlans.map((plan) => {
                  // Check if this specific plan is loading
                  const isCurrentPlanLoading = loadingPlanId === plan._id;

                  return (
                    <Card
                      key={plan._id}
                      className="h-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white py-0"
                    >
                      <div className="p-6 h-full flex flex-col">
                        {/* Badge for featured plans */}
                        {plan.isBadge === true && (
                          <div className="text-center mb-2">
                            <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-300">
                              ⭐{" "}
                              {subscriptionPlanTranslations.featured ||
                                "Featured"}
                            </Badge>
                          </div>
                        )}

                        {/* Plan Icon and Title */}
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                            {plan.image ? (
                              <Image
                                src={getImageUrl(plan.image)}
                                alt={plan.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="text-xl">
                                {getPlanIcon(plan.title)}
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-blue-600 mb-0">
                            {plan.title}
                          </h3>
                          {plan.isSupport === true && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                🎧{" "}
                                {subscriptionPlanTranslations.prioritySupport ||
                                  "Priority Support"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <span className="text-lg text-gray-600 ml-1">
                              {getCurrencySymbol(plan.title)}/
                              {getDurationText(plan.type)}
                            </span>
                          </div>
                          <p className="text-center text-sm text-gray-500 mt-2">
                            {plan.type === "year"
                              ? subscriptionPlanTranslations.billedYearly ||
                                "Billed yearly"
                              : subscriptionPlanTranslations.billedMonthly ||
                                "Billed monthly"}
                          </p>
                        </div>

                        {/* Job and Tender Counts */}
                        <div className="mb-4 space-y-3">
                          {/* Job Count */}
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <span className="text-lg font-bold text-blue-600">
                                {formatTenderCount(plan.jobCount)}
                              </span>
                              <span className="text-sm font-medium text-blue-700">
                                {subscriptionPlanTranslations.jobs || "Jobs"}
                              </span>
                            </div>
                            <p className="text-xs text-blue-600">
                              {subscriptionPlanTranslations.jobsAvailable ||
                                "Available to post"}
                            </p>
                          </div>

                          {/* Tender Count - Only show if tenderCount is not null */}
                          {plan.tenderCount !== null && (
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-lg font-bold text-green-600">
                                  {formatTenderCount(plan.tenderCount)}
                                </span>
                                <span className="text-sm font-medium text-green-700">
                                  {subscriptionPlanTranslations.tenders ||
                                    "Tenders"}
                                </span>
                              </div>
                              <p className="text-xs text-green-600">
                                {subscriptionPlanTranslations.tendersAvailable ||
                                  "Available to post"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Features/Benefits */}
                        <div className="flex-1 space-y-3 mb-6">
                          {plan.benefits?.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">
                                ✓
                              </span>
                              <span className="text-sm text-gray-700 leading-relaxed">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>

                        {console.log("sssssssssss", plan.type)}

                        {plan.type === "trial" ? (
                          <Button
                            disabled
                            className="w-full font-medium button-gradient relative"
                          >
                            Already Subscribed
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleCreateSubscription(plan?._id)}
                            disabled={isCurrentPlanLoading || createSubcLoading}
                            className="w-full font-medium button-gradient relative"
                          >
                            {isCurrentPlanLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                {subscriptionPlanTranslations.status
                                  ?.processing || "Processing..."}
                              </div>
                            ) : (
                              subscriptionPlanTranslations.status?.subscribe ||
                              "Subscribe Now"
                            )}
                          </Button>
                        )}

                        {/* Button with Individual Loading State */}
                      </div>
                    </Card>
                  );
                })}

                {/* Fallback if no plans found */}
                {sortedPlans.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">
                      {subscriptionPlanTranslations.noPlansAvailable ||
                        "No plans available for your user type."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }),
  { ssr: false }
);

function PackagePlan({ userType = "freelancer", messages = "EN" }) {
  return <SubscriptionPlanContent userType={userType} messages={messages} />;
}

export default PackagePlan;
