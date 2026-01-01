import { useAppDispatch } from "@/store";

import { userActions } from "@/store/slices/global/user";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { toasterBottomCenter } from "@/components/ui/toaster";
import { dbFuncs } from "@/util/db";
import {
  usePasswordRequestReset,
  usePasswordReset,
  usePasswordUpdate,
  useUserLogin,
  useUserSignup,
  useUserUpdateProfile,
} from "@/services/backend";
import { tryCatch } from "@/util/trycatch";
import { useCloudNotesStore } from "@/store/zustand/cloudNotes";

export const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const resetCloudNotes = useCloudNotesStore((state) => state.reset);

  const userLogin = useUserLogin();

  const userCreate = useUserSignup();

  const updateEmailOrUsername = useUserUpdateProfile();

  const sendEmail = usePasswordRequestReset();

  const sendPassword = usePasswordReset();

  const updatePasswordProfile = usePasswordUpdate();

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

    confirmLogin({
      id: result.user.id,
      email,
      token: result.token,
      username: result.user.username,
      role: result.user.role,
    });

    navigate("/");
  };

  const confirmLogin = ({
    id,
    email,
    token,
    username,
    role,
    message = "auth.loggedIn",
  }: {
    id: number;
    email: string;
    token: string;
    username: string;
    role: number;
    message?: string;
  }) => {
    dispatch(
      userActions.login({
        id,
        email,
        token,
        username,
        role,
      })
    );

    queueMicrotask(() =>
      toasterBottomCenter.create({
        description: t(message),
        type: "success",
      })
    );
  };

  const loginOffline = () => {
    dispatch(userActions.loginOffline());

    queueMicrotask(() =>
      toasterBottomCenter.create({
        description: t("auth.loggedOffline"),
        type: "info",
      })
    );
  };

  const logout = ({
    message = "auth.loggedOut",
    clearOldNotes = false,
  }: { message?: string; clearOldNotes?: boolean } = {}) => {
    dispatch(userActions.logout());
    resetCloudNotes();
    if (clearOldNotes) {
      dbFuncs.clearCloudNotes();
    }

    queueMicrotask(() =>
      toasterBottomCenter.create({
        description: t(message),
        type: "error",
      })
    );
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

    if (result.success !== true || !("userid" in result)) {
      return false;
    }

    confirmLogin({
      id: result.userid,
      email,
      token: result.token,
      username,
      role: 0,
    });

    navigate("/");
  };

  const requestResetPassword = async ({ email }: { email: string }) => {
    const { result, error } = await tryCatch(sendEmail.mutateAsync({ email }));

    if (error) {
      console.error("requestResetPassword failed:", error);
      throw error;
    }

    toasterBottomCenter.create({
      description: t("auth.sendTokenDone"),
      type: "success",
    });

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
      confirmLogin({
        id: result.user.id,
        token: result.token,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        message: "auth.passwordUpdated",
      });

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
      dispatch(userActions.update({ email, username }));
      toasterBottomCenter.create({
        description: t("auth.profileUpdate"),
        type: "success",
      });
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
      confirmLogin({
        id: result.user.id,
        token: result.token,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        message: "auth.passwordUpdated",
      });

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
