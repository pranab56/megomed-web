"use client";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import {
  useGetAllTenderByClientQuery,
  useGetAllTenderQuery,
} from "../../features/tender/tenderApi";
import SideBar from "../common/SideBar";
import Banner from "../common/banner/Banner";
import Heading from "../common/heading/Heading";
import MainContent from "../common/maincontent/MainContent";
import { Input } from "../ui/input";

// Client-side component to determine user type
const TenderLayoutContent = () => {
  const [userType, setUserType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Safely access localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("role");
      setUserType(currentUser);
    }
  }, []);

  // Construct query parameters
  const serviceTypeName =
    selectedServices.length > 0 ? selectedServices.join(",") : "";
  const categoryName =
    selectedCategories.length > 0 ? selectedCategories.join(",") : "";

  // Debug logs (optional — remove in production)
  console.log("serviceTypeName", serviceTypeName);
  console.log("categoryName", categoryName);
  console.log("searchTerm", searchTerm);

  // ✅ RTK Query hooks — conditional based on user type
  const clientQuery = useGetAllTenderByClientQuery(
    {
      categoryName: categoryName || "",
      serviceTypeName: serviceTypeName || "",
      searchTerm: searchTerm || "",
    },
    {
      skip: userType !== "client",
    }
  );

  const freelancerQuery = useGetAllTenderQuery(
    {
      categoryName: categoryName || "",
      serviceTypeName: serviceTypeName || "",
      searchTerm: searchTerm || "",
    },
    {
      skip: userType !== "freelancer",
    }
  );

  // Use the appropriate query result based on user type
  const { data, isLoading, isError } =
    userType === "client" ? clientQuery : freelancerQuery;

  console.log("API Response Data:", data);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const setTenderBannerFreelancer = {
    src: "/jobtender/tnder_banner.png",
    header: "Start Exploring Tenders Today!",
    text: "Whether you're submitting a proposal or posting a project, our platform simplifies the process for both clients and freelancers, ensuring quality results and successful collaborations.",
    buttonName: "",
    buttonLink: "",
  };

  const setTenderBannerClient = {
    src: "/jobtender/tnder_banner.png",
    header: "Browse & Submit Tenders",
    text: "Welcome to our Tender Portal, where businesses and freelancers can find and submit project opportunities. Whether you're looking to post a project or bid on a tender, we ensure a seamless process to connect you with the right professionals and organizations.",
    buttonName: "Post Your Tender",
    buttonLink: "/create-tender-client",
  };

  const currentBanner =
    userType === "client" ? setTenderBannerClient : setTenderBannerFreelancer;

  // Show loading state while userType is being determined
  if (userType === null) {
    return (
      <div className="max-w-7xl py-6 mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl py-6 mx-auto">
      <div className="animate-fade-in-up">
        <Banner
          src={currentBanner.src}
          header={currentBanner.header}
          text={currentBanner.text}
          buttonName={userType === "client" ? "Post Your Tender" : ""}
          buttonLink={userType === "client" ? "/create-tender-client" : ""}
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-4 md:px-6 lg:px-10 2xl:px-0 w-full">
          <Heading
            heading={"Ongoing Tenders"}
            subheading={"Find project opportunities that match your expertise."}
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="relative w-full sm:w-64 md:w-72">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder={"Search..."}
                className="pl-9 pr-3 w-full"
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-10 px-4 sm:px-6 lg:px-10 2xl:px-0">
          <SideBar
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <MainContent
            jobs={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            type="tender"
          />
        </div>
      </div>
    </div>
  );
};

function TenderLayout() {
  return <TenderLayoutContent />;
}

export default TenderLayout;
