"use client";

import Providers from "@/components/providers/Providers";
import { usePathname } from "next/navigation";
import Navigation from '../components/navigation/Navigation';

export default function Template({ children }) {
  const pathname = usePathname();

  // Check if current page is an auth page
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <Providers>
      {isAuthPage ? (
        // Auth pages - no navigation
        children
      ) : (
        // Non-auth pages - with navigation
        <Navigation>{children}</Navigation>
        
      )}
    </Providers>
  );
}
