const fs = require('fs');

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

var f = [];
function summation (n) {
  if (n == 0 ) 
    return 0;
  if (n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = summation(n-1) + n;
}

const fuelUsedEx1PerCrab = (crab, target) => Math.abs(target - crab);

const fuelUsedEx1 = (crabs, target) => crabs.reduce((prev, curr) => prev + fuelUsedEx1PerCrab(curr, target), 0);

const fuelUsedEx2PerCrab = (crab, target) => summation(Math.abs(target - crab));

const fuelUsedEx2 = (crabs, target) => crabs.reduce((prev, curr) => prev + fuelUsedEx2PerCrab(curr, target), 0);

const ex1 = (file) => {
  const fileLines = readFile(file);
  const crabsInitial = fileLines[0].split(',').map(num => Number(num));
  const minCrab = crabsInitial.reduce((prev, curr) => curr < prev ? curr : prev, Infinity);
  const maxCrab = crabsInitial.reduce((prev, curr) => curr > prev ? curr : prev, -Infinity);

  let minFuel = Infinity;
  let efficientDepth = Infinity;

  for (let i = minCrab; i <= maxCrab; i++) {
    let calcFuel = fuelUsedEx1(crabsInitial, i);
    if (calcFuel < minFuel) {
      minFuel = calcFuel;
      efficientDepth = i;
    }
  };

  console.log (`EX 07-1: Minimum Fuel: ${minFuel} Most Efficient Target Level: ${efficientDepth}`);
}

const ex2 = (file) => {
  const fileLines = readFile(file);
  const crabsInitial = fileLines[0].split(',').map(num => Number(num));
  const minCrab = crabsInitial.reduce((prev, curr) => curr < prev ? curr : prev, Infinity);
  const maxCrab = crabsInitial.reduce((prev, curr) => curr > prev ? curr : prev, -Infinity);

  let minFuel = Infinity;
  let efficientDepth = Infinity;

  for (let i = minCrab; i <= maxCrab; i++) {
    let calcFuel = fuelUsedEx2(crabsInitial, i);
    if (calcFuel < minFuel) {
      minFuel = calcFuel;
      efficientDepth = i;
    }
  };

  console.log (`EX 07-2: Minimum Fuel: ${minFuel} Most Efficient Target Level: ${efficientDepth}`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 07-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 07-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);