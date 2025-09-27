import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

function WhyChooseUs() {
  const [isClient, setIsClient] = useState(false);
  const messages = "Hello world";

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <div className="w-full py-16 px-6 2xl:px-0">
        <div className="container mx-auto max-w-[100rem] 2xl:max-w-10/12">
          <div className="relative">
            {/* Background decorative element skeleton */}
            <div className="absolute top-0 right-0 hidden lg:block">
              <div className="w-[500px] h-[500px] bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Main content skeleton */}
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content skeleton */}
              <div className="space-y-8">
                <Card className="p-6 space-y-4 flex flex-col items-center justify-center">
                  <div className="animate-pulse">
                    <div className="h-16 bg-gray-300 rounded max-w-md mb-8"></div>
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className={`border-2 rounded-lg border-black w-10/12 mb-4 flex items-center bg-white/80 backdrop-blur-sm p-2 ${index % 2 === 1 ? "ml-12" : "mr-12"
                          }`}
                      >
                        <div className="w-full space-y-2">
                          <div className="h-6 bg-gray-300 rounded max-w-48"></div>
                          <div className="h-16 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right side - Visual space skeleton */}
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const whyChooseUsTranslations = messages?.home?.whyChooseUs || {
    title: "Why Choose Us",
    features: {
      topVetted: {
        title: "Top-Vetted Freelancers",
        description:
          "Work with handpicked experts who meet the highest standards for skill, experience, and reliability.",
      },
      zeroCommission: {
        title: "Zero Commission Fees",
        description:
          "Transparent pricing guaranteed—pay or earn exactly what's agreed with no hidden fees.",
      },
      flexibleScalable: {
        title: "Flexible & Scalable Talent",
        description:
          "Hire for small tasks or full-scale projects—whatever you need, whenever you need it.",
      },
    },
  };

  const features = [
    {
      title: whyChooseUsTranslations.features.topVetted.title,
      description: whyChooseUsTranslations.features.topVetted.description,
    },
    {
      title: whyChooseUsTranslations.features.zeroCommission.title,
      description: whyChooseUsTranslations.features.zeroCommission.description,
    },
    {
      title: whyChooseUsTranslations.features.flexibleScalable.title,
      description:
        whyChooseUsTranslations.features.flexibleScalable.description,
    },
  ];

  return (
    <div className="w-full py-16 px-6 2xl:px-0">
      <div className="container mx-auto max-w-[100rem] 2xl:max-w-10/12">
        <div className="relative ">
          {/* Background decorative element */}
          <div className="absolute top-0 right-0 hidden lg:block">
            <Image
              src={"/auth/chat.png"}
              width={500}
              height={500}
              alt="chat icon"
            />
          </div>

          {/* Main turquoise speech bubble shape */}

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              {/* Feature Cards */}
              <Card className="p-6 space-y-4 flex flex-col items-center justify-center ">
                <h2 className="text-4xl lg:text-5xl font-bold h2-gradient-text leading-tight">
                  {whyChooseUsTranslations.title}
                </h2>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg border-black w-10/12 hover:shadow-md transition-shadow duration-300 flex items-center bg-white/80 backdrop-blur-sm p-2 ${index % 2 === 1 ? "ml-12" : "mr-12"
                      }`}
                  >
                    <CardContent className="p-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 h2-gradient-text">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </div>
                ))}
              </Card>
            </div>

            {/* Right side - Visual space for the decorative element */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUs;
