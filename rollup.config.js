import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: "build/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        // sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        // sourcemap: true,
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**"],
        include: ["node_modules/**"],
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      terser(),
      autoExternal(),
    ],
    external: [/lodash/, /@mui\//],
  },
  {
    input: "build/dts/index.d.ts",
    output: [{ file: "dist/dts/index.d.ts" }],
    plugins: [dts()],
  },
  {
    input: "build/index.js",
    output: [
      {
        file: `dist/${pkg.name}.min.js`,
        format: "umd",
        name: "EnhancedTable",
        exports: "named",
        // sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**"],
        include: ["node_modules/**"],
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
];

export default config;
