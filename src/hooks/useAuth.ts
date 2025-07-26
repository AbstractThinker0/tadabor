import { useAppDispatch } from "@/store";
import {
  cloudNotesActions,
  fetchCloudNotes,
} from "@/store/slices/global/cloudNotes";
import { keyId, userActions } from "@/store/slices/global/user";

import { useTRPC } from "@/util/trpc";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { toasterBottomCenter } from "@/components/ui/toaster";
import { dbFuncs } from "@/util/db";

export const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const trpc = useTRPC();
  const userLogin = useMutation(trpc.auth.login.mutationOptions());
  const userCreate = useMutation(trpc.auth.signUp.mutationOptions());
  const sendEmail = useMutation(
    trpc.password.requestPasswordReset.mutationOptions()
  );
  const sendPassword = useMutation(
    trpc.password.resetPassword.mutationOptions()
  );

  const updateEmailOrUsername = useMutation(
    trpc.auth.updateEmailOrUsername.mutationOptions()
  );

  const updatePasswordProfile = useMutation(
    trpc.password.updatePassword.mutationOptions()
  );

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const result = await userLogin.mutateAsync({ email, password });

      confirmLogin({
        id: result.user.id,
        email,
        token: result.token,
        username: result.user.username,
      });

      dispatch(fetchCloudNotes({ userId: result.user.id }));

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const confirmLogin = ({
    id,
    email,
    token,
    username,
    message = "auth.loggedIn",
  }: {
    id: number;
    email: string;
    token: string;
    username: string;
    message?: string;
  }) => {
    dispatch(
      userActions.login({
        id,
        email,
        token,
        username,
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

    const userId = Number(localStorage.getItem(keyId)) || 0;

    dispatch(fetchCloudNotes({ userId }));

    queueMicrotask(() =>
      toasterBottomCenter.create({
        description: t("auth.loggedOffline"),
        type: "info",
      })
    );
  };

  const logout = ({
    message = "auth.loggedOut",
  }: { message?: string } = {}) => {
    dispatch(userActions.logout());
    dispatch(cloudNotesActions.reset());
    dbFuncs.clearCloudNotes();
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
    try {
      const result = await userCreate.mutateAsync({
        username,
        email,
        password,
        captchaToken,
      });

      if (result.success !== true || !("userid" in result)) {
        return false;
      }

      confirmLogin({
        id: result.userid,
        email,
        token: result.token,
        username,
      });

      dispatch(fetchCloudNotes({ userId: result.userid }));

      navigate("/");
    } catch (error) {
      console.error("Sign Up failed:", error);
      // Also userCreate.error will be set?
    }
  };

  const requestResetPassword = async ({ email }: { email: string }) => {
    try {
      const result = await sendEmail.mutateAsync({ email });

      toasterBottomCenter.create({
        description: t("auth.sendTokenDone"),
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const updatePassword = async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) => {
    try {
      const result = await sendPassword.mutateAsync({
        token,
        newPassword: password,
      });

      if (result.success) {
        confirmLogin({
          id: result.user.id,
          token: result.token,
          email: result.user.email,
          username: result.user.username,
          message: "auth.passwordUpdated",
        });

        dispatch(fetchCloudNotes({ userId: result.user.id }));

        navigate("/");

        return result;
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const updateProfile = async ({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) => {
    try {
      const result = await updateEmailOrUsername.mutateAsync({
        email,
        username,
      });

      if (result) {
        dispatch(userActions.update({ email, username }));
        toasterBottomCenter.create({
          description: t("auth.profileUpdate"),
          type: "success",
        });
        return true;
      }
    } catch (error) {
      console.error("updateProfile failed:", error);
    }
  };

  const updateProfilePassword = async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      const result = await updatePasswordProfile.mutateAsync({
        oldPassword,
        newPassword,
      });

      if (result.success) {
        confirmLogin({
          id: result.user.id,
          token: result.token,
          email: result.user.email,
          username: result.user.username,
          message: "auth.passwordUpdated",
        });

        return result;
      }
    } catch (error) {
      console.error("Login failed:", error);
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
