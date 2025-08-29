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

//
// 🔹 StyledView
//
interface StyledViewProps {
  children?: React.ReactNode;

  // Flex
  flex?: boolean | number;
  flexDirection?: ViewStyle["flexDirection"];
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];

  // Spacing
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  marginTop?: keyof typeof theme.spacing;
  marginBottom?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;

  // Visuals
  backgroundColor?: string;
  style?: ViewStyle;
  row?: boolean;
}

export const StyledView: React.FC<StyledViewProps> = ({
  children,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  padding,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  backgroundColor,
  style,

  ...props
}) => {
  const dir = useDirection();
  const viewStyle: ViewStyle = {
    ...(flex !== undefined && { flex: typeof flex === "boolean" ? 1 : flex }),
    // flexDirection: dir === "rtl" ? "row-reverse" : "row",
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(padding && { padding: theme.spacing[padding] }),
    ...(margin && { margin: theme.spacing[margin] }),
    ...(marginTop && { marginTop: theme.spacing[marginTop] }),
    ...(marginBottom && { marginBottom: theme.spacing[marginBottom] }),
    ...(marginLeft && { marginLeft: theme.spacing[marginLeft] }),
    ...(marginRight && { marginRight: theme.spacing[marginRight] }),
    ...(backgroundColor && { backgroundColor }),
    ...style,
  };

  return (
    <View style={viewStyle} {...props}>
      {children}
    </View>
  );
};

//
// 🔹 StyledText
//

interface StyledTextProps {
  children: React.ReactNode;
  size?: keyof typeof theme.typography;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  marginBottom?: keyof typeof theme.spacing;
  textAlign?: TextStyle["textAlign"]; // 👈 new
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

//
// 🔹 StyledButton
//
interface StyledButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const StyledButton = React.forwardRef<View, StyledButtonProps>(
  ({ children, variant = "primary", size = "md", ...props }, ref) => {
    const dir = useDirection();
    const buttonStyle: ViewStyle = {
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
