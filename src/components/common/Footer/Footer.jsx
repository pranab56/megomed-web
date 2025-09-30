"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import provideIcon from "@/utils/IconProvider/provideIcon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Footer() {
  const curentUser = localStorage.getItem("role");
  const forClientsLinks = [
    {
      label: "Find Freelancers",
      href: `/find-top-talent`,
    },
    {
      label: "Post Project",
      href: `/job-board`,
    },
    {
      label: "Refund Policy",
      href: `/refund-policy`,
    },
    {
      label: "Privacy Policy",
      href: `/privacy-policy`,
    },
  ];

  const forFreelancersLinks = [
    {
      label: "Find Work",
      href: `/job-board`,
    },
    {
      label: "Create Account",
      href: `/auth/sign-up`,
    },
  ];

  return (
    <>
      <footer className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and Description */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 sm:mb-6">
                <Link href={`/`}>{provideIcon({ name: "company_logo" })}</Link>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs lg:max-w-none">
                Find the best freelancers for your projects
              </p>
            </div>
            {/* For Clients */}
            <div className="col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6">
                For Clients
              </h3>
              <ul className="space-y-2 ">
                {forClientsLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-gray-600 text-sm transition-colors block py-1 ${
                        curentUser === "freelancer"
                          ? "cursor-not-allowed opacity-50 pointer-events-none"
                          : "hover:text-black"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* For Freelancers */}
            <div className="col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6">
                For Freelancers
              </h3>
              <ul className="space-y-2 ">
                {forFreelancersLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-gray-600 text-sm transition-colors block py-1 ${
                        curentUser === "client"
                          ? "cursor-not-allowed opacity-50 pointer-events-none"
                          : "hover:text-black"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3">
                Subscribe
              </h3>
              <p className="text-gray-600 text-sm mb-4 sm:mb-6">
                Stay updated with our latest news and offers.
              </p>
              <div className="flex flex-col sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 sm:rounded-r-none sm:border-r-0 focus:border-gray-300 mb-2 sm:mb-0"
                />
                <Button
                  size="icon"
                  className="sm:rounded-l-none bg-black hover:bg-gray-800 w-full sm:w-auto"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-12 sm:mt-16 pt-6 sm:pt-8">
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              © 2023 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
