import React from "react";
import { Theme, Box, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";

const Intro = () => {
  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <Box className="intro-container w-full max-w-[1400px] mx-auto flex flex-col items-center" align="center" justify="center">
          <Box className="w-full">
            <SphereScene />
          </Box>
          <Box className="w-full flex justify-center intro-footer-text">
            <Text size="9" color="orange" className="nabla-footer text-center">
              Click the Spheres to explore the site.
            </Text>
          </Box>
        </Box>
    </Theme>
  );
};

export default Intro;