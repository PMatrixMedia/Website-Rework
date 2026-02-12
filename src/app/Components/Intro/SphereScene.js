"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as BABYLON from "babylonjs";

// Gradient colors for each sphere (from original Intro.js)
const SPHERE_CONFIG = [
  {
    id: "pink",
    colors: ["#ff7e5f", "#feb47b"],
    caption: "Home",
    first: "Main Site",
    second: null,
    navPath: "/main",
  },
  {
    id: "blue",
    colors: ["#2193b0", "#6dd5ed"],
    caption: "VR & AR",
    first: "Projects & Services",
    navPath: "https://phasevr-pmatrix.vercel.app/",
  },
  {
    id: "tomato",
    colors: ["#ff6347", "#ff4500"],
    caption: "Who I am",
    first: "Portfolio",
    navPath: "/about",
  },
];

function createGradientTexture(name, color1, color2, scene) {
  const size = 256;
  const texture = new BABYLON.DynamicTexture(name, size, scene);
  const ctx = texture.getContext();
  const gradient = ctx.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  texture.update();
  return texture;
}

function createLabelTexture(name, caption, first, second, scene) {
  const size = 512;
  const texture = new BABYLON.DynamicTexture(name, size, size, scene);
  const ctx = texture.getContext();

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "black";
  ctx.font = "bold 53px Arial";
  ctx.textAlign = "center";
  ctx.fillText(caption, size / 2, 120);

  ctx.font = "bold 41px Arial";
  ctx.fillText(first, size / 2, 220);
  if (second) {
    ctx.font = "bold 29px Arial";
    ctx.fillText(second, size / 2, 280);
  }

  texture.update();
  return texture;
}

const SphereScene = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.145, 0.196, 0.216, 1); // #253237
    sceneRef.current = scene;

    // Camera - orthographic or perspective for nice overlap view
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      14,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 20;
    camera.minZ = 0.1;

    // Light
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 1),
      scene
    );
    light.intensity = 1.2;

    const spheres = [];
    const sphereRadius = 1.5;
    const overlap = -1;

    SPHERE_CONFIG.forEach((config, index) => {
      // Position spheres in a row with overlap (like the original circles)
      const xOffset = index * (sphereRadius * 2 - overlap) - (SPHERE_CONFIG.length - 1) * (sphereRadius - overlap / 2);
      const position = new BABYLON.Vector3(xOffset, 0, 0);

      const sphere = BABYLON.MeshBuilder.CreateSphere(
        `sphere_${config.id}`,
        { diameter: sphereRadius * 2, segments: 32 },
        scene
      );
      sphere.position = position;

      const material = new BABYLON.StandardMaterial(`mat_${config.id}`, scene);
      const gradientTex = createGradientTexture(
        `grad_${config.id}`,
        config.colors[0],
        config.colors[1],
        scene
      );
      material.diffuseTexture = gradientTex;
      material.emissiveTexture = gradientTex;
      material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      sphere.material = material;

      // Curved label wrapping around the front of the sphere (cylinder segment)
      const labelHeight = 2;
      const labelArc = 0.5; // 180 degrees - wraps around front half
      const labelCylinder = BABYLON.MeshBuilder.CreateCylinder(
        `label_${config.id}`,
        {
          height: labelHeight,
          diameter: sphereRadius * 2 + 0.3,
          tessellation: 32,
          arc: labelArc,
        },
        scene
      );
      labelCylinder.position = position.clone();
      // Rotate so the curved arc faces front (camera); default arc faces +Z
      labelCylinder.rotation.y = 10 ;
      labelCylinder.renderingGroupId = 1;

      const labelMat = new BABYLON.StandardMaterial(`labelMat_${config.id}`, scene);
      const labelTex = createLabelTexture(
        `labelTex_${config.id}`,
        config.caption,
        config.first,
        config.second,
        scene
      );
      labelMat.diffuseTexture = labelTex;
      labelMat.diffuseTexture.hasAlpha = true;
      labelMat.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
      labelMat.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
      labelMat.diffuseTexture.uScale = 2; // Stretch texture across the 180° arc
      labelMat.backFaceCulling = false;
      labelMat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      labelMat.depthFunction = BABYLON.Engine.ALWAYS;
      labelMat.disableDepthWrite = true;
      labelCylinder.material = labelMat;

      labelCylinder.isPickable = false;

      const labelPlane = labelCylinder; // Keep variable name for compatibility with hover/scale logic

      sphere.metadata = { config, labelPlane };
      spheres.push(sphere);

      // Hover effect
      sphere.onPointerEnter = () => {
        scene.hoverCursor = "pointer";
        sphere.scaling = new BABYLON.Vector3(1.15, 1.15, 1.15);
        labelPlane.scaling = new BABYLON.Vector3(1.15, 1.15, 1.15);
      };
      sphere.onPointerOut = () => {
        scene.hoverCursor = "";
        sphere.scaling = BABYLON.Vector3.One();
        labelPlane.scaling = BABYLON.Vector3.One();
      };

      sphere.actionManager = new BABYLON.ActionManager(scene);
      sphere.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
          if (config.navPath) {
            if (
              config.navPath.startsWith("http://") ||
              config.navPath.startsWith("https://")
            ) {
              window.open(config.navPath, "_blank", "noopener,noreferrer");
            } else {
              router.push(config.navPath);
            }
          }
        })
      );
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    engine.runRenderLoop(() => scene.render());

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        maxWidth: "1400px",
        height: "50vh",
        minHeight: "400px",
        touchAction: "none",
        outline: "none",
      }}
    />
  );
};

export default SphereScene;
