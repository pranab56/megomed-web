"use client";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useAllProjectByClientQuery } from '../../features/jobBoard/jobBoardApi';
import SideBar from "../common/SideBar";
import Banner from "../common/banner/Banner";
import Heading from "../common/heading/Heading";
import MainContent from "../common/maincontent/MainContent";
import { Input } from "../ui/input";

// ✅ Real component — hooks at top level
const JobBoardLayoutContent = () => {
  const userType = "client";

  const setJobBannerFreelancer = {
    src: "/jobtender/job_banner.png",
    header: "Find Your Next Opportunity!",
    text: "Discover exciting job opportunities that match your skills and career goals. Our platform connects talented professionals with innovative companies.",
    buttonName: "",
  };

  //sdfsdfsdf

  const setJobBannerClient = {
    src: "/jobtender/job_banner.png",
    header: "Post Jobs & Find Talent",
    text: "Welcome to our Job Board, where businesses can post job opportunities and connect with qualified candidates. Whether you're hiring for a full-time position or seeking freelance talent, we provide the tools and platform to make your recruitment process efficient and successful.",
    buttonName: "Post a Job",
    buttonLink: "/create-job-client",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Construct query parameters
  const serviceTypeName = selectedServices.length > 0 ? selectedServices.join(',') : "";
  const categoryName = selectedCategories.length > 0 ? selectedCategories.join(',') : "";

  // Debug logs (optional — remove in production)
  console.log("serviceTypeName", serviceTypeName);
  console.log("categoryName", categoryName);
  console.log("searchTerm", searchTerm);

  // ✅ RTK Query hook — now works correctly
  const { data, isLoading, isError } = useAllProjectByClientQuery({
    categoryName,
    serviceTypeName,
    searchTerm,
  });

  console.log("API Response Data:", data);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-7xl py-6 mx-auto">
      <div className="animate-fade-in-up">
        {/* Banner Section */}
        <Banner
          src={userType === "client" ? setJobBannerClient.src : setJobBannerFreelancer.src}
          header={userType === "client" ? setJobBannerClient.header : setJobBannerFreelancer.header}
          text={userType === "client" ? setJobBannerClient.text : setJobBannerFreelancer.text}
          buttonName={userType === "client" ? setJobBannerClient.buttonName : setJobBannerFreelancer.buttonName}
          buttonLink={userType === "client" ? setJobBannerClient.buttonLink : setJobBannerFreelancer.buttonLink}
        />

        {/* Heading + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-4 md:px-6 lg:px-10 2xl:px-0 w-full">
          <Heading
            heading="Available Jobs"
            subheading="Browse through our latest job postings and find your next career move."
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="relative w-full sm:w-64 md:w-72">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* Sidebar + Main Content */}
        <div className="flex mt-10 px-4 sm:px-6 lg:px-10 2xl:px-0">
          <SideBar
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <MainContent
            type="job"
            jobs={data?.data || []}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
};

// ✅ Dynamically import with SSR disabled — correct usage
import dynamic from "next/dynamic";
export default dynamic(() => Promise.resolve(JobBoardLayoutContent), { ssr: false });