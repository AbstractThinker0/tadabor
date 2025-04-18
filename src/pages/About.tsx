import { useTranslation } from "react-i18next";
import { usePageNav } from "@/hooks/usePageNav";
import { Flex, Heading, Text, Link, List, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const AboutContent = () => {
  const { i18n, t } = useTranslation();
  const [buildDate, setBuildDate] = useState("");

  useEffect(() => {
    setBuildDate(
      new Date(Number(APP_BUILD_DATE)).toLocaleString(
        i18n.dir() === "rtl" ? "ar" : "en",
        { hour12: false }
      )
    );
  }, [i18n.resolvedLanguage]);

  return (
    <Flex flexDir={"column"} flex={1} overflowY={"auto"}>
      <Flex
        flexDirection={"column"}
        flex={1}
        py={4}
        px={7}
        bgColor={"brand.bg"}
        color={"gray.fg"}
        borderBottomRadius={"0.375rem"}
      >
        <Text
          textAlign={"center"}
          bgColor={"bg.panel"}
          borderRadius={"0.375rem"}
        >
          {t("about.githubText")}{" "}
          <Link
            href="https://github.com/AbstractThinker0/tadabor"
            target="_blank"
            rel="noreferrer"
            color={"blue.fg"}
          >
            Github
          </Link>
        </Text>

        <Flex flexDirection={"column"} gap={4}>
          <Heading size="2xl">{t("about.introTitle")}</Heading>
          <Text>{t("about.introText")}</Text>
          <Heading size="2xl">{t("about.howToUseTitle")}</Heading>
          <Text>{t("about.howToUseText")}</Text>
          <Heading size="2xl">{t("about.disclaimerTitle")}</Heading>
          <Text>{t("about.disclaimerText")}</Text>
          <Heading size="2xl">{t("about.creditsTitle")}</Heading>
          <List.Root ps={8}>
            <List.Item fontWeight={"bold"}>{t("about.credit1")}</List.Item>
            <List.Item>{t("about.credit2")}</List.Item>

            <List.Item>{t("about.credit3")}</List.Item>
            <List.Item>
              {t("about.credit4")}{" "}
              <Link
                href="https://github.com/risan/quran-json"
                target="_blank"
                rel="noreferrer"
                color={"blue.fg"}
              >
                quran-json
              </Link>
            </List.Item>
          </List.Root>
        </Flex>
      </Flex>

      <Flex
        lineHeight={"short"}
        bgColor={"bg.panel"}
        color={"fg.muted"}
        fontSize={"smaller"}
        paddingBottom={"8px"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Box>
          {t("about.appVersion")}: {APP_VERSION}
        </Box>
        <Box>
          {t("about.appDate")}: {buildDate}
        </Box>
      </Flex>
    </Flex>
  );
};

const About = () => {
  usePageNav("nav_about");

  return <AboutContent />;
};

export default About;
