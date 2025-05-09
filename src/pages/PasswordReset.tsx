import { usePageNav } from "@/hooks/usePageNav";

import { Box, Button, Flex, Input, Text, Link, VStack } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router";

import { validator } from "@/util/validators";
import { useTranslation } from "react-i18next";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";

const PasswordReset = () => {
  usePageNav("auth.resetPassword");

  const isBackendEnabled = useBackend();

  const { t } = useTranslation();

  const { resetPassword, updatePassword } = useAuth();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const validatePasswordInputs = () => {
    if (password !== confirmPassword) {
      setValidationError(t("auth.passwordMismatch"));
      return false;
    }

    const tokenValidation = validator.uuid.safeParse(token);
    const passwordValidation = validator.password.safeParse(password);

    if (!tokenValidation.success) {
      setValidationError(tokenValidation.error.errors[0].message);
      return false;
    } else if (!passwordValidation.success) {
      setValidationError(passwordValidation.error.errors[0].message);
      return false;
    }

    return true;
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setValidationError("");
  };

  const onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
    setValidationError("");
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setValidationError("");
  };

  const onChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    setValidationError("");
  };

  const onClickSendToken = async () => {
    setValidationError("");

    const emailValidation = validator.email.safeParse(email);

    if (!emailValidation.success) {
      setValidationError(emailValidation.error.errors[0].message);
      return;
    }

    const result = await resetPassword.execute({ email });

    if (result?.success) {
      setEmailSent(true);
    }
  };

  const onClickUpdatePassword = async () => {
    setValidationError("");

    if (!validatePasswordInputs()) return;

    const result = await updatePassword.execute({ token, password });

    if (result?.success) {
      setEmailSent(true);
    }
  };

  useEffect(() => {
    if (resetPassword.isError) {
      setValidationError(
        resetPassword.error ? resetPassword.error.message : "Error"
      );
    }
  }, [resetPassword.isError]);

  useEffect(() => {
    if (updatePassword.isError) {
      setValidationError(
        updatePassword.error ? updatePassword.error.message : "Error"
      );
    }
  }, [updatePassword.isError]);

  if (!isBackendEnabled) {
    return (
      <>
        <Navigate to="/" replace />
      </>
    );
  }

  return (
    <Flex flex={1} align="center" justify="center" bg="gray.subtle">
      <Box
        bg="bg"
        p={8}
        rounded="md"
        shadow="md"
        w={{ base: "90%", md: "400px" }}
      >
        <VStack gap={4} align="stretch">
          <Box>
            <Text mb={1} fontWeight="medium">
              {t("auth.email")}
            </Text>
            <Input
              direction={"ltr"}
              type="email"
              value={email}
              onChange={onChangeEmail}
              disabled={emailSent}
            />
          </Box>
          {emailSent && (
            <>
              {" "}
              <Box>
                <Text mb={1} fontWeight="medium">
                  {t("auth.resetToken")}
                </Text>
                <Input
                  direction={"ltr"}
                  type="text"
                  value={token}
                  onChange={onChangeToken}
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="medium">
                  {t("auth.newPassword")}
                </Text>
                <PasswordInput value={password} onChange={onChangePassword} />
              </Box>
              <Box>
                <Text mb={1} fontWeight="medium">
                  {t("auth.confirmNewPassword")}
                </Text>
                <PasswordInput
                  value={confirmPassword}
                  onChange={onChangeConfirmPassword}
                />
              </Box>
            </>
          )}
        </VStack>

        {/* Show error if login failed */}
        {validationError && (
          <Text color="red.500" textAlign="center" mt={2} direction={"ltr"}>
            {validationError}
          </Text>
        )}

        {emailSent ? (
          <Button
            colorScheme="teal"
            w="full"
            mt={6}
            onClick={onClickUpdatePassword}
            loading={updatePassword.isPending || updatePassword.isSuccess}
            loadingText={"Updating password"}
          >
            {t("auth.updatePassword")}
          </Button>
        ) : (
          <Button
            colorScheme="teal"
            w="full"
            mt={6}
            onClick={onClickSendToken}
            loading={resetPassword.isPending}
            loadingText={t("auth.sendingToken")}
          >
            {t("auth.sendResetToken")}
          </Button>
        )}

        <Text textAlign="center" mt={4}>
          {t("auth.questionNoAccount")}{" "}
          <Link color="teal.500" asChild>
            <NavLink to="/register">{t("auth.register")}</NavLink>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default PasswordReset;
