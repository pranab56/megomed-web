"use client";

import ClientNavBar from "@/components/client/clientNavbar/ClientNavbar";
import Footer from "@/components/common/Footer/Footer";
import FreelancerNavBar from "@/components/freelancerNavbar/FreelancerNavbar";
import NavBar from "@/components/navbar/NavBar";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CompanyNavbar from "../company/companyNavbar/CompanyNavbar";

export default function Navigation({ children }) {
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get auth state from Redux
  const authState = useSelector((state) => state.auth);
  const currentUserState = useSelector((state) => state.currentUser);

  // Use effect to set mounted state and get localStorage data
  useEffect(() => {
    setMounted(true);

    // Use Redux state if available, otherwise fallback to localStorage
    if (currentUserState?.currentUser?.role) {
      setCurrentUser(currentUserState.currentUser.role);
    } else {
      setCurrentUser(localStorage.getItem("role"));
    }

    // Optional: Return cleanup function
    return () => {
      setMounted(false);
    };
  }, [currentUserState]);

  // Memoize navbar selection to prevent unnecessary re-renders
  const NavbarComponent = useMemo(() => {
    if (!currentUser) {
      return NavBar;
    }
    return currentUser === "client"
      ? ClientNavBar
      : currentUser === "company"
      ? CompanyNavbar
      : FreelancerNavBar;
  }, [currentUser]);

  // Prevent rendering before mounting to avoid hydration issues
  if (!mounted || !authState.isInitialized) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-16 bg-white border-b border-gray-200" />{" "}
        {/* Navbar placeholder */}
        <div className="flex-grow">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarComponent />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
