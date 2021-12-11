const { performance } = require('perf_hooks');

let flashCount = 0;

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const dOctsParse = (lines) => {
  let dOcts = [];
  for(let y = 0; y < lines.length; y++) {
    let line = [];
    for (let x = 0; x < lines[y].length; x++)
      line.push(Number(lines[y][x]));
    dOcts.push(line);
  }
  return dOcts;
}

const dOctsIncrease = (dOcts) => {
  for(let y = 0; y < dOcts.length; y++)
    for (let x = 0; x < dOcts[y].length; x++) 
      dOcts[y][x] += 1;
  return dOcts;
}

const dOctsMax = (dOcts) => {
  return dOcts.flat().reduce((prev, curr) => Math.max(prev, curr), -Infinity);
}

const incrementNotZero = (num) => {
  if (num != 0) return ++num;
  return num;
}

const dOctsFlash = (dOcts, x, y) => {
  flashCount++;
  dOcts[y][x] = 0;
  if (x > 0 && y > 0) 
    dOcts[y-1][x-1] = incrementNotZero(dOcts[y-1][x-1]);
  if (y > 0) 
    dOcts[y-1][x] = incrementNotZero(dOcts[y-1][x]);
  if (x < dOcts[0].length -1 && y > 0) 
    dOcts[y-1][x+1] = incrementNotZero(dOcts[y-1][x+1]);
  if (x > 0) 
    dOcts[y][x-1] = incrementNotZero(dOcts[y][x-1]);
  if (x < dOcts[y].length -1) 
    dOcts[y][x+1] = incrementNotZero(dOcts[y][x+1]);
  if (x > 0 && y < dOcts.length -1) 
    dOcts[y+1][x-1] = incrementNotZero(dOcts[y+1][x-1]);
  if (y < dOcts.length -1) 
    dOcts[y+1][x] = incrementNotZero(dOcts[y+1][x]);
  if (x < dOcts[y].length -1 && y < dOcts.length -1) 
    dOcts[y+1][x+1] = incrementNotZero(dOcts[y+1][x+1]);
  return dOcts;
}

const dOctsResolve = (dOcts) => {
  while (dOctsMax(dOcts) > 9) {
    for (let y = 0; y < dOcts.length; y++)
      for (let x = 0; x < dOcts[0].length; x++) {
        if (dOcts[y][x] > 9) dOcts = dOctsFlash(dOcts, x, y);
      }
  }
  return dOcts;
}

const ex1 = (file) => {
  const lines = readFile(file);
  let dOcts = dOctsParse(lines);

  for (let i = 0; i < 100; i++) {
    dOcts = dOctsIncrease(dOcts);
    dOcts = dOctsResolve(dOcts);
  }

  console.log(`EX 11-1: After 100 rounds there have been ${flashCount} flashes.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  let dOcts = dOctsParse(lines);
  let count = 0;
  
  while (dOctsMax(dOcts) > 0) {
    dOcts = dOctsIncrease(dOcts);
    dOcts = dOctsResolve(dOcts);
    count++;
  }

  console.log(`EX 11-2: The flashes syncronize at round ${count}.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 11-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 11-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);