"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PhaseNavBar } from "@/app/Components/Nav/PhaseNavBar";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  Theme,
  Box,
  Text,
  Container,
  Strong,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function GlobalMappingPage() {
  const viewerWrapRef = useRef(null);
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = viewerWrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      // Start top-right (above + off to the right); settle centered with vertical + horizontal bounce
      gsap.set(wrap, { x: "110%", y: "-115%", opacity: 0.6 });
      gsap.to(wrap, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 2.5,
        ease: "bounce.out",
        delay: 0.12,
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const container = viewerContainerRef.current;
    if (!container) return;

    let destroyed = false;

    // No Ion token: default Viewer terrain/imagery hits api.cesium.com and often fails in production.
    const osm = new Cesium.OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
    });
    const viewer = new Cesium.Viewer(container, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      fullscreenButton: true,
      vrButton: false,
      geocoder: false,
      homeButton: true,
      sceneModePicker: true,
      navigationHelpButton: false,
      infoBox: true,
      selectionIndicator: true,
      shouldAnimate: true,
      imageryProvider: osm,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    });

    viewer.scene.globe.enableLighting = true;

    const GERMANY_DESC =
      '<div style="font-family:system-ui,sans-serif;padding:8px;max-width:280px;"><strong>Germany</strong><br/>Federal Republic of Germany (Bundesrepublik Deutschland).</div>';
    const BERLIN_DESC =
      '<div style="font-family:system-ui,sans-serif;padding:8px;max-width:280px;"><strong>Berlin</strong><br/>Capital and largest city of Germany.</div>';

    async function loadGermanyOutline() {
      const urls = [
        "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const geo = await res.json();
          const features = (geo.features || []).filter(
            (f) =>
              f.properties?.ISO_A2 === "DE" ||
              f.properties?.ISO_A3 === "DEU" ||
              f.properties?.ADM0_A3 === "DEU" ||
              f.properties?.ADMIN === "Germany",
          );
          if (features.length === 0) continue;
          const ds = await Cesium.GeoJsonDataSource.load(
            { type: "FeatureCollection", features },
            {
              stroke: Cesium.Color.WHITE,
              strokeWidth: 2,
              fill: Cesium.Color.fromCssColorString("#22c55e").withAlpha(0.38),
              clampToGround: true,
            },
          );
          if (destroyed) return;
          viewer.dataSources.add(ds);
          ds.entities.values.forEach((entity) => {
            entity.name = "Germany";
            entity.description = GERMANY_DESC;
          });
          return;
        } catch {
          /* try next / fallback */
        }
      }
      if (destroyed) return;
      viewer.entities.add({
        id: "germany-outline-fallback",
        name: "Germany",
        description: GERMANY_DESC,
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(5.87, 47.27, 15.04, 55.06),
          material: Cesium.Color.fromCssColorString("#22c55e").withAlpha(0.35),
          outline: true,
          outlineColor: Cesium.Color.LIME,
          outlineWidth: 2,
          height: 0,
        },
      });
    }

    function addBerlin() {
      viewer.entities.add({
        id: "berlin-city",
        name: "Berlin",
        description: BERLIN_DESC,
        position: Cesium.Cartesian3.fromDegrees(13.405, 52.52, 800),
        point: {
          pixelSize: 16,
          color: Cesium.Color.fromCssColorString("#f97316"),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: "Berlin",
          font: "bold 15px system-ui,sans-serif",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    }

    /** Prefer Berlin when it overlaps Germany in the pick list */
    function pickClickableEntity(windowPosition) {
      const picks = viewer.scene.drillPick(windowPosition, 8);
      for (let i = 0; i < picks.length; i++) {
        const e = picks[i]?.id;
        if (!e || !(e instanceof Cesium.Entity)) continue;
        if (e.id === "berlin-city" || e.name === "Berlin") return e;
      }
      for (let i = 0; i < picks.length; i++) {
        const e = picks[i]?.id;
        if (!e || !(e instanceof Cesium.Entity)) continue;
        if (e.name === "Germany") return e;
      }
      const single = viewer.scene.pick(windowPosition);
      const ent = single?.id;
      if (ent instanceof Cesium.Entity) return ent;
      return undefined;
    }

    const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    clickHandler.setInputAction((click) => {
      const entity = pickClickableEntity(click.position);
      if (entity) {
        viewer.selectedEntity = entity;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewerRef.current = viewer;

    (async () => {
      await loadGermanyOutline();
      if (destroyed) return;
      addBerlin();
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(10.45, 51.05, 1850000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-78),
          roll: 0,
        },
      });
    })();

    return () => {
      destroyed = true;
      clickHandler.destroy();
      viewerRef.current = null;
      if (!viewer.isDestroyed()) viewer.destroy();
    };
  }, []);

  return (
    <Theme
      appearance="dark"
      accentColor="gray"
      grayColor="slate"
      radius="medium"
    >
      <PhaseNavBar
        items={[
          {
            key: "main",
            href: "/main",
            Icon: ArrowLeftIcon,
            label: (
              <Text size="6">
                <Strong>Main</Strong>
              </Text>
            ),
          },
        ]}
      />

      <Container
        size="4"
        className="mx-auto max-w-6xl overflow-hidden px-4 py-8"
      >
        <Text as="h1" size="8" className="mb-6 block text-center">
          <Strong>GlobalMapping</Strong>
        </Text>
        <div ref={viewerWrapRef} className="will-change-transform">
          <div
            ref={viewerContainerRef}
            className="cesium-viewer-host mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 shadow-lg"
            style={{ height: "70vh", minHeight: 420 }}
          />
        </div>
      </Container>
    </Theme>
  );
}
