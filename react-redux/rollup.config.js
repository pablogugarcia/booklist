import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify-es";
import babel from "rollup-plugin-babel";

const production = false; //!process.env.ROLLUP_WATCH;

const plugins = [
  json({
    include: "node_modules/**",
    indent: "  "
  }),
  resolve(),
  commonjs({
    namedExports: {
      "node_modules/react/index.js": ["Children", "PureComponent", "Component", "createElement"],
      "node_modules/react-dom/index.js": ["render", "findDOMNode", "unmountComponentAtNode"],
      "node_modules/react-dnd/lib/index.js": ["DragLayer", "DropTarget", "DragSource", "DragDropContext"]
    }
  }),
  typescript({
    typescript: require("typescript")
  }),
  babel({
    exclude: "node_modules/**",
    presets: ["react"],
    plugins: ["syntax-dynamic-import", /*"transform-decorators-legacy",*/ "transform-class-properties", "transform-object-rest-spread"]
  })
];

export default [
  // ES module version, for modern browsers
  {
    input: ["./reactStartup.ts"],
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
    input: ["./reactStartup.ts"],
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
