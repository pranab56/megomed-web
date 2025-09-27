"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Banner from "../common/banner/Banner";
import Heading from "../common/heading/Heading";
import ContactForm from "./ContactForm";

function ContactUs() {
  const [isClient, setIsClient] = useState(false);
  const messages = "EN";
  const contactUsTranslations = messages?.contactUs || {};

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const contactUsBanner = {
    src: "/contact/contact_1.png",
    header: contactUsTranslations.banner?.header || "Contact Us",
    text:
      contactUsTranslations.banner?.text ||
      "We'd love to hear from you! Whether you have questions, need support, or want to share feedback, our team is here to assist you.",
  };

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Loading skeleton for banner */}
        <div className="animate-pulse">
          <div className="relative h-64 bg-gray-300 rounded-lg mb-8"></div>
        </div>

        {/* Loading skeleton for heading and form */}
        <div className="px-4 sm:px-6 2xl:px-0">
          <div className="animate-pulse space-y-6 mb-10">
            <div className="h-12 bg-gray-300 rounded max-w-md"></div>
            <div className="h-20 bg-gray-300 rounded max-w-2xl"></div>
          </div>

          {/* Form skeleton */}
          <div className="max-w-7xl mx-auto my-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-300 rounded-xl"></div>
                ))}
                <div className="h-40 bg-gray-300 rounded-xl"></div>
                <div className="h-12 bg-gray-300 rounded-xl w-48 mx-auto"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-80 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Banner
        src={contactUsBanner.src}
        header={contactUsBanner.header}
        text={contactUsBanner.text}
      />
      <div className="px-4 sm:px-6 2xl:px-0">
        <Heading
          heading={contactUsTranslations.heading?.main || "Get In Touch"}
          subheading={
            contactUsTranslations.heading?.subheading ||
            "Likewise, a range of activities enriches life, blending vigor with balance. The result is a lifestyle that's not only dynamic but also deeply rewarding."
          }
        />
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactUs;
