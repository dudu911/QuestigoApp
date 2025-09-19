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
import useDirection from "../../../apps/native/src/i18n";

// ---------------- StyledView ----------------
interface StyledViewProps {
  children?: React.ReactNode;
  direction?: "ltr" | "rtl";
  flex?: boolean | number;
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  marginTop?: keyof typeof theme.spacing;
  marginBottom?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
  backgroundColor?: string;
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];
  row?: boolean;
  style?: ViewStyle;
}

export const StyledView: React.FC<StyledViewProps> = ({
  children,
  direction = "ltr",
  flex,
  padding,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  backgroundColor,
  alignItems,
  justifyContent,
  row,
  style,
  ...props
}) => {
  const viewStyle: ViewStyle = {
    ...(flex && { flex: typeof flex === "number" ? flex : 1 }),
    ...(padding && { padding: theme.spacing[padding] }),
    ...(margin && { margin: theme.spacing[margin] }),
    ...(marginTop && { marginTop: theme.spacing[marginTop] }),
    ...(marginBottom && { marginBottom: theme.spacing[marginBottom] }),
    ...(marginLeft && { marginLeft: theme.spacing[marginLeft] }),
    ...(marginRight && { marginRight: theme.spacing[marginRight] }),
    ...(backgroundColor && { backgroundColor }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(row && { flexDirection: direction === "rtl" ? "row-reverse" : "row" }),
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
  textAlign = "left", // Default to left
  style,
  ...props
}) => {
  const textStyle: TextStyle = {
    fontSize: theme.typography[size],
    color,
    textAlign,
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

export interface StyledButtonProps extends PressableProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const StyledButton = React.forwardRef<View, StyledButtonProps>(
  ({ children, variant = "primary", size = "md", style, ...props }, ref) => {
    const buttonStyle: ViewStyle = {
      flexDirection: "row", // Always left-to-right for now
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
      textAlign: "center",
    };

    return (
      <Pressable
        ref={ref}
        style={
          typeof style === "function"
            ? (state) => [buttonStyle, style(state)]
            : [buttonStyle, style]
        }
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text style={textStyle}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
StyledButton.displayName = "StyledButton";