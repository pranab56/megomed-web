"use client";
import "../globals.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AuthProvider from "@/components/providers/AuthProvider";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up";
  const isLogin = pathname === "/login";
  const isForgotPassword = pathname === "/forgot-password";
  const isResetPassword = pathname === "/reset-password";
  const isVerifyEmail = pathname === "/verify-email";

  const textContent = {
    login: {
      image: "/auth/login.png",
      title: "Welcome Back",
      description:
        "Log in to connect with verified professionals, manage projects, and collaborate easily. Lunq offers secure payments, direct contracts, and zero commission—giving you full control over your work and earnings.",
    },
    signup: {
      image: "/auth/sign_up.png",
      title: "Create Your Account",
      description:
        "Join Lunq to connect with verified professionals, collaborate easily, and manage projects seamlessly. Enjoy direct contracts, secure payments, and zero commissions—keeping full control of your work and earnings.",
    },
    forgotPassword: {
      image: "/auth/forgot_password.png",
      title: "Forgot Password",
      description:
        "Enter your registered email address, and we’ll send you a secure link to reset your password and regain access to your Lunq account.",
    },
    resetPassword: {
      image: "/auth/password_reset.png",
      title: "Reset Password",
      description:
        "Enter your new password, and we’ll update your account to keep your work and earnings secure.",
    },
    verifyEmail: {
      image: "/auth/verify_email.png",
      title: "Verify Your Email",
      description:
        "A password reset Code has been sent to [your email]. Check your inbox and follow the instructions to Verify Your Account. Didn’t get the email? Check spam or resend below.",
    },
  };

  return (
    <AuthProvider>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white to-white">
        {/* Background geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large blue circle - bottom left */}
          <div className="absolute -bottom-32 -left-32 w-64 h-64 md:w-96 md:h-96 lg:w-130 lg:h-130 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full z-10"></div>

          {/* Medium blue circle - top right */}
          <div className="absolute -mt-28 -left-0 w-64 h-64 md:w-96 md:h-96 lg:w-220 lg:h-220 rounded-br-[300px] md:rounded-br-[400px] lg:rounded-br-[600px] rounded-r-[150px] md:rounded-r-[200px] lg:rounded-r-[300px] bg-gradient-to-r from-blue-900 to-blue-600"></div>

          {/* Purple gradient circle - bottom right */}
          <div className="absolute -bottom-32 -right-24 w-64 h-64 md:w-96 md:h-96 lg:w-130 lg:h-130 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full z-10"></div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen py-8">
          {/* Left side - Welcome content (hidden on mobile) */}
          <div className="lg:flex hidden max-w-2xl flex-col gap-3 lg:-mt-[350px] md:-mt-[300px] -mt-0 w-full text-white">
            {/* 3D illustration placeholder */}
            <div className="w-full flex justify-center items-center ">
              <div className="w-34 h-34 md:w-40 md:h-40 lg:w-48 lg:h-48  flex items-center justify-center ">
                <Image
                  src={
                    textContent[
                      isSignUp
                        ? "signup"
                        : isForgotPassword
                        ? "forgotPassword"
                        : isResetPassword
                        ? "resetPassword"
                        : isVerifyEmail
                        ? "verifyEmail"
                        : "login"
                    ].image
                  }
                  width={300}
                  height={300}
                  alt="login"
                  className="w-34 h-34 md:w-40 md:h-40 lg:w-48 lg:h-48"
                />
              </div>
            </div>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center ">
              {
                textContent[
                  isSignUp
                    ? "signup"
                    : isForgotPassword
                    ? "forgotPassword"
                    : isResetPassword
                    ? "resetPassword"
                    : isVerifyEmail
                    ? "verifyEmail"
                    : "login"
                ].title
              }
            </h1>

            <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed block opacity-90 text-center">
              {
                textContent[
                  isSignUp
                    ? "signup"
                    : isForgotPassword
                    ? "forgotPassword"
                    : isResetPassword
                    ? "resetPassword"
                    : isVerifyEmail
                    ? "verifyEmail"
                    : "login"
                ].description
              }
            </p>
            <div>
              <Image
                className="absolute left-[500px] -mt-8"
                src={"/auth/chat.png"}
                width={300}
                height={350}
                alt="Chat Icons"
              />
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex-shrink-0 w-full rounded-xl shadow-2xl bg-white max-w-md md:max-w-lg lg:ml-8">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
