import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

export function MapCanvas() {
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
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
