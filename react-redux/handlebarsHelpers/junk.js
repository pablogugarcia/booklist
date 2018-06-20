console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

module.exports = (a, { data: { root: htmlWebpackPlugin } }) => {
  console.log("A", a);
  //console.log("b", htmlWebpackPlugin);
  console.log("b", Object.keys(htmlWebpackPlugin));
  console.log("baa", JSON.stringify(htmlWebpackPlugin.htmlWebpackPlugin.files.js));

  //return " {{junk htmlWebpackPlugin.files.js }}";
  return "Hello";
};
