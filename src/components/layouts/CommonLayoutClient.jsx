"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/common/Footer/Footer";
import FreelancerNavBar from "@/components/freelancerNavbar/FreelancerNavbar";
import ClientNavbar from "@/components/client/clientNavbar/ClientNavbar";
import { useSelector } from "react-redux";

export default function CommonLayoutClient({ children }) {
  const [mounted, setMounted] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.currentUser);
  const isLoggedIn = useSelector((state) => state.currentUser.isLoggedIn);
  const isLogedInAsClient = currentUser?.type === "client";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {!isLoggedIn ? (
        <NavBar />
      ) : isLogedInAsClient ? (
        <ClientNavbar />
      ) : (
        <FreelancerNavBar />
      )}
      {children}
      <Footer />
    </>
  );
}
