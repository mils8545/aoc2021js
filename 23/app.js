const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);



//  console.log(`EX 23-1: The losers score times the number of rolls is ${loserRolls}.`);
};

const ex2 = (file) => {
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 23-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 23-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);