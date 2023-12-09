
const fs = require("fs"), logger = require("../logger");

function load(content, m) {
  var tryExtract = content.match(/!(.*?)(!)/);
  if(!tryExtract) {
    logger.Error("Failed to extract mods from script.");
  } else {
    var mods = tryExtract[1]?.split(":");
    if(mods.length > 1) {
      mods.forEach(mod => {
        var modChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_", rgxp=new RegExp(`^[${modChars}]+$`);
        if(rgxp.test(mod)) {
          if(mod.startsWith("s_")) m[mod.slice(2)] = [];
          else m[mod] = '0';
        }
      })
    }
  }
  return m;
}

module.exports = function(firstLine, m) {
  var paths = JSON.parse(firstLine);
  paths.forEach(path => {
    if(!path.endsWith(".simple1.mod")) logger.Error(logger.colors.red + logger.colors.bold + path + logger.colors.reset + " is not a mod.");
    else m=load(fs.readFileSync(path, "utf-8"),m)
  })
  return m;
}