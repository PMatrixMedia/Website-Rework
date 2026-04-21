import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      ".yarn/**",
      "edge-profile/**",
      "edge-profile-status/**",
      "public/cesium/**",
    ],
  },
];

export default eslintConfig;
