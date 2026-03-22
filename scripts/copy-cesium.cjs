/**
 * Copies Cesium static assets (Workers, Assets, etc.) into public/cesium
 * so CESIUM_BASE_URL=/cesium works after `yarn install`.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "node_modules", "cesium", "Build", "Cesium");
const dest = path.join(root, "public", "cesium");

if (!fs.existsSync(src)) {
  console.warn("[copy-cesium] Skip: Cesium build not found at", src);
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}
fs.cpSync(src, dest, { recursive: true });
console.log("[copy-cesium] Copied Cesium assets to public/cesium");
