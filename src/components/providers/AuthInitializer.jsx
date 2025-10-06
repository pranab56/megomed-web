"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setInitialized } from "../../features/auth/authSlice";
import { setCurrentUser } from "../../redux/features/currentUser/currentuserSlice";
import { getToken, isAuthenticated } from "../../features/auth/authService";

export default function AuthInitializer({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user is authenticated
        const token = getToken();
        const isAuth = isAuthenticated();

        if (token && isAuth) {
          // Get user data from localStorage
          const userId = localStorage.getItem("user");
          const userRole = localStorage.getItem("role");

          if (userId && userRole) {
            // Set token in Redux store
            dispatch(setToken(token));

            // Set current user in Redux store
            dispatch(
              setCurrentUser({
                _id: userId,
                role: userRole,
              })
            );
          }
        }

        // Mark auth as initialized
        dispatch(setInitialized(true));
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(setInitialized(true));
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
