const { performance } = require('perf_hooks');

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const xyToStraight = (x, y, width) => (y * width) + x;

const straightToXY = (point, width) => ({x: point % width, y: Math.floor(point/width)});

const findNeighbours = (point, width, height) => {
  let neighbours = [];
  const coords = straightToXY(point, width);
  if (coords.x > 0) neighbours.push(xyToStraight(coords.x-1, coords.y, width));
  if (coords.x < width-1) neighbours.push(xyToStraight(coords.x+1, coords.y, width));
  if (coords.y > 0) neighbours.push(xyToStraight(coords.x, coords.y-1, width));
  if (coords.y < height-1) neighbours.push(xyToStraight(coords.x, coords.y+1, width));
  return neighbours;
}

// used for debugging only
const printMap = (map, width) => {
  for (let i = 0; i < map.length/width; i++) {
    console.log(map.slice(i*width,(1+i)*width).join(""));
  }
}

const ex1 = (file) => {
  const lines = readFile(file);
  let map = lines.join("").split("");

  const mapWidth = lines[0].length;
  const mapHeight = lines.length;

  //flat array to hold map
  map = map.map(cell => ({cost: Number(cell), totalCost: Infinity, via: -1, goal: false }));

  // set first node to start and add to queue, set last node to goal
  map[0].totalCost = 0;
  map[map.length-1].goal = true;

  let queue = [0];
  let done = false;

  while (!done) {
    current = queue.shift();
    findNeighbours( current, mapWidth, mapHeight).forEach(neighbour => {
      if (map[neighbour].cost + map[current].totalCost < map[neighbour].totalCost) {
        map[neighbour].totalCost = map[neighbour].cost + map[current].totalCost;
        map[neighbour].via = current;
        queue.push(neighbour);
        if (neighbour == map.length-1) {
          done = true;
        }
      }
    });
    queue.sort((a,b) => map[a].totalCost - map[b].totalCost);
  }

  console.log(`EX 15-1: The cost to get to the last point is ${map[map.length-1].totalCost}.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  let mapProto = lines.join("").split("").map(node => Number(node));

  const mapWidth = lines[0].length * 5;
  const mapHeight = lines.length * 5;

  let map = [];

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapHeight; x++) {
      const protoCord = (x%(mapWidth/5)+(y%(mapHeight/5)*mapWidth/5));
      const val = mapProto[protoCord]+Math.floor(x/(mapWidth/5))+Math.floor(y/(mapHeight/5)); 
      map.push((val-1)%9+1);
    }
  };

  //flat array to hold map
  map = map.map(cell => ({cost: cell, totalCost: Infinity, via: -1, goal: false }));

  // set first node to start and add to queue, set last node to goal
  map[0].totalCost = 0;
  map[map.length-1].goal = true;

  let queue = [0];
  let done = false;

  while (!done) {
    current = queue.shift();
    findNeighbours( current, mapWidth, mapHeight).forEach(neighbour => {
      if (map[neighbour].cost + map[current].totalCost < map[neighbour].totalCost) {
        map[neighbour].totalCost = map[neighbour].cost + map[current].totalCost;
        map[neighbour].via = current;
        queue.push(neighbour);
        if (neighbour == map.length-1) {
          done = true;
        }
      }
    });
    queue.sort((a,b) => map[a].totalCost - map[b].totalCost);
  }

  console.log(`EX 15-2: The cost to get to the last point is ${map[map.length-1].totalCost}.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 15-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 15-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);