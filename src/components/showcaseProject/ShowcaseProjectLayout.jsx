"use client";
import useCheckUserAndLoggedIn from "@/hooks/checkUserTypeAndLoggedIn/CheckUserAndLoggedIn";
import { FiEdit } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { useGetAllShowCaseProjectQuery } from "../../features/showcaseProject/showCaseProjectApi";
import Banner from "../common/banner/Banner";
import ServiceCard from "../common/ServiceCard/ServiceCard";
import { Button } from "../ui/button";

function ShowcaseProjectLayout() {
  const { isClientAndLoggedIn, isLoggedIn, isFreelancerAndLoggedIn } =
    useCheckUserAndLoggedIn();

  // Fetch showcase projects data
  const {
    data: projectsData,
    isLoading,
    isError,
  } = useGetAllShowCaseProjectQuery();

  const setShowcaseBanner = {
    src: "/showcase/showcase.png",
    header: "Showcase Your Projects",
    text: "Highlight your work and attract potential clients by showcasing your completed projects. This section lets you display your best work, providing clients with a glimpse of your skills, expertise, and creativity.",
    buttonName: isClientAndLoggedIn || isLoggedIn ? "" : "View All Projects",
  };

  // Use real project data or fallback to empty array
  const projects = projectsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <Banner
        src={setShowcaseBanner.src}
        header={setShowcaseBanner.header}
        text={setShowcaseBanner.text}
        buttonName={setShowcaseBanner.buttonName}
      />
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="h2-gradient-text text-2xl font-bold">
          Discover Projects
        </h1>
        {isFreelancerAndLoggedIn && (
          <div className="flex items-center gap-4 my-10">
            <Button className="bg-transparent h2-gradient-text">
              Add new Project{" "}
              <IoAddCircleOutline className="text-blue-800" />
            </Button>
            <Button className="bg-transparent h2-gradient-text">
              Edit{" "}
              <FiEdit className="text-blue-800" />
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center py-4 mx-auto">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-8">
          <p className="text-red-600">
            Failed to load projects. Please try again.
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center py-4 mx-auto">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ServiceCard key={project._id} data={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No projects found.</p>
              {isFreelancerAndLoggedIn && (
                <Button
                  className="mt-4 button-gradient"
                  onClick={() => {
                    /* Add project dialog logic */
                  }}
                >
                  <IoAddCircleOutline className="mr-2" />
                  Add Your First Project
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShowcaseProjectLayout;