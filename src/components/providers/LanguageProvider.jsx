"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadMessages,
  initializeLanguage,
} from "../../redux/features/languageSlice";

const LanguageProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentLocale, messages, loading } = useSelector(
    (state) => state.language
  );

  useEffect(() => {
    const initializeLanguageSystem = async () => {
      // Get preferred locale from localStorage or default to 'en'
      const preferredLocale = localStorage.getItem("preferred-locale") || "en";

      // Check if messages are already loaded for this locale
      if (
        messages &&
        Object.keys(messages).length > 0 &&
        currentLocale === preferredLocale
      ) {
        return;
      }

      try {
        // Load messages for the preferred locale
        const result = await dispatch(loadMessages(preferredLocale)).unwrap();

        // Initialize the language system
        dispatch(
          initializeLanguage({
            locale: result.locale,
            messages: result.messages,
          })
        );
      } catch (error) {
        console.error("Failed to initialize language system:", error);
        // Fallback to English if preferred locale fails
        if (preferredLocale !== "en") {
          try {
            const fallbackResult = await dispatch(loadMessages("en")).unwrap();
            dispatch(
              initializeLanguage({
                locale: "en",
                messages: fallbackResult.messages,
              })
            );
          } catch (fallbackError) {
            console.error("Failed to load fallback language:", fallbackError);
          }
        }
      }
    };

    initializeLanguageSystem();
  }, [dispatch]);

  // Show loading state while language is being initialized
  if (loading || Object.keys(messages).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return children;
};

export default LanguageProvider;
