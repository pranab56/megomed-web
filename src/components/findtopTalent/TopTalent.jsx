"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoSearchOutline } from "react-icons/io5";
import Banner from "../common/banner/Banner";
import Heading from "../common/heading/Heading";
import ServiceCard from "../common/ServiceCard/ServiceCard";
import { Input } from "../ui/input";

function TopTalent() {
  const setTopTalentBanner = {
    src: "/services/service_1.png",
    header: "Find Top Talent",
    text: "Select top-tier talent that aligns with your organization's goals and needs. Our platform connects you with skilled professionals who can drive innovation, improve productivity, and ensure the success of your projects, delivering exceptional results every time.",
    buttonName: "Hire Freelancers",
  };

  // Mock service data (replace with real data as needed)
  const services = Array(8).fill(null).map((_, index) => ({
    id: index + 1,
    name: `Freelancer ${index + 1}`,
    title: "Senior UX Designer",
    rate: "$50/hr",
    rating: 4.9,
    reviews: 128,
    image: "/placeholder-avatar.png", // Replace with real image paths
    skills: ["Figma", "User Research", "Prototyping"],
  }));

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
          heading="UX Design"
          subheading="Provide your visitors with a seamless experience through strong UX design."
        />

        <div className="flex flex-col items-center gap-4 my-5 md:my-8 lg:my-10 px-4 sm:px-6 2xl:px-0">
          <div className="relative w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search talents..."
              className="pl-10 pr-4 py-2"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-10">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Skills</SelectLabel>
                  <SelectItem value="ux">UX Design</SelectItem>
                  <SelectItem value="ui">UI Design</SelectItem>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 mx-auto px-4 sm:px-6 2xl:px-0">
        {services.map((service) => (
          <ServiceCard key={service.id} data={service} />
        ))}
      </div>
    </div>
  );
}

export default TopTalent;