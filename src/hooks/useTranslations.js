"use client";

import { loadMessages } from "@/redux/features/languageSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useTranslations(namespace = "client") {
  const dispatch = useDispatch();
  const [translations, setTranslations] = useState({});
  const messages = useSelector((state) => state.language.messages);
  const currentLocale = useSelector((state) => state.language.currentLocale);

  useEffect(() => {
    // If messages are not loaded, load them
    if (!messages || !messages[namespace]) {
      dispatch(loadMessages(currentLocale));
    }
  }, [currentLocale, namespace, dispatch, messages]);

  useEffect(() => {
    // When messages change, update translations
    if (messages && messages[namespace]) {
      setTranslations(messages[namespace]);
    }
  }, [messages, namespace]);

  // Fallback translations if nothing is loaded
  const fallbackTranslations = {
    client: {
      navbar: {
        jobBoard: "Job Board",
        tenders: "Tenders",
        myProjects: "My Projects",
        invoices: "Invoices",
        inbox: "Inbox",
        mySubscription: "My Subscription",
        viewProfile: "View Profile",
        accountSettings: "Account Settings",
        billingPlans: "Billing & Plans",
        helpSupport: "Help & Support",
        signOut: "Sign Out",
        client: "Client",
      },
    },
  };

  return translations || fallbackTranslations[namespace] || {};
}

export function useNamespaceTranslations(namespace) {
  return useTranslations(namespace);
}
