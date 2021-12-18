const { performance } = require('perf_hooks');

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

// calculates the summation of n using recursion with memoization. eg summation(5) = 5 + 4 + 3 + 2 + 1 = 15
let summationM = [];
const summation = (n) => {
  if (n == 0 ) 
    return 0;
  if (n == 1)
    return 1;
  if (summationM[n] > 0)
    return summationM[n];
  return summationM[n] = summation(n-1) + n;
}

// Parses line to get a target aind calculates the size of the y target window for use in checking possible ys
// Does not account for reversed xs and ys
const parseLine = (line) => {
  const y = line.slice(line.indexOf("y=")+2);
  const y2 = Number(y.slice(0, y.indexOf("..")));
  const y1 = Number(y.slice(y.indexOf("..")+2));
  const x = line.slice(line.indexOf("x=")+2);
  const x1 = Number(x.slice(0, x.indexOf("..")));
  const x2 = Number(x.slice(x.indexOf("..")+2,x.indexOf(",") ));
  const yWindow = Math.abs(y2 - y1) + 1;
  return {x1: x1, x2: x2, y1: y1, y2: y2, yWindow: yWindow};
}

// returns true if an initial y velocity will be able to hit the targets y component
const checkHitY = (yInitialVel, target) => {
  let hit = false;
  let yPos = 0;
  let yVel = yInitialVel;
  while (!hit && yPos >= target.y2) {
    yPos = yPos + yVel;
    yVel--;
    if ((yPos <= target.y1)&&(yPos >= target.y2)) hit=true;
  }
  return hit;
}

// returns true if the initial velocity will hit the target
const checkHitXY = (xInitialVel, yInitialVel, target) => {
  let hit = false;
  let xPos = 0;
  let yPos = 0;
  let xVel = xInitialVel;
  let yVel = yInitialVel;
  while (!hit && yPos >= target.y2) {
    xPos = xPos + xVel;
    yPos = yPos + yVel;
    yVel--;
    if (xVel > 0) xVel--;
    if (xVel < 0) xVel++;
    if ((xPos <= target.x2)&&(xPos >= target.x1)&&(yPos <= target.y1)&&(yPos >= target.y2)) hit=true;
  }
  return hit;
}

// returns an array ot the exhaustive list of possible initial y velocities that will hit the targets y component
const findValidYs = (target) => {
  let yGuess = target.y2;
  let missCount = 0;
  let yVelHits = []; 
  while (missCount < target.yWindow) {
    const hit = checkHitY (yGuess, target);
    if (!hit) {
      missCount++;
    } else {
      yVelHits.push(yGuess);
      missCount = 0;      
    }
    yGuess++;
  }
  return yVelHits;
}

// returns an array ot the exhaustive list of possible initial velocities that will hit the target
const findValidXYs = (target, validYs) => {
  let xyHits = [];
  validYs.forEach(validY => {
    let xGuess = 0;
    while (xGuess < target.x2+1) {
      const hit = checkHitXY(xGuess, validY, target);
      if (hit) xyHits.push({x: xGuess, y: validY});
      xGuess++;
    }
  });
  return xyHits;
}

const ex1 = (file) => {
  const lines = readFile(file);
  const target = parseLine(lines[0]);

  yVelHits = findValidYs(target);
  highestY = yVelHits.pop();
  console.log(`EX 17-1: The highest a probe can go and still hit the target is ${summation(highestY)}`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  const target = parseLine(lines[0]);

  validYs = findValidYs(target);
  hitVels = findValidXYs(target, validYs);
  console.log(`EX 17-2: There are ${hitVels.length} valid xy firing velocities that hit the target.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);