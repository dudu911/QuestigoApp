// src/i18n/DirectionProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isRTL } from "./config";

const DirectionContext = createContext<"ltr" | "rtl">("ltr");

export const DirectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [dir, setDir] = useState<"ltr" | "rtl">(
    isRTL(i18n.language) ? "rtl" : "ltr",
  );

  useEffect(() => {
    setDir(isRTL(i18n.language) ? "rtl" : "ltr");
    if (typeof document !== "undefined") {
      document.dir = isRTL(i18n.language) ? "rtl" : "ltr";
    }
  }, [i18n.language]);

  return (
    <DirectionContext.Provider value={dir}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = () => useContext(DirectionContext);
