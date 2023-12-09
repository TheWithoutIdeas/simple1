// some helper functions & fs
const getMods = require("./getMods"), tokenize = require("../parser/tokenizer"), parse = require("../parser/parser"), fs = require("fs"), logger = require("../logger"), readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });

// for + or - repetition
function basic(modToAdd, left, m, right) {
  // right-1 because when using + or - it automatically adds or removes 1 from value. repeating X times means repeating X-1 times because you already did the operation once.
  if(!modToAdd) return m;
  switch(left) {
    case "inc":
      m[modToAdd] += right-1;
      return m;
    case "dec":
      m[modToAdd] -= right-1;
      return m;
    default:
      return false;
  }
}

// the god function (actually runs the parsed tokens)
function runE(steps, m) {
  var prep = {mods:[],op:[],calcres:'0'}
  
  for(let j = 0; j < steps.length; j++) {
    var step = steps[j], left = steps[j-1], right = steps[j+1];
  
    switch(step) {
      // increment and decrementation
      case "inc":
      case "dec":
        // just increment c:
        var lastmod=prep.mods[prep.mods.length-1];
        
        if(m[lastmod]) {
          if(step === "inc") {m[lastmod]++;prep.calcres=m[lastmod];}
          if(step === "dec") {m[lastmod]--;prep.calcres=m[lastmod];}
        }
        prep.op.push(step);
        break;

      // repetition and loops
      case "rep":
        // you need left and right arguments.
        if(!left||!right||right===0)break;

        // just some basic starter stuff
        var rightValue = (Number(right)||Number(prep[right])||1), modToAdd = prep.mods[prep.mods.length-1]; basicExe = basic(modToAdd, left, m, rightValue);
        prep.op.push(step);

        // if not basic (+ or -)
        if(!basicExe) {
          // repeat last operation rightValue times. (recall runE function)
          for(let i = 0; i <= rightValue; i++) {
            m=runE(prep.op, m).m;
          }
        } else {
          // basicExe is gonna return the modified version of m
          m=basicExe;
        }
        j++; // skip over right argument since it was already read.
        break;

      // out operation
      case "out":
        // value is what's left of out
        var val = left;
        if(!val)break;

        // if value is another out, check calculation result from this operation (example: a---->> when a=20 will output 16 because 20-4=16 (4 being the amount of times we decremented 1 from a (20)))
        if(right === "out") {
          logger.Log(prep.calcres);
          j++;
          break;
        };

        // if there's no module with name stored in val, just output val.
        if(!m[val]) {logger.Log(val);break;}

        // if stackable module
        if(Array.isArray(m[val])) {
          // convert stack to string and output
          var out = String.fromCharCode(...m[val]);
          logger.Log(out);
        } else logger.Log(m[val]); // if not stackable module
        prep.op.push(step);
        break;

      // in operation
      case "in":
        // if no module to write input to and no existing operation specified after...
        var tfind = m.OPERATIONS.find(t=>t.name===right), mod=left;
        if(!mod||!m.hasOwnProperty(mod)||!right||!tfind) break;
        else {
          readline.question(logger.colors.blue + logger.colors.bold + "[SIMPLE1::INPUT]: " + logger.colors.reset, out => {
            var success=true;
            if(out === 0 || Number(out)) {
              if(!Array.isArray(m[mod])) {
                m[mod] = out;
              } else {
                logger.Error("Cannot write number to stackable module.");
                success=false;
              }
            } else {
              if(Array.isArray(m[mod])) {
                var arr = [], pointer = 0;
                while(pointer<out.length) {
                  arr.push(out.charCodeAt(pointer));
                  pointer++;
                }
                m[mod] = arr;
              } else {
                logger.Error("Cannot write string to non-stackable module.");
                success=false;
              }
            }
            if(success) {
              var promise = new Promise((res,rej) => {
                var r = runE(tfind.body,m);
                m=r.m;
                prep=r.prep;
                res();
              })
              promise.then(() => readline.close());
            } else {
              readline.close();
            }
            j++;
          })
        }
        
        break;

      // create operation
      case "create_op":
        // if no name
        if(!right)break;

        // m.OPERATIONS list.
        var o = m.OPERATIONS;
        if(!o) m.OPERATIONS = [];
        // if the user did not assign anything to the operation, just return m again.
        if(!steps.includes("asg_op")) return {m};
        else {
          // if there was an operation assignment, get everything after that (EVERYTHING until the end of the instruction steps) and push that operation with the name and the body.
          var os = steps.indexOf("asg_op"), everyafter = steps.slice(os+1);
          m.OPERATIONS.push({ name: right, body: everyafter });
          return {m};
        }

      // call operation
      case "call_op":
        // no operation name defined.
        var tfind = m.OPERATIONS.find(t=>t.name===right);
        if(!right||!tfind)break;
        // run operation
        var r = runE(tfind.body,m);
        m=r.m;
        prep=r.prep;
        j++;
        break;

      // push operation
      case "push":
        // no definition of these modules
        if(!left||!right||!m[left]||!m[right]||!Array.isArray(m[left]))break;

        // if pushing stack to stack
        if(Array.isArray(m[right])) {
          m[right].forEach(e=>m[left].push(e)); // push each element in right stack to left stack.
        } else m[left].push(m[right]); // if pushing normal module to stack
        j++;
        break;

      // reset operation
      case "reset":
        // if there's absolutely no arguments, return.
        if(!right&&!left) break;
        
        // if there's no right module definition, get left module definition
        var val = right
        if(!val) val = left;
        if(!m[val]) break;
        if(!Array.isArray(m[val])) m[val] = "0";
        else m[val] = [];
        prep.calcres = '0';
        j++;
        break;

      // multiplication/division operation
      case "mult":
      case "div":
        // is multiplication operation
        var isMul = true;
        if(step === "div") isMul=false;
        
        // if no arguments, break.
        if(!right&&!left) break;

        // left is the module to be be reassigned, however, if it's not a module (5*3 for example) but just a simple calculation, the module this information it's gonna be stored at is prep.calcres which can be outted only.
        var mod1 = m[left], mod2 = m[right], isMOD = true;
        if(!mod1) {mod1 = left;isMOD=false}
        if(!mod2) mod2 = right;
        // result
        var res = (isMul)?mod1*mod2:mod1/mod2;
        if(isMOD) m[left]=res;
        prep.calcres = res;
        
        break;

      // ??!?!?!?!?!??!?!?!?!?!?! default?!?!?!?! damn
      default:
        // is word or number or a module
        if(m[step]) {
          prep.mods.push(step);
          prep.op.push(step);
          break;
        }
        break;
    }
  }
  
  return {m,prep};
}

// compiler
module.exports = function(code) {
  var mem = {a:"0",b:"0",c:[]}, tokens = tokenize(code), parsed = parse(tokens), fl = parsed[0]?.steps[0];
  
  // if first step is first_line, 
  if(fl&&fl.startsWith("[")&&fl.endsWith("]")) {
    mem=getMods(fl, mem);
    parsed[0].steps.slice(0, 1); // remove first line from being interpreted as an operation
  }

  // run the compiler
  for(let i = 0; i < parsed.length; i++) {
    var operation = parsed[i];
    if(operation.steps.length>=1) {
      mem=runE(operation.steps, mem).m;
    }
  }
}