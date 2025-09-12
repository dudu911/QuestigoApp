// app/(shell)/_layout.tsx
import { View, StyleSheet, Pressable } from "react-native";
import { router, Tabs } from "expo-router";
import { MapCanvas } from "../../src/components/MapCanvas";
import { Home, ShoppingCart, Wallet, User } from "lucide-react-native";
import { LanguageToggle } from "../../src/components/LanguageToggle";
import { StyledText } from "@repo/ui";
import { useAppSelector } from "@redux/hooks";

export default function ShellLayout() {
  const currentUser = useAppSelector((s) => s.auth.user);

  return (
    <View style={styles.container}>
      {/* Persistent background map */}
      <MapCanvas />

      {/* Custom header */}
      <View style={styles.header}>
        <StyledText size="lg" fontWeight="bold">
          Questigo
        </StyledText>
        <View style={styles.headerRight}>
          <LanguageToggle />
          <Pressable
            onPress={() => router.push("/(modals)/swtichUser/switch-user")}
            style={{ marginLeft: 12 }}
          >
            <StyledText size="sm">
              👤 {currentUser?.username ?? "Guest"}
            </StyledText>
          </Pressable>
        </View>
      </View>

      {/* Bottom tabs */}
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
        {/* ✅ Removed map/index screen to avoid duplicate MapCanvas */}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
