// packages/ui/src/styled-components.tsx
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

interface StyledViewProps {
  children?: React.ReactNode;
  flex?: number;
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  backgroundColor?: string;
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];
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
  style,
  ...props
}) => {
  const viewStyle: ViewStyle = {
    ...(flex !== undefined && { flex }),
    ...(padding && { padding: theme.spacing[padding] }),
    ...(margin && { margin: theme.spacing[margin] }),
    ...(backgroundColor && { backgroundColor }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...style,
  };

  return (
    <View style={viewStyle} {...props}>
      {children}
    </View>
  );
};

interface StyledTextProps {
  children: React.ReactNode;
  size?: keyof typeof theme.typography;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  marginBottom?: keyof typeof theme.spacing;
  style?: TextStyle;
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  size = "base",
  color = theme.colors.black,
  fontWeight,
  marginBottom,
  style,
  ...props
}) => {
  const textStyle: TextStyle = {
    fontSize: theme.typography[size],
    color,
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

interface StyledButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const StyledButton: React.FC<StyledButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  ...props
}) => {
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
    color: variant === "primary" ? theme.colors.white : theme.colors.gray[800],
    fontSize: theme.typography.base,
    fontWeight: "600",
  };

  return (
    <Pressable style={buttonStyle} {...props}>
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  );
};
