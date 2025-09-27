"use client";
import Image from "next/image";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function ThankYouPageLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "job"; // Default to job if no type is provided

  const getContent = (type) => {
    switch (type) {
      case "job":
        return {
          title: (
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Posting Your Job!
            </h1>
          ),
          description: (
            <p className="text-gray-600 leading-relaxed">
              We appreciate you choosing our platform to find the right
              freelancer for your project. Your job post is now live and will be
              visible to talented professionals who are ready to help bring your
              vision to life. You'll start receiving proposals shortly, and
              we're here to assist if you need any help along the way.
              <br />
              <br />
              Thank you for trusting us with your hiring needs – we look forward
              to helping you connect with the perfect freelancer!
            </p>
          ),
        };
      case "tender":
        return {
          title: (
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for posting your tender!
            </h1>
          ),
          description: (
            <p className="text-gray-600 leading-relaxed">
              We appreciate your trust in our platform to find the right
              professionals for your project. Your tender is now live and will
              be seen by qualified freelancers ready to submit their best
              proposals. We're excited to help you connect with the perfect
              candidate to bring your vision to life. If you have any questions
              or need further assistance, feel free to reach out.
            </p>
          ),
        };
      default:
        return {
          title: (
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
          ),
          description: (
            <p className="text-gray-600 leading-relaxed">
              Thank you for using our platform. We appreciate your trust and
              look forward to helping you achieve your goals.
            </p>
          ),
        };
    }
  };

  const content = getContent(type);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0 space-y-6">
      <div className="flex justify-center w-full">
        <Image src="/thank_you.png" alt="thank you" width={600} height={600} />
      </div>
      <div className="max-w-4xl mx-auto text-center space-y-4">
        {content.title}
        {content.description}
      </div>
      <div className="flex justify-center">
        <Button className="button-gradient" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default ThankYouPageLayout;
