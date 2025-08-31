import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { fetchQuests } from "../services/questService";

export function MapCanvas() {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ["quests", locale],
    queryFn: () => fetchQuests(locale),
    staleTime: 1000 * 60 * 5,
  });

  // Load Google Maps script on web
  useEffect(() => {
    if (Platform.OS === "web") {
      if (window.google) {
        setGoogleLoaded(true);
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB}`;
        script.async = true;
        script.onload = () => setGoogleLoaded(true);
        document.head.appendChild(script);
      }
    }
  }, []);

  // Place markers on web map
  useEffect(() => {
    if (Platform.OS === "web" && googleLoaded && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 31.78, lng: 35.21 },
        zoom: 8,
      });

      const bounds = new window.google.maps.LatLngBounds();

      quests.forEach((q: any) => {
        const marker = new window.google.maps.Marker({
          position: { lat: q.latitude, lng: q.longitude },
          map,
          title: q.title,
        });

        marker.addListener("click", () => router.push(`/quest/${q.id}`));
        bounds.extend(marker.getPosition()!);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    }
  }, [googleLoaded, quests]);

  // Render branch
  if (Platform.OS === "web") {
    if (!googleLoaded || isLoading) {
      return (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>Loading Google Maps…</Text>
        </View>
      );
    }
    return (
      <div ref={mapRef} style={{ flex: 1, width: "100%", height: "100%" }} />
    );
  }

  // Native (react-native-maps)
  const MapViewModule = require("react-native-maps");
  const MapView = MapViewModule.default || MapViewModule;
  const Marker = MapViewModule.Marker || MapViewModule.default.Marker;

  return (
    <View style={styles.container}>
      <MapView
        key={locale}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 31.78,
          longitude: 35.21,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {quests
          .filter(
            (q) =>
              typeof q.latitude === "number" && typeof q.longitude === "number",
          )
          .map((q) => (
            <Marker
              key={q.id}
              coordinate={{ latitude: q.latitude, longitude: q.longitude }}
              title={q.title || ""}
              description={q.description || ""}
              pinColor="blue"
              onPress={() => router.push(`/quest/${q.id}`)}
            />
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  webFallbackText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
});
