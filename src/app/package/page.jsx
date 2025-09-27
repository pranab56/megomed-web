"use client";
import dynamic from "next/dynamic";
import { useState } from "react"; // Import useState
import toast from "react-hot-toast";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useGetAllPlanQuery } from "../../features/plan/planApi";
import { useCreateSubcriptionMutation } from "../../features/subcription/subcriptionApi";


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


      // Sort plans: monthly first, then yearly
      const sortedPlans = [...(apiResponse?.data || [])].sort((a, b) => {
        if (a.type === "monthly" && b.type === "yearly") return -1;
        if (a.type === "yearly" && b.type === "monthly") return 1;
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
        if (type === "yearly") {
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        {plan.isBadge && (
                          <div className="text-center mb-2">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {subscriptionPlanTranslations.featured ||
                                "Featured"}
                            </Badge>
                          </div>
                        )}


                        {/* Plan Icon and Title */}
                        <div className="text-center mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="text-xl">
                              {getPlanIcon(plan.title)}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-600 mb-0">
                            {plan.title}
                          </h3>
                          {plan.isSupport && (
                            <span className="text-xs text-green-600 mt-1">
                              {subscriptionPlanTranslations.prioritySupport ||
                                "Priority Support"}
                            </span>
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
                            {plan.type === "yearly"
                              ? subscriptionPlanTranslations.billedYearly ||
                              "Billed yearly"
                              : subscriptionPlanTranslations.billedMonthly ||
                              "Billed monthly"}
                          </p>
                        </div>


                        {/* Tender Count */}
                        <div className="mb-4 text-center">
                          <span className="text-sm font-medium text-gray-700">
                            {formatTenderCount(plan.tenderCount)}{" "}
                            {subscriptionPlanTranslations.tenders || "tenders"}
                          </span>
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


                        {/* Button with Individual Loading State */}
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



