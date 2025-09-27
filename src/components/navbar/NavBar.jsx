"use client";

import LanguageSelector from "@/components/common/LanguageSelector";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import provideIcon from "@/utils/IconProvider/provideIcon";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LiaUserTieSolid } from "react-icons/lia";

function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [searchUserType, setSearchUserType] = useState("Freelancer");

  // Scroll effect
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Navigation items for public (not logged in)
  const publicNavItems = useMemo(
    () => [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
    ],
    []
  );

  const serviceItems = useMemo(
    () => [
      { label: "Hire Top Talent", href: "/find-top-talent" },
      { label: "See Our Services", href: "/services" },
    ],
    []
  );

  const getNavItems = useCallback(() => {
    return publicNavItems;
  }, [publicNavItems]);

  const isServicesActive = useMemo(
    () => serviceItems.some((item) => pathname === item.href),
    [serviceItems, pathname]
  );

  const isActiveLink = useCallback(
    (href) => {
      if (href === "/") return pathname === "/";
      return pathname === href;
    },
    [pathname]
  );

  // Toggle user type (freelancer/client) - local state only
  const [userType, setUserType] = useState("freelancer");
  const toggleUserType = useCallback(() => {
    setUserType((prev) => (prev === "freelancer" ? "client" : "freelancer"));
  }, []);

  // Search Component
  const SearchBarWithDropdown = ({ isMobile = false }) => {
    const [searchValue, setSearchValue] = useState("");

    return (
      <div className={`search-dropdown-container relative ${isMobile ? 'w-full' : 'hidden lg:flex'} items-center border border-gray-300 rounded-lg overflow-hidden bg-white ${isMobile ? '' : 'shadow-sm'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className={`pl-10 pr-4 py-2 border-none focus:outline-none focus:ring-0 text-gray-700 bg-transparent ${isMobile ? 'w-full' : 'w-48 xl:w-64'}`}
            autoComplete="off"
          />
        </div>

        <div className="h-6 w-px bg-gray-300 pointer-events-none"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 min-w-[120px] h-auto border-none rounded-none focus:outline-none focus:bg-gray-50"
            >
              <span className="mr-2 select-none">{searchUserType}</span>
              <ChevronDown className="h-4 w-4 text-gray-400 select-none" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[120px] rounded-t-none border-t-0" style={{ marginTop: '-1px' }}>
            {["Freelancer", "Client"].map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setSearchUserType(option)}
                className={`cursor-pointer select-none ${searchUserType === option ? 'bg-blue-50 text-blue-600 focus:bg-blue-50 focus:text-blue-600' : 'text-gray-700'}`}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  // Always render public navbar (since we removed login state)
  return (
    <nav className={`w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            {provideIcon({ name: "company_logo" })}
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          {getNavItems().map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`font-medium transition-colors whitespace-nowrap ${isActiveLink(item.href)
                ? "text-blue-600 hover:text-blue-700"
                : "text-gray-700 hover:text-gray-900"
                }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`p-0 h-auto font-medium hover:bg-transparent text-md whitespace-nowrap ${isServicesActive
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {serviceItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link
                    href={item.href}
                    className={`w-full cursor-pointer ${isActiveLink(item.href) ? "text-blue-600" : ""}`}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side - Search, Language, Auth */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>

          <SearchBarWithDropdown />

          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="whitespace-nowrap">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="button-gradient whitespace-nowrap">
              <Link href="/auth/sign-up" className="flex items-center">
                Sign Up
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <div className="lg:hidden">
            <LanguageSelector />
          </div>

          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh] overflow-y-auto">
              <DrawerHeader className="text-left">
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <div className="px-6 pb-6 space-y-4">
                <SearchBarWithDropdown isMobile={true} />

                <div className="space-y-2">
                  {getNavItems().map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-start ${isActiveLink(item.href) ? "bg-blue-50 text-blue-600" : ""}`}
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </Button>
                  ))}

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${isServicesActive ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                    >
                      Services
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${isMobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </Button>
                    {isMobileServicesOpen && (
                      <div className="pl-4 space-y-1">
                        {serviceItems.map((item, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className={`w-full justify-start text-sm ${isActiveLink(item.href) ? "bg-blue-50 text-blue-600" : ""}`}
                            asChild
                            onClick={() => setIsOpen(false)}
                          >
                            <Link href={item.href}>{item.label}</Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={toggleUserType}
                >
                  {userType === "freelancer" ? (
                    <User className="mr-2 h-4 w-4" />
                  ) : (
                    <LiaUserTieSolid className="mr-2 h-4 w-4" />
                  )}
                  {userType === "freelancer" ? "Freelancer" : "Client"}
                </Button>

                <div className="space-y-2 pt-4 border-t">
                  <Button variant="ghost" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/sign-up" className="flex items-center justify-center">
                      Sign Up
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
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

export default React.memo(NavBar);