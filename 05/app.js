const fs = require('fs');
let lines;

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const creatCountMap = (maxX, maxY) => {
  let pointCountMap = [];
  for (let i = 0; i <= maxX; i++) {
    let mapLine = [];
    for (let j = 0; j <= maxY; j++) {
      mapLine.push(0);
    }
    pointCountMap.push(mapLine);
  }
  return pointCountMap;
}

const countLineEx1 = (line, pointCountMap) => {
  // horizontal lines
  if (line.y1 == line.y2) {
    const highX = (line.x1 > line.x2) ? line.x1 : line.x2;
    const lowX = (line.x1 < line.x2) ? line.x1 : line.x2;
    for (let i = lowX; i <= highX; i++) {
       pointCountMap[i][line.y1] += 1;
    }
  // vertical lines
  } else if (line.x1 == line.x2) {
    const highY = (line.y1 > line.y2) ? line.y1 : line.y2;
    const lowY = (line.y1 < line.y2) ? line.y1 : line.y2;
    for (let i = lowY; i <= highY; i++) {
       pointCountMap[line.x1][i] += 1;
    }
  }


  return(pointCountMap);
}

const countLineEx2 = (line, pointCountMap) => {
  // horizontal lines
  if (line.y1 == line.y2) {
    const highX = (line.x1 > line.x2) ? line.x1 : line.x2;
    const lowX = (line.x1 < line.x2) ? line.x1 : line.x2;
    for (let i = lowX; i <= highX; i++) {
       pointCountMap[i][line.y1] += 1;
    }
    return pointCountMap;
  } 

  // vertical lines
  if (line.x1 == line.x2) {
    const highY = (line.y1 > line.y2) ? line.y1 : line.y2;
    const lowY = (line.y1 < line.y2) ? line.y1 : line.y2;
    for (let i = lowY; i <= highY; i++) {
       pointCountMap[line.x1][i] += 1;
    }
    return pointCountMap;
  }

  // diagonal linse
  const xDir = (line.x2 - line.x1) / Math.abs(line.x2 - line.x1);
  const yDir = (line.y2 - line.y1) / Math.abs(line.y2 - line.y1);
  const length = Math.abs(line.x2 - line.x1) + 1;

  for (let i = 0; i < length; i++) {
    pointCountMap[line.x1 + (i * xDir)][line.y1 + (i * yDir)] += 1;
  }

  return(pointCountMap);
}


const ex1 = (file) => {
  const fileLines = readFile(file);
  const lines = fileLines.map((line => {
    const points = line.replace(" -> ", ",").split(',').map(num => Number(num));
    return {x1: points[0], y1: points[1], x2: points[2], y2: points[3]}
  }));

  const maxX = lines.reduce((prev, curr) => Math.max(Math.max(curr.x1, curr.x2), prev), 0);
  const maxY = lines.reduce((prev, curr) => Math.max(Math.max(curr.y1, curr.y2), prev), 0);
  
  pointCountMap = creatCountMap(maxX, maxY);

  lines.forEach(line => pointCountMap = countLineEx1(line, pointCountMap));

  let dangerCount = 0;
  pointCountMap.flat().forEach((num) => {
    if (num > 1) {
      dangerCount++;
    }
  });

  console.log(`EX 05-1: Dangerous Points Method 1: ${dangerCount}`);
}

const ex2 = (file) => {
  const fileLines = readFile(file);
  const lines = fileLines.map((line => {
    const points = line.replace(" -> ", ",").split(',').map(num => Number(num));
    return {x1: points[0], y1: points[1], x2: points[2], y2: points[3]}
  }));

  const maxX = lines.reduce((prev, curr) => Math.max(Math.max(curr.x1, curr.x2), prev), 0);
  const maxY = lines.reduce((prev, curr) => Math.max(Math.max(curr.y1, curr.y2), prev), 0);
  
  pointCountMap = creatCountMap(maxX, maxY);

  lines.forEach(line => pointCountMap = countLineEx2(line, pointCountMap));

  let dangerCount = 0;
  pointCountMap.flat().forEach((num) => {
    if (num > 1) {
      dangerCount++;
    }
  });

  console.log(`EX 05-2: Dangerous Points Method 2: ${dangerCount}`);
}


let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 05-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 05-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);