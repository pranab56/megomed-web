"use client";

import { useEffect, useState } from "react";
import { useGetAllFreeLancerQuery } from '../../features/freelancer/freelancerApi';
import Banner from "../common/banner/Banner";
import Heading from "../common/heading/Heading";
import ServiceCard from "../common/ServiceCard/ServiceCard";
import PopularServices from "../home/PopularServices";

function ServicesLayout() {
  const [isClient, setIsClient] = useState(false);
  const messages = "EN";
  const servicesTranslations = messages?.home?.services || {};

  const { data, isLoading, isError } = useGetAllFreeLancerQuery();

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state on server, content on client
  if (!isClient || isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Banner skeleton */}
        <div className="animate-pulse">
          <div className="relative h-64 bg-gray-300 rounded-lg mb-8"></div>
        </div>

        {/* Heading skeleton */}
        <div className="px-4 sm:px-6 2xl:px-0 py-4 md:py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded max-w-48"></div>
            <div className="h-6 bg-gray-300 rounded max-w-96"></div>
          </div>
        </div>

        {/* Services grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center py-4 px-4 sm:px-6 2xl:px-0 mx-auto">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* PopularServices skeleton */}
        <div className="animate-pulse">
          <div className="h-16 bg-gray-300 rounded max-w-2xl mx-auto mb-12"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 my-12">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-[12rem] sm:h-[10rem] bg-gray-300 rounded"
              ></div>
            ))}
          </div>
          <div className="h-12 bg-gray-300 rounded w-60 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Freelancers</h2>
          <p className="text-gray-600 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  const freelancers = data?.data || [];

  const setServiceBanner = {
    src: "/services/service_1.png",
    header:
      servicesTranslations.banner?.title ||
      "Choose the best talent for your organization's success.",
    text:
      servicesTranslations.banner?.description ||
      "Choose the perfect freelancer to elevate your organization with top-tier skills, experience, and expertise.",
    buttonName: servicesTranslations.banner?.buttonText || "Hire Freelancers",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Banner
        src={setServiceBanner.src}
        header={setServiceBanner.header}
        text={setServiceBanner.text}
        buttonName={setServiceBanner.buttonName}
      />

      <div className="px-4 sm:px-6 2xl:px-0 py-4 md:py-12 ">
        <Heading
          heading={servicesTranslations.heading?.title || "Top Freelancers"}
          subheading={
            servicesTranslations.heading?.subtitle ||
            "Find the perfect talent for your projects from our curated list of professionals."
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 px-4 sm:px-6 2xl:px-0 mx-auto">
        {freelancers.length > 0 ? (
          freelancers.map((freelancer) => (
            <ServiceCard key={freelancer._id} freelancer={freelancer} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No freelancers available at the moment.</p>
          </div>
        )}
      </div>
      <PopularServices />
    </div>
  );
}

export default ServicesLayout;