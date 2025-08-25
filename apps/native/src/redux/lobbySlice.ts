import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LobbyUI, PlayerUI } from "@services/mappers";

interface LobbyState {
  currentLobby: LobbyUI | null;
  players: PlayerUI[];
  teamCode: string | null;
}

const initialState: LobbyState = {
  currentLobby: null,
  players: [],
  teamCode: null,
};

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobby(state, action: PayloadAction<LobbyUI | null>) {
      state.currentLobby = action.payload;
      state.teamCode = action.payload?.code ?? null;
    },
    setPlayers(state, action: PayloadAction<PlayerUI[]>) {
      state.players = action.payload;
    },
    addPlayer(state, action: PayloadAction<PlayerUI>) {
      state.players.push(action.payload);
    },
    removePlayer(state, action: PayloadAction<string>) {
      state.players = state.players.filter((p) => p.id !== action.payload);
    },
    resetLobby(state) {
      state.currentLobby = null;
      state.players = [];
      state.teamCode = null;
    },
    setTeamCode(state, action: PayloadAction<string | null>) {
      state.teamCode = action.payload;
    },
  },
});

export const {
  setLobby,
  setPlayers,
  addPlayer,
  removePlayer,
  resetLobby,
  setTeamCode,
} = lobbySlice.actions;
export default lobbySlice.reducer;
