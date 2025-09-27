"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamic imports with SSR disabled to prevent hydration issues
const HomeBanner = dynamic(() => import("./HomeBanner"), {
  ssr: false,
  loading: () => (
    <section className="relative h-screen w-full">
      <div className="absolute inset-0 bg-gray-900" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-700 rounded mb-6 max-w-4xl mx-auto"></div>
          <div className="h-8 bg-gray-700 rounded mb-12 max-w-3xl mx-auto"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gray-700 rounded w-64"></div>
            <div className="h-12 bg-gray-700 rounded w-64"></div>
          </div>
        </div>
      </div>
    </section>
  ),
});

const TalentCategories = dynamic(() => import("./Slider"), {
  
  ssr: false,
  loading: () => (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-[100rem] 2xl:max-w-10/12 mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-12 max-w-md"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

const PopularServices = dynamic(() => import("./PopularServices"), {
  ssr: false,
  loading: () => (
    <div className="w-full lg:w-10/12 px-6 mx-auto my-12">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-300 rounded mb-12 max-w-md mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-300 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-300 rounded w-60 mx-auto mt-12"></div>
      </div>
    </div>
  ),
});

const Testimonial = dynamic(() => import("./Testimonial"), {
  ssr: false,
  loading: () => (
    <section className="py-16 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-[100rem] mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-10 max-w-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

const SkilledFreelancersSectionWrapper = dynamic(
  () => import("./SkilledFreelancersSectionWrapper"),
  {
    ssr: false,
    loading: () => (
      <section className="py-10 2xl:py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="space-y-6">
                <div className="h-12 bg-gray-300 rounded max-w-md"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

const FindTalentWayWrapper = dynamic(() => import("./FindTalentWayWrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="relative w-full h-[40rem] sm:h-[45rem] lg:h-[50rem] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-300 rounded mb-6 max-w-2xl"></div>
            <div className="h-24 bg-gray-300 rounded mb-8 max-w-3xl"></div>
            <div className="h-12 bg-gray-300 rounded w-64"></div>
          </div>
        </div>
      </div>
    </div>
  ),
});

const WhyChooseUsWrapper = dynamic(() => import("./WhyChooseUsWrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-16 px-6 2xl:px-0">
      <div className="container mx-auto max-w-[100rem] 2xl:max-w-10/12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-8 max-w-md mx-auto"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-300 rounded max-w-2xl mx-auto"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});

function Homelayout() {
  return (
    <>
      <HomeBanner />
      <TalentCategories />
      <SkilledFreelancersSectionWrapper />
      <PopularServices />
      <FindTalentWayWrapper />
      <WhyChooseUsWrapper />
      <Testimonial />
    </>
  );
}

export default Homelayout;
