
// split array by type of token
function splitArrByType(arr, type) {
  let res = arr.reduce((acc, obj) => {
    if (obj.type === type) {
      acc.push([]);
    } else {
      acc[acc.length - 1].push(obj);
    }
    return acc;
  }, [[]]);

  return res;
}

// optimize operation array
function optimize(oparray) {
  if(oparray.length>0) {
    let optimized = [];
    for(let i = 0; i < oparray.length; i++) {
      let obj = {steps:[]}, array = oparray[i], types = array.map(o => {
        if(o.type !== "word"&&o.type!=="num"&&o.type!=="first_line") return o.type;
        else return (o.word||o.num||o.firstLine||"");
      });
      obj.steps=types;
      optimized.push(obj);
    }
    return optimized;
  } else return [];
}

module.exports = function(tokens) {
  return optimize(splitArrByType(tokens, "end")); // returns operations
}