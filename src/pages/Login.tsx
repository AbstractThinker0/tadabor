import { usePageNav } from "@/hooks/usePageNav";

import { Box, Button, Flex, Input, Text, Link, VStack } from "@chakra-ui/react";

import { useState } from "react";
import { NavLink } from "react-router";

import { validator } from "@/util/validators";
import { useTranslation } from "react-i18next";
import { PasswordInput } from "@/components/ui/password-input";

import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  usePageNav("auth.login");

  const { t } = useTranslation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateInputs = () => {
    const emailValidation = validator.email.safeParse(email);
    const passwordValidation = validator.password.safeParse(password);

    if (!emailValidation.success) {
      setValidationError(emailValidation.error.issues[0].message);
      return false;
    } else if (!passwordValidation.success) {
      setValidationError(passwordValidation.error.issues[0].message);
      return false;
    }

    return true;
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setValidationError("");
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setValidationError("");
  };

  const onClickLogin = async () => {
    setValidationError("");

    if (!validateInputs()) return;

    await login.execute({ email, password });

    if (login.isError) {
      setValidationError(login.error ? login.error.message : "Error");
    }
  };

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
            />
          </Box>
          <Box>
            <Flex justifyContent={"space-between"}>
              <Text mb={1} fontWeight="medium">
                {t("auth.password")}
              </Text>
              <Link colorPalette={"teal"} asChild>
                <NavLink to="/passwordreset">
                  {t("auth.questionPassword")}
                </NavLink>
              </Link>
            </Flex>
            <PasswordInput value={password} onChange={onChangePassword} />
          </Box>
        </VStack>

        {/* Show error if login failed */}
        {validationError && (
          <Text color="red.500" textAlign="center" mt={2} direction={"ltr"}>
            {validationError}
          </Text>
        )}

        <Button
          colorScheme="teal"
          w="full"
          mt={6}
          onClick={onClickLogin}
          loading={login.isPending || login.isSuccess} // <-- disable and show spinner
          loadingText={t("auth.attemptingLogin")}
        >
          {t("auth.login")}
        </Button>

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

export default Login;
