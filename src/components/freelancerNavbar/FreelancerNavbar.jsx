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

function FreelancerNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation items in English
  const navItems = [
    {
      label: "Job Board",
      href: `/job-board`,
    },
    {
      label: "Tenders",
      href: `/tenders`,
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

  // Helper function to determine if link is active
  const isActiveLink = (href) => {
    return pathname === href;
  };

  // Mock user data
  const user = {
    name: "Sabbir Ahmed",
    role: "UI/UX Designer",
    avatar: "/client/profile/client.png",
  };

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/auth/login")
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
              className={`font-medium transition-colors ${isActiveLink(item.href)
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
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={`/profile`} className="w-full cursor-pointer">
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/settings`} className="w-full cursor-pointer">
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/billing`} className="w-full cursor-pointer">
                  Billing & Plans
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/help`} className="w-full cursor-pointer">
                  Help & Support
                </Link>
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
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <DrawerTitle className="text-sm font-medium">
                        {user.name}
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
                    className={`w-full justify-start ${isActiveLink(item.href) ? "bg-blue-50 text-blue-600" : ""
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
                  >
                    <Link href={`/settings`}>Account Settings</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/billing`}>Billing & Plans</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/help">Help & Support</Link>
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
    </nav>
  );
}

export default FreelancerNavBar;