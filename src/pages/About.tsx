import {
  Box,
  Flex,
  Heading,
  Text,
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

const AboutEnglish = () => {
  return (
    <Flex dir="ltr" flexDir={"column"} flex={1} overflow={"hidden"}>
      <Flex flexDir={"column"} flex={1} overflow={"auto"}>
        <Flex
          flexDirection={"column"}
          flex={1}
          p={4}
          bgColor={"var(--color-primary)"}
          borderBottomRadius={"0.375rem"}
        >
          <Text align={"center"} bgColor={"white"} borderRadius={"0.375rem"}>
            Check out the project's{" "}
            <Link
              href="https://github.com/AbstractThinker0/tadabor"
              target="_blank"
              rel="noreferrer"
              color={"blue.600"}
            >
              Github repository
            </Link>
          </Text>

          <Box>
            <Heading>Intro:</Heading>
            <Text>
              This project is a web App that allows you to browse through the
              Quran and write your notes/reflections below the verses,
              everything will be saved in your browser.
            </Text>
            <Heading>How to use:</Heading>
            <Text>
              Simply go to Quran Browser on the home page, you can click the
              button next to any verse to open a form where you can enter your
              text, once you are done writing you can press the save button, all
              the data will be saved on your browser app and clearing your cache
              might erase the data you have saved.
            </Text>
            <Heading>Disclaimer:</Heading>
            <Text>
              The app is in beta, which means you may encounter occasional bugs.
              We strongly recommend keeping a backup of any data you save while
              using the app. Please be aware that the accuracy of the Quran
              roots list has not been verified, and the completeness of search
              results based on sentences or roots has not been extensively
              tested.
            </Text>
            <Heading>Credits:</Heading>
            <UnorderedList>
              <ListItem fontWeight={"bold"}>
                The creator of the universe for all his favors that if I tried
                to count I would never be able to number them
              </ListItem>
              <ListItem>
                <Link
                  href="https://github.com/risan/quran-json"
                  target="_blank"
                  rel="noreferrer"
                  color={"blue.600"}
                >
                  quran-json
                </Link>{" "}
                project for the compilation of chapter names and their
                transliteration
              </ListItem>
              <ListItem>
                Tanzil project for the Quran text compilation (tanzil.net)
              </ListItem>

              <ListItem>
                Initial quran roots compilation extracted from Zekr Project
                (zekr.org)
              </ListItem>
            </UnorderedList>
            <Heading>Future project:</Heading>
            <Text>
              Once all features of this project are implemented, it will serve
              as the foundation for another project that aims to create a
              platform for collaborative translation and reflection upon the
              Quran. The ultimate goal is to achieve an accurate understanding
              of the true message of the Quran by undoing all the semantic
              changes that have occurred over the centuries.
            </Text>
          </Box>
        </Flex>

        <Text align={"center"} color={"rgba(33, 37, 41, 0.75)"}>
          App Version {APP_VERSION}
        </Text>
      </Flex>
    </Flex>
  );
};

const About = () => {
  return <AboutEnglish />;
};

export default About;
