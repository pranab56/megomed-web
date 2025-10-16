"use client";
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
import { useGetMyprofileQuery } from "@/features/clientProfile/ClientProfile";
import { getImageUrl } from "@/utils/getImageUrl";
import provideIcon from "@/utils/IconProvider/provideIcon";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// English translations
const translations = {
  jobBoard: "Job Board",
  tenders: "Tenders",
  myProjects: "My Projects",
  invoices: "Invoices",
  inbox: "Inbox",
  mySubscription: "My Subscription",
  package: "Package",
  viewProfile: "View Profile",
  accountSettings: "Account Settings",
  billingPlans: "Billing & Plans",
  dashboard: "Dashboard",
  helpSupport: "Help & Support",
  signOut: "Sign Out",
  client: "Client",
};

function ClientNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState({ type: "client" });
  const pathname = usePathname();
  const { data: userData } = useGetMyprofileQuery();
  // Navigation items - only client specific pages
  const navItems = [
    { label: translations.jobBoard, href: `/job-board` },
    { label: translations.tenders, href: `/tenders` },
    { label: translations.myProjects, href: `/my-projects` },
    { label: translations.invoices, href: `/invoices` },
    { label: translations.inbox, href: `/chat` },
    { label: translations.mySubscription, href: `/my-subscription` },
    { label: translations.package, href: `/package` }, // This is the package route
  ];

  // Debug: Check what's in navItems
  console.log("Nav Items:", navItems);
  console.log(
    "Package route exists:",
    navItems.find((item) => item.href === "/package")
  );

  // Helper function to determine if link is active
  const isActiveLink = (href) => {
    return pathname === href;
  };

  // Mock user data
  const user = {
    fullName: userData?.data?.fullName,
    role: translations.client,
    avatar: userData?.data?.profile || "/client/profile/client.png",
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href={`/`}>{provideIcon({ name: "company_logo" })}</Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => {
            console.log(`Rendering: ${item.label} -> ${item.href}`); // Debug each item
            return (
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
            );
          })}
        </div>

        {/* User Profile Section */}
        <div className="hidden lg:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-12">
              <Button
                variant="ghost"
                className="flex items-center space-x-3 shadow-md rounded-full  border hover:bg-gray-50 h-12"
              >
                <Image
                  src={getImageUrl(user.avatar)}
                  alt={user.fullName || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full  object-cover"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#012A8B]">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-[#012A8B] ">{user.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile-client`}
                  className="w-full cursor-pointer"
                >
                  {translations.viewProfile}
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href={`/settings`} className="w-full cursor-pointer">
                  {translations.accountSettings}
                </Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem asChild>
                <Link href={`/billing`} className="w-full cursor-pointer">
                  {translations.billingPlans}
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link href={`/help`} className="w-full cursor-pointer">
                  {translations.helpSupport}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/client-dashboard`}
                  className="w-full cursor-pointer"
                >
                  {translations.dashboard}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/help`} className="w-full cursor-pointer">
                  {translations.helpSupport}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                {translations.signOut}
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
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.fullName || "client"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <DrawerTitle className="text-sm font-medium">
                        {user.fullName || "client"}
                      </DrawerTitle>
                      <p className="text-xs text-gray-500">{user.role}</p>
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
                    <Link href={`/client-profile-private/1`}>
                      {translations.viewProfile}
                    </Link>
                  </Button>
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/settings`}>
                      {translations.accountSettings}
                    </Link>
                  </Button> */}
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/billing`}>{translations.billingPlans}</Link>
                  </Button> */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/help`}>{translations.helpSupport}</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={handleSignOut}
                  >
                    {translations.signOut}
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}

export default ClientNavBar;
