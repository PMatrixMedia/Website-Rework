"use client";

import { HomeIcon } from "@radix-ui/react-icons";
import { PhaseNavBar } from "@/app/Components/Nav/PhaseNavBar";

export function FeaturesTopNav() {
  return (
    <div className="features-page-nav">
      <PhaseNavBar
        items={[
          { key: "home", href: "/", label: "Home", Icon: HomeIcon },
          { key: "main", href: "/main", label: "Main" },
        ]}
      />
    </div>
  );
}
