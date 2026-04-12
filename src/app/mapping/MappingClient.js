"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../Pages/Mapping/map"), { ssr: false });

export default function MappingClient() {
  return <MapView />;
}
