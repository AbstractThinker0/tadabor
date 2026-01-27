import { useState } from "react";
import {
  Flex,
  Button,
  Input,
  Box,
  Text,
  Link,
  Tabs,
  Heading,
  Badge,
} from "@chakra-ui/react";
import { useUserStore } from "@/store/global/userStore";
import { PasswordInput } from "@/components/ui/password-input";
import { usePageNav } from "@/hooks/usePageNav";
import useScreenSize from "@/hooks/useScreenSize";
import { NavLink } from "react-router";
import { validator } from "@/util/validators";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { tryCatch } from "@/util/trycatch";

import TextareaAutosize from "@/components/Note/TextareaAutosize";
import {
  useUserUpdateBio,
  useConnectedDevices,
  useRevokeDevice,
} from "@/services/backend";
import { toaster } from "@/components/ui/toaster";

import { FaRegUser } from "react-icons/fa6";
import { LiaUserEditSolid } from "react-icons/lia";
import { PiDevicesLight } from "react-icons/pi";
import { MdOutlineRestore } from "react-icons/md";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { FaDesktop } from "react-icons/fa";
import { FaTabletAlt } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { ErrorRefresh } from "@/components/Generic/ErrorRefresh";
import { useNavigationStore } from "@/store/global/navigationStore";

const Profile = () => {
  usePageNav("auth.profile");

  const [currentTab, setCurrentTab] = useState("userBio");
  const isSmallScreen = useScreenSize();

  return (
    <Flex flex={1} overflow={"hidden"} dir="ltr">
      <Tabs.Root
        value={currentTab}
        onValueChange={(e) => setCurrentTab(e.value)}
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        flex={1}
        flexDirection={isSmallScreen ? "column" : "row"}
      >
        <Tabs.List
          fontSize={"small"}
          width={isSmallScreen ? "100%" : "220px"}
          justifyContent={isSmallScreen ? "space-around" : "flex-start"}
        >
          <Tabs.Trigger
            padding={1}
            fontSize={"small"}
            value="userBio"
            gap={2}
            title="Your bio"
          >
            <FaRegUser />
            {!isSmallScreen && "Your bio"}
          </Tabs.Trigger>
          <Tabs.Trigger
            padding={1}
            fontSize={"small"}
            value="updateProfile"
            gap={2}
            title="Update Profile"
          >
            <LiaUserEditSolid />
            {!isSmallScreen && "Update Profile"}
          </Tabs.Trigger>
          <Tabs.Trigger
            padding={1}
            fontSize={"small"}
            value="Connected"
            gap={2}
            title="Connected devices"
          >
            <PiDevicesLight />
            {!isSmallScreen && "Connected devices"}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup>
          <Tabs.Content value="userBio">
            <UserBio />
          </Tabs.Content>
          <Tabs.Content
            display={"flex"}
            value="updateProfile"
            paddingInlineStart={0}
          >
            <UpdateProfile />
          </Tabs.Content>
          <Tabs.Content value="Connected">
            <ConnectedDevices />
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Flex>
  );
};

