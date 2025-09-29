import ResetPasswordForm from "@/components/auth/resetpassword/ResetPassword";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default page;
