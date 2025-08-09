import React, { createContext, useContext, ReactNode } from "react";
import { theme as defaultTheme, type Theme } from "./theme";

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export function ThemeProvider({
  children,
  theme = defaultTheme,
}: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Re-export theme for convenience
export { theme as defaultTheme } from "./theme";
