"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

const locales = [
  { code: "tr", label: "Türkçe", flag: "/icons/flags/tr.svg" },
  { code: "en", label: "English", flag: "/icons/flags/en.svg" },
];

export function LanguageSwitcher() {
  const currentLocale = useLocale();

  return (
    <div className="flex gap-2 items-center">
      {locales.map(({ code, label, flag }) => (
        <Link
          key={code}
          href={`/${code}`}
          className={`flex items-center gap-1 px-2 py-1 rounded border text-sm ${
            currentLocale === code
              ? "border-blue-600 font-semibold"
              : "border-gray-300"
          } hover:bg-gray-100 dark:hover:bg-gray-800 transition`}
          aria-label={`Switch to ${label}`}
        >
          <Image
            src={flag}
            alt={label}
            width={20}
            height={14}
            className="rounded-sm"
            priority
          />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
