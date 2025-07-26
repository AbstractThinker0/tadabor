import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const keyId = "userId";
const keyToken = "userToken";
const keyEmail = "userEmail";
const keyUsername = "userUsername";

interface UserStateProps {
  id: number;

  token: string;
  email: string;
  username: string;

  isPending: boolean;
  isLogged: boolean;
  isLoggedOffline: boolean;
}

const initialState: UserStateProps = {
  id: Number(localStorage.getItem(keyId)) || -1,
  token: localStorage.getItem(keyToken) || "",
  email: localStorage.getItem(keyEmail) || "",
  username: localStorage.getItem(keyUsername) || "",

  isPending: localStorage.getItem(keyToken) ? true : false,
  isLogged: false,
  isLoggedOffline: false,
};

interface LoginPayload {
  id: number;
  token: string;
  email: string;
  username: string;
}

interface UpdatePayload {
  email: string;
  username: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { id, token, email, username } = action.payload;

      state.id = id;
      localStorage.setItem(keyId, id.toString());

      state.token = token;
      localStorage.setItem(keyToken, token);
      state.email = email;
      localStorage.setItem(keyEmail, email);
      state.username = username;
      localStorage.setItem(keyUsername, username);

      state.isLogged = true;
      state.isLoggedOffline = false;
      state.isPending = false;
    },
    loginOffline: (state) => {
      const id = Number(localStorage.getItem(keyId)) || 0;
      const token = localStorage.getItem(keyToken);
      const email = localStorage.getItem(keyEmail);
      const username = localStorage.getItem(keyUsername);

      if (token && email && username && id) {
        state.id = id;

        state.token = token;
        state.email = email;
        state.username = username;

        state.isPending = false;
        state.isLogged = true;
        state.isLoggedOffline = true;
      }
    },
    logout: (state) => {
      state.id = -1;
      state.token = "";
      state.email = "";
      state.username = "";

      localStorage.removeItem(keyId);
      localStorage.removeItem(keyToken);
      localStorage.removeItem(keyEmail);
      localStorage.removeItem(keyUsername);

      state.isLogged = false;
      state.isPending = false;
      state.isLoggedOffline = false;
    },
    update: (state, action: PayloadAction<UpdatePayload>) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
