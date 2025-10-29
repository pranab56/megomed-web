import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

// Separate Glassmorphism Card Component
function TalentCard() {
  const [isClient, setIsClient] = useState(false);
  const messages = "Hello world";

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl w-full max-w-2xl h-[30rem] md:h-[32rem] mx-auto">
        <CardContent className="p-6 sm:p-8 text-center sm:text-left">
          <div className="animate-pulse">
            <div className="h-16 bg-white/20 rounded mb-4 sm:mb-6"></div>
            <div className="h-20 bg-white/20 rounded mb-6 sm:mb-8"></div>
            <div className="h-12 bg-white/20 rounded w-48 mx-auto sm:mx-0"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const findTalentWayTranslations = messages?.home?.findTalentWay || {
    title: "Find talent",
    subtitle: "the right way",
    description:
      "Connect with verified professionals who are ready to bring your vision to life. Our platform ensures quality and reliability.",
    findFreelancer: "Find Freelancer",
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl w-full max-w-2xl h-[30rem] md:h-[32rem] mx-auto">
      <CardContent className="p-6 sm:p-8 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          {findTalentWayTranslations.title}
          <br />
          <span className="text-white">
            {findTalentWayTranslations.subtitle}
          </span>
        </h2>

        <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
          {findTalentWayTranslations.description}
        </p>

        <div className="flex justify-center items-center">
          {/* <Button
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white h-12
         px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
          >
            {findTalentWayTranslations.findFreelancer}
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

function FindTalentWay() {
  const [isClient, setIsClient] = useState(false);

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="relative w-full h-[40rem] sm:h-[45rem] lg:h-[50rem] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/40 z-[1]"></div>

          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={"/home/find_talent_way.png"}
              fill
              className="object-cover"
              alt="find-talent-way"
              priority
            />
          </div>

          {/* Card positioned right-center with responsive positioning */}
          <div className="absolute inset-y-0 right-0 flex items-center z-10 w-full">
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
              {/* Container for right positioning on larger screens */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xl 2xl:max-w-2xl lg:mr-8 xl:mr-8 2xl:mr-16">
                  <Card className="bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl w-full max-w-2xl h-[30rem] md:h-[32rem] mx-auto">
                    <CardContent className="p-6 sm:p-8 text-center sm:text-left">
                      <div className="animate-pulse">
                        <div className="h-16 bg-white/20 rounded mb-4 sm:mb-6"></div>
                        <div className="h-20 bg-white/20 rounded mb-6 sm:mb-8"></div>
                        <div className="h-12 bg-white/20 rounded w-48 mx-auto sm:mx-0"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-[40rem] sm:h-[45rem] lg:h-[50rem] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={"/home/find_talent_way.png"}
            fill
            className="object-cover"
            alt="find-talent-way"
            priority
          />
        </div>

        {/* Card positioned right-center with responsive positioning */}
        <div className="absolute inset-y-0 right-0 flex items-center z-10 w-full">
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
            {/* Container for right positioning on larger screens */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xl 2xl:max-w-2xl lg:mr-8 xl:mr-8 2xl:mr-16">
                <TalentCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindTalentWay;
