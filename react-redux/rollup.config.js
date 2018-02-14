import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify-es";
import babel from "rollup-plugin-babel";
import alias from "rollup-plugin-alias";

const production = false; //!process.env.ROLLUP_WATCH;

const appRootFiles = ["renderUI", "rootReducer", "rootReducerActionCreators", "rootReducerActionNames", "store"];
const appRootComponentFiles = [
  "bootstrapButton",
  "colorsPalette",
  "componentLoading",
  "customColorPicker",
  "genericLabelSelect",
  "header",
  "labelDisplay",
  "loading",
  "mainNavigation",
  "manualBookEntry"
];
const utilFiles = ["ajaxUtil", "graphqlUtil"];

let aliasObj = Object.assign(
  {},
  appRootFiles.reduce((obj, file) => ((obj[`applicationRoot/${file}`] = `applicationRoot/${file}.js`), obj), {}),
  appRootComponentFiles.reduce((obj, file) => ((obj[`applicationRoot/components/${file}`] = `applicationRoot/components/${file}.js`), obj), {}),
  {
    reactStartup: "reactStartup.js",
    jscolor: "util/jsColor.js",
    "modules/subjects/reducers/reducer": "modules/subjects/reducers/reducer.js",
    "modules/books/reducers/bookSearch/reducer": "modules/books/reducers/bookSearch/reducer.js",
    "modules/books/reducers/subjects/reducer": "modules/books/reducers/subjects/reducer.js",
    "modules/subjects/reducers/actionCreators": "modules/subjects/reducers/actionCreators.js",
    "modules/books/reducers/books/reducer": "modules/books/reducers/books/reducer.js",
    "modules/scan/reducers/actionNames": "modules/scan/reducers/actionNames.js",
    "util/immutableHelpers": "util/immutableHelpers.js",
    "modules/books/reducers/tags/reducer": "modules/books/reducers/tags/reducer.js",
    "modules/books/reducers/books/actionCreators": "modules/books/reducers/books/actionCreators.js",
    "modules/books/reducers/bookSearch/actionCreators": "modules/books/reducers/bookSearch/actionCreators.js",
    "modules/books/reducers/books/actionNames": "modules/books/reducers/books/actionNames.js"
  },
  utilFiles.reduce((obj, file) => ((obj[`util/${file}`] = `util/${file}.js`), obj), {})
);

const plugins = [
  alias(aliasObj),
  json({
    include: "node_modules/**",
    indent: "  "
  }),
  resolve(),
  commonjs({
    include: "node_modules/**",
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
  }

  // SystemJS version, for older browsers
  // {
  //   input: ["./reactStartup.js"],
  //   //input: ["./tempRollupEntry.js"],
  //   output: {
  //     dir: "public/nomodule",
  //     format: "system",
  //     sourcemap: false
  //   },
  //   experimentalCodeSplitting: true,
  //   experimentalDynamicImport: true,
  //   plugins
  // }
];
