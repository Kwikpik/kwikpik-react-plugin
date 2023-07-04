const { default: resolve } = require("@rollup/plugin-node-resolve");
const { default: commonjs } = require("@rollup/plugin-commonjs");
const { default: typescript } = require("@rollup/plugin-typescript");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const tailwindcss = require("tailwindcss");

const packageJson = require("./package.json");
const extensions = [".tsx", ".ts", ".jsx", ".js"];

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions, browser: true }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    postcss({
      plugins: [require("autoprefixer")(), tailwindcss(require("./tailwind.config"))],
      extensions: [".css"],
      config: { path: "./postcss.config.js" },
      minimize: false,
      inject: {
        insertAt: "top",
      },
    }),
  ],
};
