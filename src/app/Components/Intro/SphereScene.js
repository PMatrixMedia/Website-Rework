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
    first: "MainSite",
    navPath: "/main",
  },
  {
    id: "blue",
    colors: ["#2193b0", "#6dd5ed"],
    caption: "AR&VR",
    first: "Projects & Services",
    navPath: "https://newphasevr.vercel.app/",
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
  const size = 800;
  const texture = new BABYLON.DynamicTexture(name, size, scene);
  const ctx = texture.getContext();
  // Mirror gradient: color1 -> color2 -> color1 for seamless wrap around sphere
  const gradient = ctx.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(0.5, color2);
  gradient.addColorStop(1, color1);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
  texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  texture.update();
  return texture;
}

function createLabelTexture(name, caption, scene) {
  const scale = 4;
  const size = 2550;
  const centerY = size / 2;
  const centerX = size / 2;
  const texture = new BABYLON.DynamicTexture(name, size, size, scene);
  const ctx = texture.getContext();

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, size, size);

  const tailwindFont = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  ctx.font = `${Math.round(70 * scale)}px ${tailwindFont}`;
  ctx.fillText(caption, centerX, centerY);

  texture.update();
  return texture;
}

function createFirstLabelTexture(name, first, scene) {
  const size = 712;
  const texture = new BABYLON.DynamicTexture(name, size, scene);
  texture.hasAlpha = true;
  const ctx = texture.getContext();

  ctx.clearRect(0, 0, size, size);

  const tailwindFont = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `85px ${tailwindFont}`;

  // Stretch text vertically - letters taller
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(1, 1.6);
  ctx.fillText(first, 0, 0);
  ctx.restore();

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
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // black
    sceneRef.current = scene;

    // Camera - view plate and spheres
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.4,
      18,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 20;
    camera.minZ = 0.1;

    // Light - from top-left for glossy sphere highlights
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(-0.5, 1, 0.5),
      scene
    );
    light.intensity = 1.2;

    // Circular plate - PhaseMatrixMedia disc with spheres on top
    const plateRadius = 9;
    const plate = BABYLON.MeshBuilder.CreateDisc(
      "phasematrixPlate",
      { radius: plateRadius, tessellation: 64 },
      scene
    );
    plate.rotation.x = -Math.PI / 2; // Lay flat in XZ plane
    plate.position.y = -3; // Lowered - spheres float above
    plate.renderingGroupId = 0;

    const plateMat = new BABYLON.StandardMaterial("plateMat", scene);
    const plateTexture = new BABYLON.Texture("/Images/phasematrixplate.png", scene);
    plateTexture.uScale = 1;
    plateTexture.vScale = 1;
    plateTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    plateTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
    plateMat.diffuseTexture = plateTexture;
    plateMat.emissiveTexture = plateTexture;
    plateMat.emissiveColor = new BABYLON.Color3(0.25, 0.25, 0.25);
    plateMat.backFaceCulling = false;
    plateMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    plate.material = plateMat;
    plate.isPickable = false;

    const spheres = [];
    const sphereRadius = 2.5;

    // Continuous rotation: spheres on a circle, rotate 360° then pause
    const SPHERE_HEIGHT = 2.5;
    const ORBIT_RADIUS = 4.5;
    const ROTATION_DURATION_MS = 5000; // One full revolution
    const PAUSE_DURATION_MS = 2000;

    // Ease in-out for smooth accelerate/decelerate
    function cubicEaseInOut(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let rotationStartTime = 0;
    let pauseStartTime = 0;
    let state = "paused"; // "rotating" | "paused"

    SPHERE_CONFIG.forEach((config, index) => {
      // Initial position: sphere 0 at front (angle 0), 1 at 120°, 2 at 240°
      const angleOffset = (index * 2 * Math.PI) / 3;
      const position = new BABYLON.Vector3(
        ORBIT_RADIUS * Math.sin(angleOffset),
        SPHERE_HEIGHT,
        ORBIT_RADIUS * Math.cos(angleOffset)
      );

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
      material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      material.specularPower = 64;
      sphere.material = material;

      // Curved label wrapping around the front of the sphere (cylinder segment)
      const labelHeight = 4;
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
      labelCylinder.position = BABYLON.Vector3.Zero();
      labelCylinder.parent = sphere; // Label moves with sphere
      labelCylinder.rotation.y = 10;
      labelCylinder.renderingGroupId = 1;

      const labelMat = new BABYLON.StandardMaterial(`labelMat_${config.id}`, scene);
      const labelTex = createLabelTexture(
        `labelTex_${config.id}`,
        config.caption,
        scene
      );
      labelMat.diffuseTexture = labelTex;
      labelMat.diffuseTexture.hasAlpha = true;
      labelMat.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
      labelMat.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
      labelMat.diffuseTexture.uScale = 2;
      labelMat.backFaceCulling = false;
      labelMat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      labelMat.depthFunction = BABYLON.Engine.ALWAYS;
      labelMat.disableDepthWrite = true;
      labelCylinder.material = labelMat;

      labelCylinder.isPickable = false;

      // White "first" text below each sphere - horizontal on x, centered on z
      const firstPlane = BABYLON.MeshBuilder.CreatePlane(
        `first_${config.id}`,
        { width: 7, height: 1.2 },
        scene
      );
      // Position below sphere - raised so text floats higher above plate
      firstPlane.position = new BABYLON.Vector3(0, -sphereRadius - 0.4, 0);
      firstPlane.parent = sphere;
      // Orient horizontal (face camera) - billboard keeps text readable and horizontal
      firstPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_X;
      const firstTex = createFirstLabelTexture(`firstTex_${config.id}`, config.first, scene);
      const firstMat = new BABYLON.StandardMaterial(`firstMat_${config.id}`, scene);
      firstMat.diffuseTexture = firstTex;
      firstMat.diffuseTexture.hasAlpha = true;
      firstMat.emissiveTexture = firstTex;
      firstMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
      firstMat.backFaceCulling = false;
      firstMat.depthFunction = BABYLON.Engine.ALWAYS;
      firstMat.disableDepthWrite = true;
      firstPlane.material = firstMat;
      firstPlane.renderingGroupId = 1;
      firstPlane.isPickable = false;

      const labelPlane = labelCylinder; // Keep variable name for compatibility with hover/scale logic

      sphere.metadata = { config, labelPlane, firstPlane };
      spheres.push(sphere);

      // Hover effect (labelPlane is child of sphere, scales with it)
      sphere.onPointerEnter = () => {
        scene.hoverCursor = "pointer";
        sphere.scaling = new BABYLON.Vector3(1.15, 1.15, 1.15);
      };
      sphere.onPointerOut = () => {
        scene.hoverCursor = "";
        sphere.scaling = BABYLON.Vector3.One();
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

    // Continuous rotation: update sphere positions each frame
    const rotationObserver = scene.onBeforeRenderObservable.add(() => {
      const now = performance.now();

      if (state === "paused") {
        if (now - pauseStartTime >= PAUSE_DURATION_MS) {
          state = "rotating";
          rotationStartTime = now;
        }
        return;
      }

      const elapsed = now - rotationStartTime;
      const t = Math.min(elapsed / ROTATION_DURATION_MS, 1);

      if (t >= 1) {
        // Revolution complete - snap to final positions and pause
        spheres.forEach((sphere, index) => {
          const angleOffset = (index * 2 * Math.PI) / 3;
          sphere.position.x = ORBIT_RADIUS * Math.sin(angleOffset);
          sphere.position.z = ORBIT_RADIUS * Math.cos(angleOffset);
        });
        state = "paused";
        pauseStartTime = now;
        return;
      }

      const easedT = cubicEaseInOut(t);
      const angle = easedT * 2 * Math.PI;

      spheres.forEach((sphere, index) => {
        const angleOffset = (index * 2 * Math.PI) / 3;
        const totalAngle = angle + angleOffset;
        sphere.position.x = ORBIT_RADIUS * Math.sin(totalAngle);
        sphere.position.z = ORBIT_RADIUS * Math.cos(totalAngle);
      });
    });

    // Start first rotation after brief delay
    state = "rotating";
    rotationStartTime = performance.now();

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    engine.runRenderLoop(() => scene.render());

    return () => {
      scene.onBeforeRenderObservable.remove(rotationObserver);
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      className="sphere-canvas"
    />
  );
};

export default SphereScene;
