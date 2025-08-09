import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "./en.json";
import he from "./he.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: Localization.getLocales()[0]?.languageCode === "he" ? "he" : "en",
  fallbackLng: "en",
  resources: { en: { translation: en }, he: { translation: he } },
  interpolation: { escapeValue: false },
});

export default i18n;
