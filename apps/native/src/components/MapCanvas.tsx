import { View, StyleSheet, Platform, Text } from "react-native";

export function MapCanvas() {
  // Early return for web platform to avoid any native module imports
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.webFallback]}>
        <Text style={styles.webFallbackText}>
          Maps are not supported on web platform.{"\n"}
          Please use the mobile app to view maps.
        </Text>
      </View>
    );
  }

  // For native platforms, try to load react-native-maps
  try {
    const MapViewModule = require("react-native-maps");

    // Handle different export patterns
    let MapView;
    if (MapViewModule && typeof MapViewModule === "object") {
      // Try default export first, then named export, then the module itself
      MapView = MapViewModule.default || MapViewModule.MapView || MapViewModule;
    } else {
      MapView = MapViewModule;
    }

    // Ensure MapView is a valid React component
    if (!MapView || typeof MapView !== "function") {
      console.log("MapView is not a valid component:", typeof MapView);
      return (
        <View style={[styles.container, styles.fallback]}>
          <Text style={styles.fallbackText}>Map module not available</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 32.0853, // Tel Aviv coordinates as default
            longitude: 34.7818,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType="standard"
          showsUserLocation={false}
          followsUserLocation={false}
          showsMyLocationButton={false}
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
  fallback: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
