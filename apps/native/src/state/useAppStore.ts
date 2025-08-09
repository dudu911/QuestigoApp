import { create } from "zustand";

type SupportedLanguage = "en" | "he";

type State = {
  activeQuestId?: string;
  teamCode?: string;
  locale: SupportedLanguage;
  isOnline: boolean;
};

type Actions = {
  setActiveQuestId: (id?: string) => void;
  setTeamCode: (code?: string) => void;
  setLocale: (locale: SupportedLanguage) => void;
  setIsOnline: (online: boolean) => void;
};

export const useAppStore = create<State & Actions>((set) => ({
  activeQuestId: undefined,
  teamCode: undefined,
  locale: "en",
  isOnline: true,
  setActiveQuestId: (activeQuestId) => set({ activeQuestId }),
  setTeamCode: (teamCode) => set({ teamCode }),
  setLocale: (locale) => set({ locale }),
  setIsOnline: (isOnline) => set({ isOnline }),
}));

export type { SupportedLanguage };
