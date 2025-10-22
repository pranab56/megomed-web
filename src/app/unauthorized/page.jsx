"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <ShieldX className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You are not authorized to view this content. Please contact the
            administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>

          <Button onClick={handleGoBack} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          You will be automatically redirected to the home page in 10 seconds.
        </p>
      </div>
    </div>
  );
}
