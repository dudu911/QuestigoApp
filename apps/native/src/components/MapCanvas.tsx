// src/components/MapCanvas.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { fetchQuests } from "../services/questService";

// Import react-native-maps at module level to prevent duplicate registration
let NativeMapView: any, NativeMarker: any;
if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  NativeMapView = maps.default;
  NativeMarker = maps.Marker;
}

// --- Helpers for web zoom calculation ---
const WORLD_DIM = { height: 256, width: 256 };
const ZOOM_MAX = 21;

function latRad(lat: number) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function getBoundsZoomLevel(bounds: any, mapDim: any) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;
  const lngDiff = ne.lng() - sw.lng();
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = Math.floor(
    Math.log(mapDim.height / WORLD_DIM.height / latFraction) / Math.LN2,
  );
  const lngZoom = Math.floor(
    Math.log(mapDim.width / WORLD_DIM.width / lngFraction) / Math.LN2,
  );

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

export function MapCanvas() {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  // ✅ Use initial locale only to prevent map crashes
  const [initialLocale] = useState(locale);

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ["quests", initialLocale], // ✅ Use initial locale only
    queryFn: () => fetchQuests(initialLocale),
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Filter and validate quest data to prevent nil objects
  const validQuests = quests.filter((q) => {
    return (
      q &&
      q.id &&
      typeof q.latitude === "number" &&
      typeof q.longitude === "number" &&
      !isNaN(q.latitude) &&
      !isNaN(q.longitude) &&
      q.latitude >= -90 &&
      q.latitude <= 90 &&
      q.longitude >= -180 &&
      q.longitude <= 180
    );
  });

  // --- WEB: load Google Maps script
  useEffect(() => {
    if (Platform.OS !== "web") return;

    if (window.google) {
      setGoogleLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB}`;
      script.async = true;
      script.onload = () => setGoogleLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  // --- WEB: place markers + animated fit bounds with padding
  useEffect(() => {
    if (
      Platform.OS === "web" &&
      googleLoaded &&
      mapRef.current &&
      validQuests.length > 0
    ) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 31.78, lng: 35.21 },
        zoom: 8,
      });

      const bounds = new window.google.maps.LatLngBounds();

      validQuests.forEach((q: any) => {
        const marker = new window.google.maps.Marker({
          position: { lat: q.latitude, lng: q.longitude },
          map,
          title: q.title || "Quest",
        });

        marker.addListener("click", () => router.push(`/quest/${q.id}`));
        bounds.extend(marker.getPosition()!);
      });

      if (!bounds.isEmpty()) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const latMargin = (ne.lat() - sw.lat()) * 0.1;
        const lngMargin = (ne.lng() - sw.lng()) * 0.1;

        const extendedBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(
            sw.lat() - latMargin,
            sw.lng() - lngMargin,
          ),
          new window.google.maps.LatLng(
            ne.lat() + latMargin,
            ne.lng() + lngMargin,
          ),
        );

        const targetCenter = extendedBounds.getCenter();

        const mapDim = {
          height: mapRef.current.offsetHeight,
          width: mapRef.current.offsetWidth,
        };

        const targetZoom = getBoundsZoomLevel(extendedBounds, mapDim);

        map.panTo(targetCenter);

        let currentZoom = map.getZoom()!;
        const step = targetZoom > currentZoom ? 1 : -1;

        const interval = setInterval(() => {
          if (
            (step > 0 && currentZoom >= targetZoom) ||
            (step < 0 && currentZoom <= targetZoom)
          ) {
            clearInterval(interval);
            return;
          }
          currentZoom += step;
          map.setZoom(currentZoom);
        }, 80);
      }
    }
  }, [googleLoaded, validQuests]);

  // --- NATIVE: refit bounds when screen regains focus
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web") return;
      if (!mapRef.current || validQuests.length === 0) return;

      // ✅ Delay ensures map is mounted before fitting
      const timer = setTimeout(() => {
        const lats = validQuests.map((q: any) => q.latitude);
        const lngs = validQuests.map((q: any) => q.longitude);

        if (lats.length === 0 || lngs.length === 0) return;

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const latPadding = (maxLat - minLat) * 0.1;
        const lngPadding = (maxLng - minLng) * 0.1;

        mapRef.current.fitToCoordinates(
          [
            { latitude: minLat - latPadding, longitude: minLng - lngPadding },
            { latitude: maxLat + latPadding, longitude: maxLng + lngPadding },
          ],
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          },
        );
      }, 50);

      return () => clearTimeout(timer);
    }, [validQuests]),
  );

  // --- WEB RENDER ---
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

  // --- NATIVE RENDER ---
  return (
    <View style={styles.container}>
      <NativeMapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 31.78,
          longitude: 35.21,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {validQuests.map((q) => (
          <NativeMarker
            key={q.id}
            coordinate={{
              latitude: q.latitude,
              longitude: q.longitude,
            }}
            title={q.title || "Quest"}
            description={q.description || ""}
            pinColor="blue"
            onPress={() => router.push(`/quest/${q.id}`)}
          />
        ))}
      </NativeMapView>
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
