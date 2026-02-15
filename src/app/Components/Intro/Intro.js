"use client";

import React from "react";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";

const Intro = () => {
  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black font-sans">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-5xl font-bold text-neutral-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:text-6xl">
            PhaseMatrix Media
          </h1>
        </div>

        <div className="flex w-full max-w-[1400px] flex-col items-center justify-center gap-6 px-4">
          <div className="w-full">
            <SphereScene />
          </div>

          <p className="pointer-events-none text-base text-neutral-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            click the Spheres to explore the site
          </p>
        </div>
      </div>
    </Theme>
  );
};

export default Intro;