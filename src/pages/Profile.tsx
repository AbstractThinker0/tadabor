import { useState } from "react";
import { Flex, Button, Input, Box, Text, Link } from "@chakra-ui/react";
import { useUserStore } from "@/store/zustand/userStore";
import { PasswordInput } from "@/components/ui/password-input";
import { usePageNav } from "@/hooks/usePageNav";
import { NavLink } from "react-router";
import { validator } from "@/util/validators";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { tryCatch } from "@/util/trycatch";

const Profile = () => {
  usePageNav("auth.profile");

  const { t } = useTranslation();

  const { updateProfile, updateProfilePassword } = useAuth();

  const [validationError, setValidationError] = useState("");
  const [validationErrorPassword, setValidationErrorPassword] = useState("");

  const oldEmail = useUserStore((state) => state.email);
  const oldUsername = useUserStore((state) => state.username);
  const [username, setUsername] = useState(oldUsername);
  const [email, setEmail] = useState(oldEmail);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sameEmail = oldEmail === email;
  const sameUsername = oldUsername === username;

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setValidationError("");
  };

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setValidationError("");
  };

  const onClickUpdateProfile = async () => {
    // Add logic to save the updated information (e.g., API call)

    setValidationError("");

    if (sameEmail && sameUsername) {
      setValidationError("Idential to old email and username");
      return;
    }

    const usernameValidation = validator.username.safeParse(username);
    const emailValidation = validator.email.safeParse(email);

    if (!usernameValidation.success) {
      setValidationError(usernameValidation.error.issues[0].message);
      return;
    } else if (!emailValidation.success) {
      setValidationError(emailValidation.error.issues[0].message);
      return;
    }

    const { error } = await tryCatch(
      updateProfile.execute({ email, username })
    );

    if (error) {
      setValidationError(error?.message ?? "Error");
    }
  };

  const onClickReset = () => {
    setEmail(oldEmail);
    setUsername(oldUsername);
  };

  const onChangeOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
    setValidationErrorPassword("");
  };

  const onChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    setValidationErrorPassword("");
  };

  const onChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    setValidationErrorPassword("");
  };

  const onClickUpdatePassword = async () => {
    setValidationErrorPassword("");

    const oldPasswordValidation = validator.password.safeParse(oldPassword);
    const newPasswordValidation = validator.password.safeParse(newPassword);

    if (!oldPasswordValidation.success) {
      setValidationErrorPassword(oldPasswordValidation.error.issues[0].message);
      return;
    } else if (!newPasswordValidation.success) {
      setValidationErrorPassword(newPasswordValidation.error.issues[0].message);
      return;
    }

    if (oldPassword === newPassword) {
      setValidationErrorPassword("Old and new password are identical");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationErrorPassword(
        "new password and confirm password are different"
      );
      return;
    }

    const { error } = await tryCatch(
      updateProfilePassword.execute({ oldPassword, newPassword })
    );

    if (error) {
      setValidationErrorPassword(error?.message ?? "Error");
    }
  };

  return (
    <Flex
      flex={1}
      bg="gray.subtle"
      justifyItems={"center"}
      alignItems={"center"}
      flexDirection="column"
      p={4}
    >
      <Flex
        flexDirection="column"
        width={"50vw"}
        mdDown={{ width: "90vw" }}
        mb={4}
      >
        <Text>{t("auth.username")}</Text>
        <Input
          direction={"ltr"}
          value={username}
          onChange={onChangeUsername}
          placeholder="Enter your username"
          bgColor={"bg"}
        />
        <Text>{t("auth.email")}</Text>
        <Input
          direction={"ltr"}
          type="email"
          value={email}
          onChange={onChangeEmail}
          placeholder="Enter your email"
          bgColor={"bg"}
        />
        {validationError && (
          <Text color="red.500" textAlign="center" mt={2} direction={"ltr"}>
            {validationError}
          </Text>
        )}
        <Box pt={"1rem"}>
          <Button
            colorPalette="blue"
            onClick={onClickUpdateProfile}
            me={2}
            disabled={sameEmail && sameUsername}
            loading={updateProfile.isPending}
          >
            {t("auth.updateProfile")}
          </Button>
          <Button
            onClick={onClickReset}
            disabled={(sameEmail && sameUsername) || !email}
          >
            {t("auth.resetFields")}
          </Button>
        </Box>
      </Flex>
      <Flex flexDirection="column" width={"50vw"} mdDown={{ width: "90vw" }}>
        <Flex justifyContent={"space-between"}>
          <Text>{t("auth.oldPassword")}</Text>
          <Link colorPalette={"teal"} asChild>
            <NavLink to="/passwordreset">{t("auth.questionPassword")}</NavLink>
          </Link>
        </Flex>
        <PasswordInput
          value={oldPassword}
          onChange={onChangeOldPassword}
          placeholder="Enter your old password"
          bgColor={"bg"}
        />

        <Text>{t("auth.newPassword")}</Text>
        <PasswordInput
          value={newPassword}
          onChange={onChangeNewPassword}
          placeholder="Enter your new password"
          bgColor={"bg"}
        />
        <Text>{t("auth.confirmNewPassword")}</Text>
        <PasswordInput
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          placeholder="Enter your new password"
          bgColor={"bg"}
        />
        {validationErrorPassword && (
          <Text color="red.500" textAlign="center" mt={2} direction={"ltr"}>
            {validationErrorPassword}
          </Text>
        )}
        <Box pt={"1rem"}>
          <Button
            colorPalette="blue"
            onClick={onClickUpdatePassword}
            me={2}
            loading={updateProfilePassword.isPending}
            disabled={!oldPassword}
          >
            {t("auth.updatePassword")}
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Profile;
