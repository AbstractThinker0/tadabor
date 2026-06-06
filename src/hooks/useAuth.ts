import { useUserStore } from "@/store/global/userStore";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { toasterBottomCenter } from "@/components/ui/toaster";
import { dbNotes } from "@/util/dbFuncs";
import {
  usePasswordRequestReset,
  usePasswordReset,
  usePasswordUpdate,
  useUserLogin,
  useUserLogout,
  useUserSignup,
  useUserUpdateProfile,
} from "@/services/backend";
import { tryCatch } from "@/util/trycatch";
import { useCloudNotesStore } from "@/store/global/cloudNotes";
import type { AuthSession } from "tadabor-shared";

export const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const resetCloudNotes = useCloudNotesStore((state) => state.reset);

  const userLogin = useUserLogin();

  const userCreate = useUserSignup();

  const updateEmailOrUsername = useUserUpdateProfile();

  const sendEmail = usePasswordRequestReset();

  const sendPassword = usePasswordReset();

  const updatePasswordProfile = usePasswordUpdate();

  const userLogout = useUserLogout();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { result, error } = await tryCatch(
      userLogin.mutateAsync({ email, password })
    );

    if (error) {
      console.error("Login failed:", error);
      throw error;
    }

    confirmLogin(result);

    navigate("/");
  };

  const confirmLogin = (
    session: AuthSession,
    ui_message: string = "auth.loggedIn"
  ) => {
    useUserStore.getState().login(session);

    queueMicrotask(() => toasterBottomCenter.success(t(ui_message)));
  };

  const loginOffline = () => {
    useUserStore.getState().loginOffline();

    queueMicrotask(() => toasterBottomCenter.info(t("auth.loggedOffline")));
  };

  const logout = ({
    message = "auth.loggedOut",
    clearOldNotes = false,
  }: { message?: string; clearOldNotes?: boolean } = {}) => {
    if (useUserStore.getState().token) {
      // Best-effort server-side token revocation (fire-and-forget)
      userLogout.mutateAsync(undefined).catch(() => {
        // Silently ignore errors - logout locally regardless
      });
    }

    useUserStore.getState().logout();
    resetCloudNotes();
    if (clearOldNotes) {
      dbNotes.clearAllCloud();
    }

    queueMicrotask(() => toasterBottomCenter.error(t(message)));
  };

  const signup = async ({
    email,
    username,
    password,
    captchaToken,
  }: {
    email: string;
    username: string;
    password: string;
    captchaToken: string;
  }) => {
    const { result, error } = await tryCatch(
      userCreate.mutateAsync({
        username,
        email,
        password,
        captchaToken,
      })
    );

    if (error) {
      console.error("Sign Up failed:", error);
      throw error;
    }

    confirmLogin(result);

    navigate("/");

    return result;
  };

  const requestResetPassword = async ({ email }: { email: string }) => {
    const { result, error } = await tryCatch(sendEmail.mutateAsync({ email }));

    if (error) {
      console.error("requestResetPassword failed:", error);
      throw error;
    }

    toasterBottomCenter.success(t("auth.sendTokenDone"));

    return result;
  };

  const updatePassword = async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) => {
    const { result, error } = await tryCatch(
      sendPassword.mutateAsync({
        token,
        newPassword: password,
      })
    );

    if (error) {
      console.error("updatePassword failed:", error);
      throw error;
    }

    if (result.success) {
      confirmLogin(result, "auth.passwordUpdated");

      navigate("/");

      return result;
    }
  };

  const updateProfile = async ({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) => {
    const { result, error } = await tryCatch(
      updateEmailOrUsername.mutateAsync({
        email,
        username,
      })
    );

    if (error) {
      console.error("updateProfile failed:", error);
      throw error;
    }

    if (result) {
      useUserStore.getState().update({ email, username });
      toasterBottomCenter.success(t("auth.profileUpdate"));
      return true;
    }
  };

  const updateProfilePassword = async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const { result, error } = await tryCatch(
      updatePasswordProfile.mutateAsync({
        oldPassword,
        newPassword,
      })
    );

    if (error) {
      console.error("updateProfilePassword failed:", error);
      throw error;
    }

    if (result.success) {
      confirmLogin(result, "auth.passwordUpdated");

      return result;
    }
  };

  return {
    signup: { execute: signup, ...userCreate },
    login: { execute: login, ...userLogin },
    resetPassword: { execute: requestResetPassword, ...sendEmail },
    updatePassword: { execute: updatePassword, ...sendPassword },
    updateProfilePassword: {
      execute: updateProfilePassword,
      ...updatePasswordProfile,
    },
    logout,
    confirmLogin,
    loginOffline,
    updateProfile: { execute: updateProfile, ...updateEmailOrUsername },
  };
};
