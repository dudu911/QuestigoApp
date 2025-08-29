export type SupportedLanguages = "en" | "he";

export const languageMeta: Record<SupportedLanguages, { dir: "ltr" | "rtl" }> =
  {
    en: { dir: "ltr" },
    he: { dir: "rtl" },
  };

export function isRTL(language: string): boolean {
  // Add other RTL language codes as needed
  return ["he", "ar", "fa", "ur"].some((rtl) => language.startsWith(rtl));
}

// Example usage:
export function getDirection(locale: string): "ltr" | "rtl" | undefined {
  if (locale in languageMeta) {
    return languageMeta[locale as SupportedLanguages].dir;
  }
  return undefined;
}
