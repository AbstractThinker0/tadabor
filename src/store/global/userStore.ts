import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { AuthSession, BasicUser } from "tadabor-shared";

export const keyId = "userId";
export const keyToken = "userToken";
const keyEmail = "userEmail";
const keyUsername = "userUsername";
const keyRole = "userRole";
const keyAvatarSeed = "userAvatarSeed";
const keyDescription = "userDescription";

interface UserStateProps extends Omit<BasicUser, "avatarSeed" | "description"> {
  id: number;
  token: string;
  email: string;
  username: string;
  role: number;
  avatarSeed: string;
  description: string;

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
  avatarSeed:
    localStorage.getItem(keyAvatarSeed) || localStorage.getItem(keyId) || "",
  description: localStorage.getItem(keyDescription) || "",

  isPending: localStorage.getItem(keyToken) ? true : false,
  isLogged: false,
  isLoggedOffline: false,
};

const getAvatarSeed = (user: Pick<BasicUser, "id" | "avatarSeed">) =>
  user.avatarSeed ?? user.id.toString();

const getDescription = (user: Pick<BasicUser, "description">) =>
  user.description ?? "";

type LoginPayload = Pick<AuthSession, "token" | "user">;

interface UpdatePayload {
  email: string;
  username: string;
  role?: number;
}

export const useUserStore = create(
  immer(
    combine(initialState, (set, get) => ({
      login: (payload: LoginPayload) => {
        const { token, user } = payload;
        const avatarSeed = getAvatarSeed(user);
        const description = getDescription(user);

        set((state) => {
          state.id = user.id;
          state.token = token;
          state.email = user.email;
          state.username = user.username;
          state.role = user.role;
          state.avatarSeed = avatarSeed;
          state.description = description;

          state.isLogged = true;
          state.isLoggedOffline = false;
          state.isPending = false;
        });

        localStorage.setItem(keyId, user.id.toString());
        localStorage.setItem(keyToken, token);
        localStorage.setItem(keyEmail, user.email);
        localStorage.setItem(keyUsername, user.username);

        if (isNaN(user.role)) {
          localStorage.setItem(keyRole, "0");
        } else {
          localStorage.setItem(keyRole, String(user.role));
        }

        localStorage.setItem(keyAvatarSeed, avatarSeed);
        localStorage.setItem(keyDescription, description);
      },

      loginOffline: () => {
        const id = Number(localStorage.getItem(keyId)) || 0;
        const token = localStorage.getItem(keyToken);
        const email = localStorage.getItem(keyEmail);
        const username = localStorage.getItem(keyUsername);
        const roleStr = localStorage.getItem(keyRole);
        const role = roleStr !== null ? Number(roleStr) : 0;
        const avatarSeed =
          localStorage.getItem(keyAvatarSeed) ||
          localStorage.getItem(keyId) ||
          "";

        const description = localStorage.getItem(keyDescription) || "";

        if (token && email && username && id) {
          set((state) => {
            state.id = id;
            state.token = token;
            state.email = email;
            state.username = username;
            state.role = role;
            state.avatarSeed = avatarSeed;
            state.description = description;

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
          state.avatarSeed = "";
          state.description = "";

          state.isLogged = false;
          state.isPending = false;
          state.isLoggedOffline = false;
        });

        localStorage.removeItem(keyId);
        localStorage.removeItem(keyToken);
        localStorage.removeItem(keyEmail);
        localStorage.removeItem(keyUsername);
        localStorage.removeItem(keyRole);
        localStorage.removeItem(keyAvatarSeed);
        localStorage.removeItem(keyDescription);
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
      UpdateMetaProfile: (avatarSeed?: string, description?: string) => {
        const { id: userId } = get();
        const newAvatarSeed = avatarSeed ?? userId.toString();
        const newDescription = description ?? "";

        set((state) => {
          state.avatarSeed = newAvatarSeed;
          state.description = newDescription;
        });

        localStorage.setItem(keyAvatarSeed, newAvatarSeed);
        localStorage.setItem(keyDescription, newDescription);
      },
    }))
  )
);
