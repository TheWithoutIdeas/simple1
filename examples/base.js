
const simple1 = require("../index"), fs = require("fs"), args = process.argv;
var f = "./example1.simple1";
if(args&&args[2]) f = args[2];
var code = fs.readFileSync(require("path").join(__dirname,f), "utf-8");
simple1(code);