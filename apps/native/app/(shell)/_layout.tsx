import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { MapCanvas } from "../../src/components/MapCanvas";
import { Home, ShoppingCart, Wallet, User } from "lucide-react-native";

export default function ShellLayout() {
  return (
    <View style={styles.container}>
      {/* Persistent background map */}
      <MapCanvas />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size ?? 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="store/index"
          options={{
            title: "Store",
            tabBarIcon: ({ color, size }) => (
              <ShoppingCart color={color} size={size ?? 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="credits/index"
          options={{
            title: "Credits",
            tabBarIcon: ({ color, size }) => (
              <Wallet color={color} size={size ?? 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size ?? 22} />
            ),
          }}
        />
        {/* Map route exists but no tab shown */}
        <Tabs.Screen name="map/index" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
