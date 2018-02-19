import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify-es";
import babel from "rollup-plugin-babel";
import alias from "rollup-plugin-alias";
import includePaths from "rollup-plugin-includepaths";
import string from "rollup-plugin-string";
import postcss from "rollup-plugin-postcss";
import replace from "rollup-plugin-replace";

const production = false; //!process.env.ROLLUP_WATCH;

const plugins = [
  alias({ jscolor: "util/jsColor.js" }),
  includePaths({ paths: ["./"] }),
  json({
    include: "node_modules/**",
    indent: "  "
  }),
  string({
    include: "**/*.htm"
  }),
  postcss({
    plugins: []
  }),
  replace({
    "process.env.NODE_ENV": JSON.stringify("production")
  }),
  resolve({
    preferBuiltins: false,
    browser: true
  }),
  commonjs({
    include: "node_modules/**",

    //include: "./**"
    namedExports: {
      "node_modules/react/index.js": ["Children", "PureComponent", "Component", "createElement"],
      "node_modules/react-dom/index.js": ["render", "findDOMNode", "unmountComponentAtNode"],
      "node_modules/react-dnd/lib/index.js": ["DragLayer", "DropTarget", "DragSource", "DragDropContext"]
    }
  }),
  babel({
    exclude: "node_modules/**",
    presets: ["react"],
    plugins: ["syntax-dynamic-import", "transform-class-properties", "transform-object-rest-spread"]
  })
];

export default [
  // ES module version, for modern browsers
  {
    input: ["./reactStartup.js"],
    //input: ["./tempRollupEntry.js"],
    output: {
      dir: "public/module",
      format: "es",
      sourcemap: false
    },
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true,
    plugins
  },

  // SystemJS version, for older browsers
  {
    input: ["./reactStartup.js"],
    //input: ["./tempRollupEntry.js"],
    output: {
      dir: "public/nomodule",
      format: "system",
      sourcemap: false
    },
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true,
    plugins
  }
];
