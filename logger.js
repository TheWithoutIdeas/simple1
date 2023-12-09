/* 
  Makes logs more pretty (SIMPLE1 logs)
*/
const colors = {
  red: "\x1b[31m",
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  bold: "\x1b[1m"
}

module.exports = {
  NodeError: function(e) {
    console.error(colors.red + colors.bold + "[SIMPLE1::NodeError]" + colors.reset);
    console.error(e);
  },
  Error: function(e) {
    console.error(colors.red + colors.bold + "[SIMPLE1::Error]: " + e + colors.reset);
  },
  Log: function(e) {
    console.log(colors.blue + colors.bold + "[SIMPLE1]: " + colors.reset + e);
  },
  colors
}