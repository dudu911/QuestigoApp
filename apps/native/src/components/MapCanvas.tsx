import React from "react";
import MapView, { Marker } from "react-native-maps";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

export function MapCanvas() {
  const quests = useAppSelector((state: RootState) => state.quest.quests);
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  return (
    <MapView
      style={{ flex: 1 }}
      //provider="google"
      initialRegion={{
        latitude: 31.78, // Default center (Jerusalem)
        longitude: 35.21,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      }}
    >
      {quests.map((q) => {
        const tr =
          q.translations.find((tr) => tr.locale === locale) ??
          q.translations[0];

        if (!q.latitude || !q.longitude) return null;

        return (
          <Marker
            key={q.id}
            coordinate={{
              latitude: q.latitude,
              longitude: q.longitude,
            }}
            title={tr?.title ?? "Untitled Quest"}
            description={`${t(`cities.${q.cityKey}`)}, ${t(`countries.${q.countryCode}`)}`}
            pinColor="blue"
            onPress={() => router.push(`/quest/${q.id}`)} // ✅ navigate to quest modal
          />
        );
      })}
    </MapView>
  );
}
