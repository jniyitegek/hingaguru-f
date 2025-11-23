"use client";

import React, { createContext, useContext, useState } from "react";
import en from "@/locales/en.json";
import rw from "@/locales/rw.json";

type LocaleKey = "en" | "rw";

type LocaleShape = Record<string, unknown>;

const LOCALES: Record<LocaleKey, LocaleShape> = {
  en,
  rw,
};

interface LocaleContextValue {
  locale: LocaleKey;
  setLocale: (l: LocaleKey) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const defaultValue: LocaleContextValue = {
  locale: "en",
  setLocale: () => {},
  t: (k: string) => k,
};

const LocaleContext = createContext<LocaleContextValue>(defaultValue);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<LocaleKey>(() => {
    try {
      const stored = localStorage.getItem("locale");
      if (stored === "rw" || stored === "en") return stored;
    } catch {}
    return "en";
  });

  function setLocale(l: LocaleKey) {
    setLocaleState(l);
    try {
      localStorage.setItem("locale", l);
    } catch {}
  }

  function t(key: string, vars?: Record<string, string>) {
    const parts = key.split(".");
  let node: unknown = LOCALES[locale];
    for (const p of parts) {
      if (node && typeof node === "object" && p in (node as Record<string, unknown>)) {
  node = (node as Record<string, unknown>)[p];
      } else return key;
    }
    let str = typeof node === "string" ? node : key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        str = str.replace(`{${k}}`, String(vars[k]));
      }
    }
    return str;
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);
