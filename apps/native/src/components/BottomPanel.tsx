import React from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

type Props = { children?: React.ReactNode };

export function BottomPanel({ children }: Props) {
  return (
    <Animated.View style={styles.panel}>
      <View style={styles.inner}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "white",
    padding: 16,
    minHeight: 120,
  },
  inner: { gap: 12 },
});
