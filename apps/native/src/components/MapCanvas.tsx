import { View, StyleSheet, Platform, Text } from "react-native";
import { useEffect, useState } from "react";

export function MapCanvas() {
  const [googleLoaded, setGoogleLoaded] = useState(false);

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

  if (Platform.OS === "web") {
    if (!googleLoaded) {
      return <Text>Loading Google Maps...</Text>;
    }

    const GoogleMap = require("react-native-web-maps").default;

    return (
      <View style={styles.container}>
        <GoogleMap
          initialRegion={{
            latitude: 32.0853,
            longitude: 34.7818,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{ width: "100%", height: 400 }}
        />
      </View>
    );
  }

  try {
    const MapViewModule = require("react-native-maps");
    const MapView = MapViewModule.default || MapViewModule;

    return (
      <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 32.0853,
            longitude: 34.7818,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType="standard"
        />
      </View>
    );
  } catch (e) {
    console.log("MapCanvas error:", e);
    return (
      <View style={[styles.container, styles.fallback]}>
        <Text style={styles.fallbackText}>Loading map...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  fallback: { justifyContent: "center", alignItems: "center", padding: 20 },
  fallbackText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  webFallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  webFallbackText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
