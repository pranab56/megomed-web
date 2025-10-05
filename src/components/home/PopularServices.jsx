"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetAllServicesQuery } from "../../features/services/servicesApi";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { getImageUrl } from "@/utils/getImageUrl";

function PopularServices() {
  const [isClient, setIsClient] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const pathname = usePathname();
  const messages = "Hello world";

  const { data, isLoading, isError, isFetching, refetch } =
    useGetAllServicesQuery();

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const popularServicesTranslations = messages?.home?.popularServices || {
    title: "Our Popular Services",
    exploreMoreTitle: "Explore More Services",
    seeAllCategories: "See All Categories",
  };

  // Function to get image source based on service name
  const getImageSource = (serviceName) => {
    const serviceImages = {
      "Graphic Design": "/popular_categories/graphics_design.png",
      "Web Development": "/popular_categories/article.png",
      "Cartoon Animation": "/popular_categories/cartoon_animation.png",
      Illustration: "/popular_categories/illustration.png",
      "Flyers & Vouchers": "/popular_categories/flyers.png",
      "Logo Design": "/popular_categories/logo_design.png",
      "Social Graphics": "/popular_categories/social.png",
      "Article Writing": "/popular_categories/article.png",
      "Video Editing": "/popular_categories/video_editing.png",
    };

    return serviceImages[serviceName] || "/popular_categories/default.png";
  };

  // Show loading state on server, content on client
  if (!isClient || isLoading || isFetching) {
    return (
      <div className="w-full lg:w-10/12 px-6 mx-auto my-12 flex flex-col justify-center">
        {/* Title skeleton */}
        <div className="animate-pulse">
          <div className="h-16 bg-gray-300 rounded max-w-2xl mx-auto mb-12"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 my-12">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-[12rem] sm:h-[10rem] bg-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded w-60 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state if API call fails
  if (isError) {
    return (
      <div className="w-full lg:w-10/12 px-6 mx-auto my-12 flex flex-col justify-center">
        <h2 className="text-4xl h2-gradient-text leading-14 font-bold text-center">
          {pathname === "/services"
            ? popularServicesTranslations.exploreMoreTitle
            : popularServicesTranslations.title}
        </h2>
        <div className="text-center my-12">
          <p className="text-red-500">Error loading services</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-10/12 px-6 mx-auto my-12 flex flex-col justify-center">
      <h2 className="text-4xl h2-gradient-text leading-14 font-bold text-center">
        {pathname === "/services"
          ? popularServicesTranslations.exploreMoreTitle
          : popularServicesTranslations.title}
      </h2>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 my-12">
            {(showAllServices ? data?.data : data?.data?.slice(0, 4))?.map(
              (service, index) => (
                <Card
                  className="h-[12rem] sm:h-[10rem] relative overflow-hidden border-none cursor-pointer group transition-transform duration-300 hover:scale-105"
                  key={service._id}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={getImageUrl(service.image)}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center justify-center p-4">
                    <h3 className="text-white font-semibold text-center text-sm md:text-base lg:text-lg group-hover:text-white/90 transition-colors duration-300">
                      {service.name}
                    </h3>
                  </div>
                </Card>
              )
            )}
          </div>
          <Button
            className="w-60 button-gradient mx-auto"
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices
              ? "Show Less"
              : popularServicesTranslations.seeAllCategories}
          </Button>
        </>
      ) : (
        <div className="text-center my-12">
          <p>No services available</p>
        </div>
      )}
    </div>
  );
}

export default PopularServices;
