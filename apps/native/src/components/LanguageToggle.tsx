import React from "react";
import { Pressable, Text, View } from "react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language.startsWith("he");

  const toggleLanguage = () => {
    const newLocale = isHebrew ? "en" : "he";
    i18n.changeLanguage(newLocale);
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 50, // adjust for SafeArea if needed
        right: 16,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={toggleLanguage}
        style={{
          backgroundColor: "white",
          padding: 8,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Globe size={20} color="black" />
      </Pressable>
      {/* ✅ Underline current language */}
      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        {isHebrew ? "HE" : "EN"}
      </Text>
    </View>
  );
}
