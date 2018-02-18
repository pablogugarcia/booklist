const Builder = require("systemjs-builder");

let builder = new Builder("../");
builder.config({
  packages: {
    // meaning [baseURL]/local/package when no other rules are present
    // path is normalized using map and paths configuration
    "": {
      defaultExtension: "js",
      map: {
        // use local jquery for all jquery requires in this package
        //'jquery': './vendor/local-jquery.js',
        // import '/local/package/custom-import' should route to '/local/package/local/import/file.js'
        //'./custom-import': './local/import/file.js'
      },
      meta: {
        // sets meta for modules within the package
        // 'vendor/*': {
        //   'format': 'global'
        // }
      }
    }
  }
});

builder.bundle("../buildFile.js", "../public/bundles/buildFile-bundled.js");
