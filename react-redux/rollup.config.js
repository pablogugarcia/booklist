import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify-es";
import babel from "rollup-plugin-babel";

const production = false; //!process.env.ROLLUP_WATCH;

const plugins = [
  resolve(),
  commonjs({
    namedExports: {
      "node_modules/react/index.js": ["Children", "Component", "createElement"],
      "node_modules/react-dom/index.js": ["render"]
    }
  }),
  babel({
    exclude: "node_modules/**",
    presets: ["react"],
    plugins: ["transform-decorators-legacy", "transform-class-properties", "transform-object-rest-spread"]
  })
];

export default [
  // ES module version, for modern browsers
  {
    input: ["./tempRollupEntry.js"],
    output: {
      dir: "public/module",
      format: "es",
      sourcemap: true
    },
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true,
    plugins
  },

  // SystemJS version, for older browsers
  {
    input: ["./tempRollupEntry.js"],
    output: {
      dir: "public/nomodule",
      format: "system",
      sourcemap: true
    },
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true,
    plugins
  }
];
