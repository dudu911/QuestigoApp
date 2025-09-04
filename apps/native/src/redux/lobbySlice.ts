import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: string;
  playerId: string;
  username?: string;
  isHost: boolean;
  isReady: boolean;
}

export interface LobbyState {
  lobbyId: string | null;
  code: string | null;
  questId: string | null;
  status: "waiting" | "active" | "completed" | null;
  hostId: string | null;
  players: Player[];
}

const initialState: LobbyState = {
  lobbyId: null,
  code: null,
  questId: null,
  status: null,
  hostId: null,
  players: [],
};

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobby(
      state,
      action: PayloadAction<{
        id: string;
        code: string;
        questId: string | null;
        status: "waiting" | "active" | "completed";
        hostId: string | null;
      }>,
    ) {
      state.lobbyId = action.payload.id;
      state.code = action.payload.code;
      state.questId = action.payload.questId;
      state.status = action.payload.status;
      state.hostId = action.payload.hostId;
    },
    setCode(state, action: PayloadAction<string | null>) {
      state.code = action.payload;
    },
    setStatus(state, action: PayloadAction<LobbyState["status"]>) {
      state.status = action.payload;
    },
    setPlayers(state, action: PayloadAction<Player[]>) {
      state.players = action.payload;
    },
    addPlayer(state, action: PayloadAction<Player>) {
      state.players.push(action.payload);
    },
    removePlayer(state, action: PayloadAction<string>) {
      state.players = state.players.filter((p) => p.id !== action.payload);
    },
    resetLobby() {
      return initialState;
    },
  },
});

export const {
  setLobby,
  setCode,
  setStatus,
  setPlayers,
  addPlayer,
  removePlayer,
  resetLobby,
} = lobbySlice.actions;

export default lobbySlice.reducer;
