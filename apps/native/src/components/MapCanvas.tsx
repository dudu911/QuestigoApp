import { View, StyleSheet, Platform } from "react-native";
import { StyledText } from "@repo/ui";

export function MapCanvas() {
  // For now, show a placeholder for all platforms until expo-maps is properly configured
  // This ensures the app works while we're developing the shell structure
  return (
    <View style={[styles.container, styles.webPlaceholder]}>
      <View style={styles.mapOverlay}>
        <StyledText size="lg" color="white" style={{ textAlign: "center" }}>
          🗺️ Questigo World Map
        </StyledText>
        <StyledText
          size="sm"
          color="#ccc"
          style={{ textAlign: "center", marginTop: 8 }}
        >
          {Platform.OS === "web"
            ? "Interactive maps available on mobile"
            : "Real maps coming soon!"}
        </StyledText>
        <StyledText
          size="xs"
          color="#888"
          style={{ textAlign: "center", marginTop: 12 }}
        >
          Shell navigation working ✅
        </StyledText>
      </View>
    </View>
  );

  // TODO: Enable when expo-maps is properly configured
  // For now, keeping this commented out to avoid native module errors
  /*
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <View style={styles.mapOverlay}>
          <StyledText size="lg" color="white" style={{ textAlign: "center" }}>
            🗺️ Questigo World Map
          </StyledText>
          <StyledText size="sm" color="#ccc" style={{ textAlign: "center", marginTop: 8 }}>
            Interactive maps available on mobile
          </StyledText>
        </View>
      </View>
    );
  }

  try {
    const ExpoMaps = require("expo-maps");
    
    if (!ExpoMaps || (!ExpoMaps.GoogleMaps && !ExpoMaps.AppleMaps)) {
      return placeholder;
    }

    const { GoogleMaps, AppleMaps } = ExpoMaps;
    const MapView = Platform.OS === "ios" ? AppleMaps.View : GoogleMaps.View;

    return (
      <View style={styles.container}>
        <MapView style={StyleSheet.absoluteFill} />
      </View>
    );
  } catch (error) {
    console.log("Maps module not available:", error);
    return placeholder;
  }
  */
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  mapOverlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
});
