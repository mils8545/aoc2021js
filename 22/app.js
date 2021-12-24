const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const checkOverlap = (box1, box2) => {
  let overlap = false;
  if ((((box1.x1 >= box2.x1) && (box1.x1 <= box2.x2)) || ((box2.x1 >= box1.x1) && (box2.x1 <= box1.x2))) 
    && (((box1.y1 >= box2.y1) && (box1.y1 <= box2.y2)) || ((box2.y1 >= box1.y1) && (box2.y1 <= box1.y2))) 
    && (((box1.z1 >= box2.z1) && (box1.z1 <= box2.z2)) || ((box2.z1 >= box1.z1) && (box2.z1 <= box1.z2)))) overlap = true;
  return overlap;
};

const ex1 = (file) => {
  const lines = readFile(file);

  let boxes = lines.map(line => {
    const xyz = line.replaceAll("=", ',').replaceAll("..", ",").split(",");
    const on = (line[1] == 'f') ? false : true;
    return {x1: Number(xyz[1]), x2: Number(xyz[2]), y1: Number(xyz[4]), y2: Number(xyz[5]), z1: Number(xyz[7]), z2: Number(xyz[8]), on: on };
  });

  console.log(checkOverlap(boxes[18], boxes[15]));


  console.log(boxes[4]);

//  console.log(`EX 22-1: The losers score times the number of rolls is ${loserRolls}.`);
};

const ex2 = (file) => {
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 22-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 22-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);