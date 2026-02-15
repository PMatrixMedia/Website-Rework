"use client";

import React from "react";
import { Theme , Box, Container, Heading, Flex, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";

const Intro = () => {
  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <Box size="3" align="center" justify="center">
        <Heading size="9" weight="bold" className="text-white">
            PhaseMatrix Media
          </Heading>
          </Box>
          <Box>
          <Container>
            <SphereScene />
          </Container>
          </Box>
          <Box>
          <Container size="3" align="center" justify="center">
            <Text size="9" color="orange">
                Click the Spheres to explore the site
              </Text>
            </Container>
          </Box>
    </Theme>
  );
};

export default Intro;