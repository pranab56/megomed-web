import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

function SkilledFreelancersSection() {
  const [isClient, setIsClient] = useState(false);
  const messages = "Hello world";
  const locale = "Hello world";

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <section className="py-10 2xl:py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start relative">
            {/* Left Side - Image + Stats Skeleton */}
            <div className="relative w-full">
              <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[420px] 2xl:h-[500px] mt-10 2xl:mt-0">
                <div className="animate-pulse bg-gray-300 w-full h-full rounded"></div>
              </div>

              {/* Stats Cards Skeleton */}
              <div className="absolute top-4 right-14 sm:top-10 sm:right-16 md:right-64 md:top-10 lg:right-36 lg:top-10 bg-white shadow-lg border-none p-0 md:p-2">
                <div className="p-2 text-center min-w-[120px] sm:min-w-[140px]">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-40 left-14 sm:bottom-24 sm:left-20 md:left-64 md:bottom-48 lg:left-40 lg:bottom-48 2xl:left-40 2xl:bottom-60 bg-white shadow-lg border-none border-0 p-0 md:p-2 lg:p-2">
                <div className="p-2 text-center min-w-[180px]">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content Skeleton */}
            <div className="space-y-6 text-left">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-300 rounded max-w-md mb-4"></div>
                <div className="h-12 bg-gray-300 rounded max-w-md mb-4"></div>
                <div className="h-24 bg-gray-300 rounded max-w-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const skilledFreelancersTranslations = messages?.home?.skilledFreelancers || {
    stats: {
      freelancers: "Freelancers",
      freelanceWorkPosted: "Freelance Work Posted",
    },
    title: "Skilled",
    subtitle: "Freelancers",
    description:
      "Connect with talented professionals who are ready to bring your projects to life. Our platform features verified freelancers with proven track records.",
  };

  return (
    <section className="py-10 2xl:py-16 px-6 bg-white ">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start relative">
          {/* Left Side - Image + Stats */}
          <div className="relative w-full">
            <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[420px] 2xl:h-[500px] mt-10 2xl:mt-0">
              <Image
                src={"/auth/chat.png"}
                alt="Freelancers chat illustration"
                fill
                priority
                className="object-contain scale-140 md:scale-125 lg:scale-130 2xl:scale-120 sm:object-cover md:object-contain 2xl:object-contain"
              />
            </div>

            {/* Stats Cards */}
            <Card className="absolute top-4 right-14  sm:top-10 sm:right-16 md:right-64 md:top-10 lg:right-36 lg:top-10 bg-white shadow-lg border-0 p-0 md:p-2 ">
              <CardContent className="p-2 text-center min-w-[120px] sm:min-w-[140px]">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  500+
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {skilledFreelancersTranslations.stats.freelancers}
                </div>
              </CardContent>
            </Card>

            <Card className="absolute bottom-40 left-14 sm:bottom-24 sm:left-20 md:left-64 md:bottom-48 lg:left-40 lg:bottom-48 2xl:left-40 2xl:bottom-60 bg-white shadow-lg border-none border-0 p-0 md:p-2 lg:p-2">
              <CardContent className="p-2 text-center min-w-[180px]">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  300+
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {skilledFreelancersTranslations.stats.freelanceWorkPosted}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-blue-600">
                {skilledFreelancersTranslations.title}
              </span>
              <br />
              <span className="text-blue-600">
                {skilledFreelancersTranslations.subtitle}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {skilledFreelancersTranslations.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkilledFreelancersSection;
