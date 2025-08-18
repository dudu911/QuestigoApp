import React from "react";
import { View, Text } from "react-native";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export function MapCanvas() {
  // Tel Aviv coordinates (same as native implementation)
  const mapCenter = {
    lat: 32.0853,
    lng: 34.7818,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Text>Loading Google Maps...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      />
    </View>
  );
}
