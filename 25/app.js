const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

let moved = true;

const move = (map) => {
  moved = false;
  let res1 = map.map(line => line.map(cell => '.'));
  for (let j = 0; j < map.length; j++) {
    for (let i = 0; i < map[0].length; i++) {
      if (map[j][i] == '>') {
        if (map[j][(i+1)%map[0].length] == '.') {
          res1[j][(i+1)%map[0].length] = '>';
          moved = true;
        } else {
          res1[j][i] = '>';
        }
      } else if (map[j][i] == 'v') {
        res1[j][i] = 'v';
      }
    }
  }

  let res2 = map.map(line => line.map(cell => '.'));

  for (let j = 0; j < res1.length; j++) {
    for (let i = 0; i < res1[0].length; i++) {
      if (res1[j][i] == 'v') {
        if (res1[(j+1)%map.length][i] == '.') {
          res2[(j+1)%map.length][i] = 'v';
          moved = true;
        } else {
          res2[j][i] = 'v';
        }
      } else if (res1[j][i] == '>') {
        res2[j][i] = '>';
      }
    }
  }
  return res2;
}

const ex1 = (file) => {
  const lines = readFile(file);

  let map = lines.map(line => line.split(""));
  let count = 0;

  while (moved) {
    map = move(map);
    count++;
  }

  console.log(`EX 25-1: The sea cucumbers will stop moving after ${count} turns.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 25-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);