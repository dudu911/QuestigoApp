import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LobbyState {
  lobbyId: string | null;
  code: string | null;
  players: {
    id: string;
    playerId: string;
    username?: string;
    isHost: boolean;
    isReady: boolean;
  }[];
}

const initialState: LobbyState = {
  lobbyId: null,
  code: null,
  players: [],
};

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobby(state, action: PayloadAction<{ id: string; code: string }>) {
      state.lobbyId = action.payload.id;
      state.code = action.payload.code;
    },
    setCode(state, action: PayloadAction<string | null>) {
      state.code = action.payload;
    },
    setPlayers(state, action: PayloadAction<LobbyState["players"]>) {
      state.players = action.payload;
    },
    addPlayer(state, action: PayloadAction<LobbyState["players"][0]>) {
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
  setPlayers,
  addPlayer,
  removePlayer,
  resetLobby,
} = lobbySlice.actions;
export default lobbySlice.reducer;
