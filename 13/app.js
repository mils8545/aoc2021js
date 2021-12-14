const { performance } = require('perf_hooks');

let paths = [];

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const parseLines = (lines) => {
  let points = [];
  let folds = [];
  let i = 0;
  
  points = lines.slice(0, lines.indexOf("")).map(line => ({x: Number(line.split(",")[0]), y: Number(line.split(",")[1])}));
  folds = lines.slice(lines.indexOf("")+1).map(line => ({axis: line.split('=')[0].slice(-1), at: Number(line.split("=")[1])}));
  return {points: points, folds: folds};
}

const mapPrint = (pointMap) => {
  for (let y = 0; y < pointMap.length; y++) {
    console.log(pointMap[y].map((point) => (point) ? '#' : ' ').join(" "));
  }
}

const mapPoints = (points) => {
  let xMax = points.reduce((prev, curr) => Math.max(prev, curr.x),-Infinity);
  let yMax = points.reduce((prev, curr) => Math.max(prev, curr.y),-Infinity);
  let pointMap = [];
  for (let y = 0; y <= yMax; y++ ) {
    let line = [];
    for (let x = 0; x <= xMax; x++) {
      line.push(false);
    }
    pointMap.push(line);
  }
  points.forEach(point => pointMap[point.y][point.x] = true);
  return pointMap;
}

const transpose2DArray = (array) => {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

const foldMap = (pointMap, axis, at) => {
  let retMap = [];
  if (axis == 'x') pointMap = transpose2DArray(pointMap);
  for (let y = 0; y < at; y++) {
    retMap.push(pointMap[y]);
  }
  const afterFold = pointMap.slice(at+1);
  for (let y = 0; y < afterFold.length; y++) {
    afterFold[y].forEach((p,x) => retMap[at-y-1][x] = p || retMap[at-y-1][x] );
  }
  if (axis == 'x') retMap = transpose2DArray(retMap);
  return retMap;
}

let pointCount = (pointMap) => {
  return pointMap.flat().filter(point => (point)).length;
}

const ex1 = (file) => {
  const lines = readFile(file);
  const {points, folds} = parseLines(lines);
  let pointMap = mapPoints(points);

  pointMap = foldMap(pointMap, folds[0].axis, folds[0].at);

  console.log(`EX 13-1: There are ${pointCount(pointMap)} points after the first fold.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  const {points, folds} = parseLines(lines);
  let pointMap = mapPoints(points);

  folds.forEach(fold => pointMap = foldMap(pointMap, fold.axis, fold.at));

  mapPrint(pointMap);
  console.log(`EX 13-2: The code for the machine is above.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 13-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 13-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);