import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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

export const useUserStore = create(
  immer(
    combine(initialState, (set) => ({
      login: (payload: LoginPayload) => {
        const { id, token, email, username, role } = payload;

        set((state) => {
          state.id = id;
          state.token = token;
          state.email = email;
          state.username = username;
          state.role = role ?? 0;

          state.isLogged = true;
          state.isLoggedOffline = false;
          state.isPending = false;
        });

        localStorage.setItem(keyId, id.toString());
        localStorage.setItem(keyToken, token);
        localStorage.setItem(keyEmail, email);
        localStorage.setItem(keyUsername, username);

        if (isNaN(role)) {
          localStorage.setItem(keyRole, "0");
        } else {
          localStorage.setItem(keyRole, String(role));
        }
      },

      loginOffline: () => {
        const id = Number(localStorage.getItem(keyId)) || 0;
        const token = localStorage.getItem(keyToken);
        const email = localStorage.getItem(keyEmail);
        const username = localStorage.getItem(keyUsername);
        const roleStr = localStorage.getItem(keyRole);
        const role = roleStr !== null ? Number(roleStr) : 0;

        if (token && email && username && id) {
          set((state) => {
            state.id = id;
            state.token = token;
            state.email = email;
            state.username = username;
            state.role = role;

            state.isPending = false;
            state.isLogged = true;
            state.isLoggedOffline = true;
          });
        }
      },

      logout: () => {
        set((state) => {
          state.id = -1;
          state.token = "";
          state.email = "";
          state.username = "";
          state.role = 0;

          state.isLogged = false;
          state.isPending = false;
          state.isLoggedOffline = false;
        });

        localStorage.removeItem(keyId);
        localStorage.removeItem(keyToken);
        localStorage.removeItem(keyEmail);
        localStorage.removeItem(keyUsername);
        localStorage.removeItem(keyRole);
      },

      update: (payload: UpdatePayload) => {
        set((state) => {
          state.email = payload.email;
          state.username = payload.username;
          if (payload.role !== undefined) {
            state.role = payload.role;
            localStorage.setItem(keyRole, String(payload.role));
          }
        });
      },
    }))
  )
);
