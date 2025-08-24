import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { MapCanvas } from "../../src/components/MapCanvas";
import { Home, ShoppingCart, User } from "lucide-react-native";

export default function ShellLayout() {
  return (
    <View style={styles.container}>
      {/* Background map is always mounted */}
      <MapCanvas />

      {/* Tabs overlay on top of the map */}
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
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size ?? 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            title: "Store",
            tabBarIcon: ({ color, size }) => (
              <ShoppingCart color={color} size={size ?? 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size ?? 22} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
