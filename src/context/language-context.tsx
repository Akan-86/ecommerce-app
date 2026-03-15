"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";

type Lang = "en" | "tr";

const dictionaries = {
  en,
  tr,
};

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// translation helper
export function useTranslations() {
  const { lang } = useLanguage();

  function t(path: string): string {
    const keys = path.split(".");
    let value: any = dictionaries[lang];

    for (const key of keys) {
      value = value?.[key];
    }

    if (typeof value === "string") return value;

    return path; // fallback
  }

  return t;
}
