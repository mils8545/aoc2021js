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

const ex1 = (file) => {
  const lines = readFile(file);
  let map = lines.join("").split("");

  const mapWidth = lines[0].length;
  const mapHeight = lines.length;
  // map = [0, 2, 3, 5, 5, 1, 8, 3, 8];
  // const mapWidth = 3;
  // const mapHeight = 3;

  map = map.map(cell => ({cost: Number(cell), totalCost: Infinity, via: -1, goal: false }));

  map[0].totalCost = 0;
  map[map.length-1].goal = true;


  let queue = [0];
  let done = false;

  while (!done) {
    current = queue.pop();
    findNeighbours( current, mapWidth, mapHeight).forEach(neighbour => {
      if (map[neighbour].cost + map[current].totalCost < map[neighbour].totalCost) {
        map[neighbour].totalCost = map[neighbour].cost + map[current].totalCost;
        map[neighbour].via = current;
        queue.push(neighbour);
        if (neighbour == map.length-1) {
          done = true;
          console.log(map[neighbour]);
        }
      }
    });
    queue.sort((a,b) => map[a].totalCost - map[b].totalCost);
  }

  // map.forEach((coord, i) => {
  //   console.log(coord);
  //   console.log(i);
  // })

  //map.forEach((coord,i) => console.log(`${i}: ${coord.totalCost} ${coord.via}`));

  //console.log(`EX 14-2: The difference between the most common and least common elements is ${charCount2[0].count - charCount2[charCount2.length-1].count} after ${runLength} steps.`);
}

const ex2 = (file) => {
  const lines = readFile(file);


  //console.log(`EX 14-2: The difference between the most common and least common elements is ${charCount2[0].count - charCount2[charCount2.length-1].count} after ${runLength} steps.`);
}


let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

// map = [0, 2, 3, 5, 5, 1, 8, 3, 8];

// 0  2  3
// 5  5  1
// 8  3  8


