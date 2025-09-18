// src/components/LanguageToggle.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language.startsWith("he");

  const toggleLanguage = async () => {
    try {
      const newLocale = isHebrew ? "en" : "he";
      console.log("[LanguageToggle] changing language:", newLocale);

      // ✅ Add delay to prevent race conditions with map re-rendering
      await new Promise((resolve) => setTimeout(resolve, 100));
      await i18n.changeLanguage(newLocale);

      console.log("[LanguageToggle] language changed successfully");
    } catch (error) {
      console.error("[LanguageToggle] Error changing language:", error);
    }
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
