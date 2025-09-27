"use client";

import ClientNavBar from "@/components/client/clientNavbar/ClientNavbar";
import Footer from "@/components/common/Footer/Footer";
import FreelancerNavBar from "@/components/freelancerNavbar/FreelancerNavbar";
import NavBar from "@/components/navbar/NavBar";
import { useEffect, useMemo, useState } from "react";

export default function Navigation({ children }) {
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Use effect to set mounted state and get localStorage data
  useEffect(() => {
    setMounted(true);
    setCurrentUser(localStorage.getItem("role"));

    // Optional: Return cleanup function
    return () => {
      setMounted(false);
    };
  }, []);

  // Memoize navbar selection to prevent unnecessary re-renders
  const NavbarComponent = useMemo(() => {
    if (!currentUser) {
      return NavBar;
    }
    return currentUser === "client" ? ClientNavBar : FreelancerNavBar;
  }, [currentUser]);

  // Prevent rendering before mounting to avoid hydration issues
  if (!mounted) {
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