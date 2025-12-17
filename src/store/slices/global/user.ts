import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const keyId = "userId";
export const keyToken = "userToken";
const keyEmail = "userEmail";
const keyUsername = "userUsername";
const keyRole = "userRole";

interface UserStateProps {
  id: number;

  token: string;
  email: string;
  username: string;
  role: number;

  isPending: boolean;
  isLogged: boolean;
  isLoggedOffline: boolean;
}

const initialState: UserStateProps = {
  id: Number(localStorage.getItem(keyId)) || 0,
  token: localStorage.getItem(keyToken) || "",
  email: localStorage.getItem(keyEmail) || "",
  username: localStorage.getItem(keyUsername) || "",
  role: localStorage.getItem(keyRole)
    ? Number(localStorage.getItem(keyRole))
    : 0,

  isPending: localStorage.getItem(keyToken) ? true : false,
  isLogged: false,
  isLoggedOffline: false,
};

interface LoginPayload {
  id: number;
  token: string;
  email: string;
  username: string;
  role: number;
}

interface UpdatePayload {
  email: string;
  username: string;
  role?: number;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { id, token, email, username, role } = action.payload;

      state.id = id;
      localStorage.setItem(keyId, id.toString());

      state.token = token;
      localStorage.setItem(keyToken, token);
      state.email = email;
      localStorage.setItem(keyEmail, email);
      state.username = username;
      localStorage.setItem(keyUsername, username);
      state.role = role ?? null;
      if (isNaN(role)) {
        localStorage.setItem(keyRole, "0");
      } else {
        localStorage.setItem(keyRole, String(role));
      }

      state.isLogged = true;
      state.isLoggedOffline = false;
      state.isPending = false;
    },
    loginOffline: (state) => {
      const id = Number(localStorage.getItem(keyId)) || 0;
      const token = localStorage.getItem(keyToken);
      const email = localStorage.getItem(keyEmail);
      const username = localStorage.getItem(keyUsername);
      const roleStr = localStorage.getItem(keyRole);
      const role = roleStr !== null ? Number(roleStr) : 0;

      if (token && email && username && id) {
        state.id = id;

        state.token = token;
        state.email = email;
        state.username = username;
        state.role = role;

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
      state.role = 0;

      localStorage.removeItem(keyId);
      localStorage.removeItem(keyToken);
      localStorage.removeItem(keyEmail);
      localStorage.removeItem(keyUsername);
      localStorage.removeItem(keyRole);

      state.isLogged = false;
      state.isPending = false;
      state.isLoggedOffline = false;
    },
    update: (state, action: PayloadAction<UpdatePayload>) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
      if (action.payload.role !== undefined) {
        state.role = action.payload.role;
        localStorage.setItem(keyRole, String(action.payload.role));
      }
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
