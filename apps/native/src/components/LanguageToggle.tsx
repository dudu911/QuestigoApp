import React from "react";
import { Pressable } from "react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLocale = i18n.language.startsWith("he") ? "en" : "he";
    i18n.changeLanguage(newLocale);
  };

  return (
    <Pressable
      onPress={toggleLanguage}
      style={{
        position: "absolute",
        top: 50, // adjust for SafeArea if needed
        right: 16,
        backgroundColor: "white",
        padding: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android shadow
      }}
    >
      <Globe size={20} color="black" />
    </Pressable>
  );
}
