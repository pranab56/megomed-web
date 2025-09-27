"use client";

import { useGetTopFreeLancerQuery } from '../../features/freelancer/freelancerApi';
import Banner from "../common/banner/Banner";
import Heading from "../common/heading/Heading";
import ServiceCard from "../common/ServiceCard/ServiceCard";

function TopTalent() {
  const setTopTalentBanner = {
    src: "/services/service_1.png",
    header: "Find Top Talent",
    text: "Select top-tier talent that aligns with your organization's goals and needs. Our platform connects you with skilled professionals who can drive innovation, improve productivity, and ensure the success of your projects, delivering exceptional results every time.",
    buttonName: "Hire Freelancers",
  };

  const { data: topFreelancher, isLoading, error } = useGetTopFreeLancerQuery();

  console.log("API Response:", topFreelancher);
  console.log("Freelancers data:", topFreelancher?.data);

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Banner
          src={setTopTalentBanner.src}
          header={setTopTalentBanner.header}
          text={setTopTalentBanner.text}
          buttonName={setTopTalentBanner.buttonName}
        />
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading freelancers...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Banner
          src={setTopTalentBanner.src}
          header={setTopTalentBanner.header}
          text={setTopTalentBanner.text}
          buttonName={setTopTalentBanner.buttonName}
        />
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-red-500">Error loading freelancers</div>
        </div>
      </div>
    );
  }

  // Check if data exists
  const freelancers = topFreelancher?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <Banner
        src={setTopTalentBanner.src}
        header={setTopTalentBanner.header}
        text={setTopTalentBanner.text}
        buttonName={setTopTalentBanner.buttonName}
      />

      <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 2xl:px-0">
        <Heading
          heading="Top Freelancers"
          subheading="Find skilled professionals ready for your projects"
        />
      </div>

      {freelancers.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">No freelancers available at the moment.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 mx-auto px-4 sm:px-6 2xl:px-0">
          {freelancers.map((freelancer) => (
            <ServiceCard key={freelancer._id} freelancer={freelancer} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TopTalent;