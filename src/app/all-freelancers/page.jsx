import FreelancerCards from "@/components/allFreelancers/allFreelancersLayout";
import AllFreelancersLayout from "@/components/allFreelancers/allFreelancersLayout";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
function page() {
  return (
    <AuroraBackground
    // className="bg-cover bg-center bg-no-repeat"
    // style={{
    //   background: "url('/bg_bg.png') no-repeat center center fixed",
    //   backgroundSize: "cover",
    // }}
    >
      <FreelancerCards />
    </AuroraBackground>
  );
}

export default page;
