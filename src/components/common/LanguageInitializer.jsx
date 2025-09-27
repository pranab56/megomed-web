"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  initializeLanguage,
  loadMessages,
} from "@/redux/features/languageSlice";

export default function LanguageInitializer({
  initialLocale,
  initialMessages,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("LanguageInitializer - Initializing with:", {
      initialLocale,
      initialMessages,
    });

    // Check localStorage for saved preference first
    const savedLocale = localStorage.getItem("preferred-locale");
    console.log(
      "LanguageInitializer - Saved locale from localStorage:",
      savedLocale
    );

    // Determine which locale to use
    const targetLocale =
      savedLocale && ["en", "fr"].includes(savedLocale)
        ? savedLocale
        : initialLocale || "en";

    console.log("LanguageInitializer - Target locale:", targetLocale);

    // Use the loadMessages async thunk to properly load messages into Redux
    dispatch(loadMessages(targetLocale)).then((result) => {
      console.log("LanguageInitializer - loadMessages result:", result);
      if (result.payload) {
        console.log("LanguageInitializer - Messages loaded successfully:", {
          locale: result.payload.locale,
          hasClient: !!result.payload.messages.client,
          hasProfilePrivate: !!result.payload.messages.client?.profilePrivate,
          profilePrivateKeys: result.payload.messages.client?.profilePrivate
            ? Object.keys(result.payload.messages.client.profilePrivate)
            : "N/A",
        });
      }
    });
  }, [dispatch, initialLocale, initialMessages]);

  return null; // This component doesn't render anything
}
