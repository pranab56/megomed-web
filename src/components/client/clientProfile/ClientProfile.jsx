import { Button } from "@/components/ui/button";
import provideIcon from "@/utils/IconProvider/provideIcon";
import Image from "next/image";
import React from "react";
import tr from "zod/v4/locales/tr.cjs";

function ClientProfile() {
  const clientInfo = {
    name: "John Doe",
    profilePicture: "/client/profile/client.png",
    bio: "I am UI/UX wizard",
    department: "Designer",
    location: "Paris, France",
    email: "john.doe@example.com",
    isVerified: true,
  };
  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="flex gap-2 justify-center md:justify-end ">
        <Button className="button-gradient">
          Follow {provideIcon({ name: "user_plus" })}
        </Button>
        <Button className="button-gradient">
          Share {provideIcon({ name: "user_user" })}
        </Button>
        <Button className="button-gradient">
          Consult Website {provideIcon({ name: "globe" })}
        </Button>
      </div>
      <div className="flex gap-10 items-start py-2">
        <Image
          src={clientInfo.profilePicture}
          alt="client-profile"
          width={150}
          height={150}
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{clientInfo.name}</h1>
          <p>{clientInfo.bio}</p>
          <p>Department: {clientInfo.department}</p>
          <p>Location: {clientInfo.location}</p>
          <p>Email: {clientInfo.email}</p>
          <p>{clientInfo.phone}</p>
          {clientInfo.isVerified && (
            <div className="flex items-center gap-2">
              <span>{provideIcon({ name: "verified" })}</span> Verified Client
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="h2-gradient-text text-2xl font-bold text-justify">
          About The Company
        </h1>
        <p>
          At [Freelancer Name], we connect businesses with talented
          professionals from around the world. Our platform offers a wide range
          of skilled freelancers, ready to deliver high-quality work across
          various industries. Whether you're looking for web development,
          graphic design, content writing, or marketing expertise, we make it
          easy to find the perfect match for your project. With a focus on
          efficiency, reliability, and client satisfaction, we ensure every
          collaboration is seamless and successful. Join us today and experience
          the power of skilled freelancers tailored to your needs
        </p>
      </div>
    </div>
  );
}

export default ClientProfile;
