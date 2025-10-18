"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import provideIcon from "@/utils/IconProvider/provideIcon";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useConnectStripeMutation } from "@/features/plan/planApi";
import toast from "react-hot-toast";
import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";
import { getImageUrl } from "@/utils/getImageUrl";
import HelpsAndSupport from "@/components/common/helpsAndSupport/helpsAndSupport";

function CompanyNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpSheetOpen, setIsHelpSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData } = useGetMyprofileQuery();

  // console.log("userData //////////////////////////", userData);
  const [connectStripe, { isLoading: isConnectStripeLoading }] =
    useConnectStripeMutation();
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup effect to ensure modal state is reset
  useEffect(() => {
    return () => {
      setIsHelpSheetOpen(false);
    };
  }, []);

  // Navigation items in English
  const navItems = [
    {
      label: "Job Board",
      href: `/job-board`,
    },

    {
      label: "Inbox",
      href: `/chat`,
    },
    {
      label: "Invoices",
      href: `/invoices`,
    },
    {
      label: "My Projects",
      href: `/my-projects`,
    },
    {
      label: "My Subscription",
      href: `/my-subscription`,
    },
    {
      label: "Package",
      href: `/package`,
    },
  ];

  const handleConnectStripe = async () => {
    try {
      const response = await connectStripe().unwrap();
      console.log("response", response);

      // Show the message from the API response
      toast.success(response?.data?.message || "Redirecting to Stripe...");

      // Redirect to the URL from the response data
      if (response?.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.error("Failed to connect Stripe:", error);
      toast.error("Failed to connect Stripe. Please try again.");
    }
  };

  // Helper function to determine if link is active
  const isActiveLink = (href) => {
    return pathname === href;
  };

  // Mock user data
  const user = {
    name: "Sabbir Ahmed",
    role: "Compnay",
    avatar: "/client/profile/client.png",
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleHelpSheetClose = (open) => {
    setIsHelpSheetOpen(open);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href={`/`} className="text-2xl font-bold text-gray-900">
            {provideIcon({ name: "company_logo" })}
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`font-medium transition-colors ${
                isActiveLink(item.href)
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="hidden lg:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 shadow-md border hover:bg-gray-50 h-12"
              >
                <Image
                  src={
                    userData?.data?.profile
                      ? getImageUrl(userData.data.profile)
                      : "/client/profile/client.png"
                  }
                  alt={userData?.data?.fullName || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userData?.data?.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userData?.data?.designation || "Company"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem asChild>
                <Link
                  href={`/company-profile/private`}
                  className="w-full cursor-pointer"
                >
                  View Profile
                </Link>
              </DropdownMenuItem>
              {/* {userData?.data?.isStripeConnectedAccount === true ? (
                <DropdownMenuItem className="w-full cursor-pointer">
                  Connect Stripe{" "}
                  <span className="text-green-500">Connected</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="w-full cursor-pointer flex items-center gap-2"
                  onClick={handleConnectStripe}
                >
                  Connect Stripe{" "}
                  <span className="w-4 h-4 text-red-500">Pending</span>
                </DropdownMenuItem>
              )} */}
              {/* <DropdownMenuItem asChild>
                <Link href={`/billing`} className="w-full cursor-pointer">
                  Billing & Plans
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="w-full cursor-pointer"
                onClick={() => router.push("/company-dashboard")}
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-full cursor-pointer"
                onClick={() => setIsHelpSheetOpen(true)}
              >
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={
                        userData?.data?.profile
                          ? getImageUrl(userData.data.profile)
                          : "/client/profile/client.png"
                      }
                      alt={userData?.data?.fullName || "User"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <DrawerTitle className="text-sm font-medium">
                        {userData?.data?.fullName || "User"}
                      </DrawerTitle>
                      <p className="text-xs text-gray-500">
                        {userData?.data?.designation || "Freelancer"}
                      </p>
                    </div>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>
              <div className="px-6 pb-6 space-y-2">
                {/* Mobile Navigation */}
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActiveLink(item.href) ? "bg-blue-50 text-blue-600" : ""
                    }`}
                    asChild
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}

                {/* Mobile User Actions */}
                <div className="pt-4 border-t space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/profile/1`}>View Profile</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={handleConnectStripe}
                  >
                    Connect Stripe
                  </Button>
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/billing`}>Billing & Plans</Link>
                  </Button> */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsHelpSheetOpen(true)}
                  >
                    Help & Support
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Help & Support Sheet */}
      <HelpsAndSupport
        isOpen={isHelpSheetOpen}
        onOpenChange={handleHelpSheetClose}
      />
    </nav>
  );
}

export default CompanyNavbar;
