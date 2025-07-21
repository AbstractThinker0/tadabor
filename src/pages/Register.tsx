import { usePageNav } from "@/hooks/usePageNav";

import { Box, Button, Flex, Input, Text, Link, VStack } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import { validator } from "@/util/validators";
import { useTranslation } from "react-i18next";
import { PasswordInput } from "@/components/ui/password-input";

import { useAuth } from "@/hooks/useAuth";

import HCaptcha from "@hcaptcha/react-hcaptcha";

const Register = () => {
  usePageNav("auth.register");

  const { t } = useTranslation();

  const { signup } = useAuth();

  const [tokenCaptcha, setTokenCaptcha] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateInputs = () => {
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return false;
    }

    const usernameValidation = validator.username.safeParse(username);
    const emailValidation = validator.email.safeParse(email);
    const passwordValidation = validator.password.safeParse(password);

    if (!usernameValidation.success) {
      setValidationError(usernameValidation.error.errors[0].message);
      return false;
    } else if (!emailValidation.success) {
      setValidationError(emailValidation.error.errors[0].message);
      return false;
    } else if (!passwordValidation.success) {
      setValidationError(passwordValidation.error.errors[0].message);
      return false;
    }

    return true;
  };

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setValidationError("");
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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

  const onClickRegister = async () => {
    if (!tokenCaptcha) {
      setValidationError("Captcha required.");
      return;
    }

    if (!validateInputs()) return;

    const result = await signup.execute({
      username,
      email,
      password,
      captchaToken: tokenCaptcha,
    });

    if (result === false) {
      setValidationError("Captcha required.");
    }
  };

  useEffect(() => {
    if (signup.isError) {
      setValidationError(signup.error ? signup.error.message : "Error");
    }
  }, [signup.isError]);

  return (
    <Flex flex={1} align="center" justify="center" bg="gray.subtle">
      <Box
        bg="bg"
        p={8}
        mdDown={{ p: 4 }}
        rounded="md"
        shadow="md"
        w={{ base: "90%", md: "400px" }}
      >
        <VStack gap={4} align="stretch">
          <Box>
            <Text mb={1} fontWeight="medium">
              {t("auth.username")}
            </Text>
            <Input
              direction={"ltr"}
              type="text"
              value={username}
              onChange={onChangeUsername}
            />
          </Box>
          <Box>
            <Text mb={1} fontWeight="medium">
              {t("auth.email")}
            </Text>
            <Input
              direction={"ltr"}
              type="email"
              value={email}
              onChange={onChangeEmail}
            />
          </Box>
          <Box>
            <Text mb={1} fontWeight="medium">
              {t("auth.password")}
            </Text>
            <PasswordInput value={password} onChange={onChangePassword} />
          </Box>
          <Box>
            <Text mb={1} fontWeight="medium">
              {t("auth.confirmPassword")}
            </Text>
            <PasswordInput
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
          </Box>
        </VStack>

        {/* Show error if login failed */}
        {validationError && (
          <Text color="red.500" textAlign="center" mt={2} direction={"ltr"}>
            {validationError}
          </Text>
        )}

        <Flex paddingTop={"10px"} justifyContent={"center"}>
          <HCaptcha
            sitekey={import.meta.env.HCAPTCHA_KEY || ""}
            onVerify={(token) => {
              setTokenCaptcha(token);
            }}
          />
        </Flex>

        <Button
          colorScheme="teal"
          w="full"
          mt={5}
          onClick={onClickRegister}
          disabled={!tokenCaptcha}
          loading={signup.isPending || signup.isSuccess} // <-- disable and show spinner
          loadingText={t("auth.attemptingRegister")}
        >
          {t("auth.register")}
        </Button>

        <Text textAlign="center" mt={4}>
          {t("auth.questionYesAccount")}{" "}
          <Link color="teal.500" asChild>
            <NavLink to="/login">{t("auth.login")}</NavLink>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;
