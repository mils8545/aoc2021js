let mapWidth;
let mapHeight;
let lowPointIDList = [];

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  mapWidth = lines[0].length;
  mapHeight = lines.length;
  return lines;
}

const findLowSpots = (map) => {
  let lowSpots = [];
  for (let i = 0; i < mapHeight; i++) 
    for (let j = 0; j < mapWidth; j++) {
      let low = true;
      if (i > 0) 
        if (map[i][j] >= map[i-1][j]) low = false;
      if (i < mapHeight -1) 
        if (map[i][j] >= map[i+1][j]) low = false;
      if (j > 0) 
        if (map[i][j] >= map[i][j-1]) low = false;
      if (j < mapWidth -1) 
        if (map[i][j] >= map[i][j+1]) low = false;
      if (low) lowSpots.push({x: j, y: i});
    }
    return lowSpots;
}

const countBasin = (map, start) => {
  let basinPoints = [];
  basinPoints = checkPoint(map, start, basinPoints);  
  return basinPoints;
}

const checkPoint = (map, point, pointList) => {
  const {x, y} = point;
  if (lowPointIDList.includes(pointID(point))) {
    lowPointIDList.splice(lowPointIDList.indexOf(pointID(point)), 1);
  }
  if (pointList.includes(pointID(point))) {
    return pointList;
  } else {
    pointList.push(pointID(point));
  }
  if (y > 0) 
    if (map[y-1][x] != 9) pointList = checkPoint(map, {x: x, y: y-1}, pointList);
  if (y < mapHeight -1) 
    if (map[y+1][x] != 9) pointList = checkPoint(map, {x: x, y: y+1}, pointList);
  if (x > 0) 
    if (map[y][x-1] != 9) pointList = checkPoint(map, {x: x-1, y: y}, pointList);
  if (x < mapWidth -1) 
    if (map[y][x+1] != 9) pointList = checkPoint(map, {x: x+1, y: y}, pointList);
  return pointList;
}

const pointID = (point) => {
  return (point.y * mapWidth) + point.x;
}

const pointIDtoObject = (pointID) => {
  return {x: pointID % mapWidth, y: Math.floor(pointID / mapWidth) }
}

const ex1 = (file) => {
  const map = readFile(file).map(line => line.split(""));
  console.log(`EX1: There are ${findLowSpots(map).reduce((prev, curr) => prev + Number(map[curr.y][curr.x]) + 1, 0)} low spots.`);
}

const ex2 = (file) => {
  const map = readFile(file).map(line => line.split(""));
  lowPointIDList = findLowSpots(map).map(point => pointID(point));
  let basins = [];
  while (lowPointIDList.length > 0) {
    basins.push(countBasin(map, pointIDtoObject(lowPointIDList.shift())));
  }
  bc = basins.map(basin => basin.length).sort((a,b) => b - a);
  console.log(`EX2: There are ${basins.length} basins. The three largest basins are ${bc[0]}, ${bc[1]}, and ${bc[2]} in size. The product is ${bc[0] * bc[1] * bc[2]}.`);
}

ex1(process.argv[2]);
ex2(process.argv[2]);