const UserBio = () => {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);

  const userId = useUserStore((state) => state.id);
  const avatarSeedOld = useUserStore((state) => state.avatarSeed);
  const descriptionOld = useUserStore((state) => state.description);

  const updateMetaProfile = useUserStore((state) => state.UpdateMetaProfile);

  const updateBio = useUserUpdateBio();

  const [description, setDescription] = useState(descriptionOld);
  const [avatarSeed, setAvatarSeed] = useState(avatarSeedOld);

  const onClickBioButton = (status: boolean) => {
    setEditMode(status);

    if (!status) {
      setDescription(descriptionOld);
    }
  };

  const onClickSave = async () => {
    const { error } = await tryCatch(
      updateBio.mutateAsync({ description, avatarSeed })
    );

    if (error) {
      console.error("Failed to update bio:", error);
      toaster.create({
        description: t("ui.messages.save_failed"),
        type: "error",
      });
    } else {
      toaster.create({
        description: t("ui.messages.save_success"),
        type: "success",
      });

      updateMetaProfile(avatarSeed, description);
      setEditMode(false);
    }
  };

  return (
    <Flex flexDirection={"column"} padding={4} gap={2}>
      <Flex
        flexDirection={"column"}
        gap={4}
        justifyContent={"center"}
        alignItems={"center"}
        paddingTop={5}
      >
        <Flex
          borderStyle={"solid"}
          borderWidth={"1px"}
          borderRadius={"full"}
          borderColor={"white"}
          padding={4}
          ring={"2px"}
          ringColor={"white"}
          shadow={"sm"}
        >
          <img
            height={"70px"}
            width={"70px"}
            src={`https://api.dicebear.com/9.x/identicon/svg?seed=${avatarSeed}`}
            alt="avatar"
          />
        </Flex>
        <Flex gap={2}>
          <Button
            borderRadius={"xl"}
            onClick={() => setAvatarSeed(userId.toString())}
            variant={"outline"}
          >
            <MdOutlineRestore /> Restore default
          </Button>
          <Button
            borderRadius={"xl"}
            onClick={() => setAvatarSeed(Date.now().toString())}
            colorPalette={"yellow"}
          >
            <MdOutlineAutoAwesome />
            Random Avatar
          </Button>
        </Flex>
      </Flex>
      <Flex
        flexDirection={"column"}
        gap={2}
        justifyContent={"center"}
        alignItems={"center"}
        paddingTop={8}
      >
        <Heading size={"2xl"}>Bio</Heading>
        <Flex flex={1} width={"100%"} px={5}>
          <TextareaAutosize
            dir="auto"
            disabled={!editMode}
            _disabled={{ cursor: "default" }}
            resize={editMode ? "block" : "none"}
            width={"100%"}
            outline={"none"}
            placeholder="Your about me.."
            textAlign={"center"}
            value={description}
            fontSize={"medium"}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Flex>
        <Button variant={"ghost"} onClick={() => onClickBioButton(!editMode)}>
          {editMode ? (
            <>
              <MdCancel /> Cancel edit
            </>
          ) : (
            <>
              <MdEdit /> Edit Bio
            </>
          )}
        </Button>
      </Flex>
      <Box textAlign={"center"}>
        <Button
          borderRadius={"3xl"}
          shadow={"md"}
          onClick={onClickSave}
          px={10}
        >
          Save Changes
        </Button>
      </Box>
    </Flex>
  );
};

const UpdateProfile = () => {
  const { t } = useTranslation();

  const appDir = useNavigationStore((state) => state.pageDirection);

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
      setValidationError("Identical to old email and username");
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
      flexDirection="column"
      p={4}
      fontSize={"small"}
      dir={appDir}
    >
      <Flex flexDirection="column" mb={4}>
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
        <Box pt={"1rem"} textAlign={"center"}>
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
      <Flex flexDirection="column">
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
        <Box pt={"1rem"} textAlign={"center"}>
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

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case "mobile":
      return <FaMobileAlt />;
    case "tablet":
      return <FaTabletAlt />;
    default:
      return <FaDesktop />;
  }
};

const ConnectedDevices = () => {
  const { data, isLoading, error } = useConnectedDevices();
  const revokeDevice = useRevokeDevice();

  const onClickRevoke = async (tokenId: number) => {
    const { error } = await tryCatch(revokeDevice.mutateAsync({ tokenId }));

    if (error) {
      toaster.create({
        description: error.message || "Failed to sign out device",
        type: "error",
      });
    } else {
      toaster.create({
        description: "Device signed out successfully",
        type: "success",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading devices..." />;
  }

  if (error) {
    return <ErrorRefresh message="Failed to load connected devices." />;
  }

  const devices = data?.devices || [];

  if (devices.length === 0) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center" p={8}>
        <Text>No connected devices found</Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" p={4} gap={4}>
      <Heading size="lg">Connected Devices</Heading>
      <Text fontSize="sm" color="fg.muted">
        These are the devices currently logged into your account.
      </Text>
      <Flex flexDirection="column" gap={3}>
        {devices.map((device) => (
          <Flex
            key={device.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            alignItems="center"
            gap={4}
            bg={device.isCurrent ? "green.subtle" : "bg"}
            borderColor={device.isCurrent ? "green.emphasized" : "border"}
          >
            <Box
              fontSize="2xl"
              color={device.isCurrent ? "green.fg" : "fg.muted"}
            >
              {getDeviceIcon(device.deviceType)}
            </Box>
            <Flex flex={1} flexDirection="column" gap={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontWeight="medium">{device.browser}</Text>
                {device.isCurrent && (
                  <Badge colorPalette="green" size="sm">
                    Current
                  </Badge>
                )}
              </Flex>
              <Text fontSize="sm" color="fg.muted">
                {device.os}
              </Text>
              <Flex fontSize="xs" color="fg.muted" gap={4}>
                <Text>IP: {device.ipAddress || "Unknown"}</Text>
                <Text>
                  Logged in: {new Date(device.loginTime).toLocaleDateString()}
                </Text>
              </Flex>
            </Flex>
            {!device.isCurrent && (
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => onClickRevoke(device.id)}
                loading={revokeDevice.isPending}
              >
                <IoLogOutOutline />
                Sign out
              </Button>
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Profile;
