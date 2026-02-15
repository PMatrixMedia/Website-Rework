import React from "react";
import Image from "next/image";
import { Theme, Box, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";
import bannerImg from "../../Images/resizedbanner.png";

const Intro = () => {
  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <Box className="w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center"align="center" justify="center">
          <Box className="py-6 w-full">
            <Image
              src={bannerImg}
              alt="PhaseMatrix Media"
              width={1400}
              height={550}
              className="object-contain w-full"
            />
          </Box>
          <Box className="w-full">
            <SphereScene />
          </Box>
          <Box className="w-full flex justify-center py-6">
            <Text size="9" color="orange" className="nabla-footer text-center">
              Click the Spheres to explore the site.
            </Text>
          </Box>
        </Box>
    </Theme>
  );
};

export default Intro;