import SignUpPage from "@/components/auth/signup/SignUpLayout";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPage />
    </Suspense>
  );
}

export default page;
