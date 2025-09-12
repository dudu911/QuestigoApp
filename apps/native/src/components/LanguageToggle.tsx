// src/components/LanguageToggle.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language.startsWith("he");

  const toggleLanguage = () => {
    const newLocale = isHebrew ? "en" : "he";
    console.log("[LanguageToggle] changing language:", newLocale);
    i18n.changeLanguage(newLocale);
  };

  return (
    <Pressable
      onPress={toggleLanguage}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 8, // spacing before the user button
      }}
    >
      <Globe size={18} color="black" style={{ marginRight: 4 }} />
      <Text style={{ fontSize: 12, fontWeight: "600" }}>
        {isHebrew ? "HE" : "EN"}
      </Text>
    </Pressable>
  );
}
