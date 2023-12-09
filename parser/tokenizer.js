/* 
  Tokenizer
*/
const tokens = require("./tokens.json"), validchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_", nums = "1234567890.", modsTk = {"a":"a","b":"b","c":"c"};

// for word and nums
function wordandnum(char, b, tks) {
  
  // start by checking if is word
  if(b.isWord) {
    if(validchars.includes(char)) {
      b.word+=char;
    } else {
      
      // check if b.word is a,b,c -> mod_a, mod_b, mod_c. If not, just push it as a word token instead.
      if(modsTk[b.word]) tks.push({ type: modsTk[b.word] })
      else tks.push({ type: "word", word: b.word })

      // reset b.word and b.isWord
      b.word = "";
      b.isWord = false;
    }
  } else {
    if(validchars.includes(char)) {
      b.word+=char;
      b.isWord=true
    } else {
      // same thing we did for b.isWord, do for b.isNum
      if(b.isNum) {
        if(nums.includes(char)) {
          b.num += char;
        } else {
          tks.push({ type: "num", num: b.num })
          b.num = "";
          b.isNum = false;
        }
      } else {
        if(nums.includes(char)) {
          b.num += char;
          b.isNum = true;
        }
      }
    }
  }

  return {b, tks};
}

// tokenize
module.exports = function(c) {
  
  // some starting variables
  var tks = [], b = {word:"",num:""}, firstLine = c.split("\n")[0],start=0;

  // get first line
  if(firstLine.startsWith("[")&&firstLine.endsWith("]")) {
    tks.push({ type: "first_line", firstLine }); 
    start=firstLine.length-1;
  }

  // loop through each character
  for(let i = start; i < c.length; i++) {
    var char = c[i];
    
    // disable comment when new line
    if(char === "\n") b.comment = false;
    if(b.comment&&char!=="\n")continue;

    // run wordandnum to check for words and nums
    var wan = wordandnum(char,b,tks)
    b = wan.b;
    tks = wan.tks;

    // check if token exists
    if(tokens[char]) {
      if(tokens[char] !== "comment") {
        // if it's not a comment, push token to list
        if(!b.comment) tks.push({type:tokens[char]})
      } else {
        // if it's a comment, enable comment
        b.comment = true;
      }
    } 
      
  } // loop
  
  return tks;
}