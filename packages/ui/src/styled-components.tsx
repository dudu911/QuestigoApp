import React from "react";
import {
  View,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  PressableProps,
} from "react-native";
import { theme } from "./theme";
import { useDirection } from "../../../apps/native/src/i18n/DirectionProvider";

// ---------------- StyledView ----------------
interface StyledViewProps {
  children?: React.ReactNode;
  flex?: number | boolean;
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  backgroundColor?: string;
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];
  row?: boolean; // 👈 auto RTL row
  style?: ViewStyle;
}

export const StyledView: React.FC<StyledViewProps> = ({
  children,
  flex,
  padding,
  margin,
  backgroundColor,
  alignItems,
  justifyContent,
  row,
  style,
  ...props
}) => {
  const dir = useDirection();

  const viewStyle: ViewStyle = {
    ...(flex && { flex: typeof flex === "number" ? flex : 1 }),
    ...(padding && { padding: theme.spacing[padding] }),
    ...(margin && { margin: theme.spacing[margin] }),
    ...(backgroundColor && { backgroundColor }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(row && { flexDirection: dir === "rtl" ? "row-reverse" : "row" }),
    ...style,
  };

  return (
    <View style={viewStyle} {...props}>
      {children}
    </View>
  );
};

// ---------------- StyledText ----------------
interface StyledTextProps {
  children: React.ReactNode;
  size?: keyof typeof theme.typography;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  marginBottom?: keyof typeof theme.spacing;
  textAlign?: TextStyle["textAlign"];
  style?: TextStyle;
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  size = "base",
  color = theme.colors.black,
  fontWeight,
  marginBottom,
  textAlign,
  style,
  ...props
}) => {
  const dir = useDirection();

  const textStyle: TextStyle = {
    fontSize: theme.typography[size],
    color,
    textAlign: textAlign ?? (dir === "rtl" ? "right" : "left"),
    ...(fontWeight && { fontWeight }),
    ...(marginBottom && { marginBottom: theme.spacing[marginBottom] }),
    ...style,
  };

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

// ---------------- StyledButton ----------------
interface StyledButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const StyledButton = React.forwardRef<View, StyledButtonProps>(
  ({ children, variant = "primary", size = "md", ...props }, ref) => {
    const dir = useDirection();

    const buttonStyle: ViewStyle = {
      flexDirection: dir === "rtl" ? "row-reverse" : "row", // 👈 flip content
      paddingHorizontal:
        size === "sm"
          ? theme.spacing.sm
          : size === "lg"
            ? theme.spacing.lg
            : theme.spacing.md,
      paddingVertical:
        size === "sm"
          ? theme.spacing.xs
          : size === "lg"
            ? theme.spacing.md
            : theme.spacing.sm,
      borderRadius: 8,
      backgroundColor:
        variant === "primary" ? theme.colors.orange : theme.colors.gray[200],
      alignItems: "center",
      justifyContent: "center",
    };

    const textStyle: TextStyle = {
      color:
        variant === "primary" ? theme.colors.white : theme.colors.gray[800],
      fontSize: theme.typography.base,
      fontWeight: "600",
      textAlign: dir === "rtl" ? "right" : "left",
    };

    return (
      <Pressable ref={ref} style={buttonStyle} {...props}>
        <Text style={textStyle}>{children}</Text>
      </Pressable>
    );
  },
);

StyledButton.displayName = "StyledButton";
