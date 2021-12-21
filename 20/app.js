const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const expandImageMap = (imageMap, fill) => {
  let retMap = [];
  let blankLine = [];
  for (let i = 0; i < imageMap[0].length + 2; i++) {
    blankLine.push(fill);
  }
  retMap.push(blankLine);
  for (let i = 0; i < imageMap.length; i++) {
    let line = imageMap[i];
    line.unshift(fill);
    line.push(fill);
    retMap.push(line);
  }
  retMap.push([...blankLine]);
  return retMap;
}

const reduceImageMap = (imageMap) => {
  let retMap = [];
  let blankLine = [];
  for (let i = 1; i < imageMap.length-1; i++) {
    let line = imageMap[i];
    line.shift();
    line.pop();
    retMap.push(line);
  }
  return retMap;
}

const printMap = (imageMap) => {
  for (let i = 0; i < imageMap.length; i++) {
    console.log(imageMap[i].map(char => (char) ? '#' : ".").join(" "));
  }
}

const processMap = (imageMap, key) => {
  let retMap = [];
  for (let i = 0; i < imageMap.length; i++) {
    retMap.push([...imageMap[i]]);
  }
  for (let i = 1; i < imageMap.length-1; i++) {
    for (let j = 1; j < imageMap[0].length-1; j++) {
      const area = [imageMap[i+1][j+1],imageMap[i+1][j],imageMap[i+1][j-1],
        imageMap[i][j+1],imageMap[i][j],imageMap[i][j-1],
        imageMap[i-1][j+1],imageMap[i-1][j],imageMap[i-1][j-1]];
        lookup = area.reduce((prev, curr, i) => prev + ((curr) ? 1 : 0) * Math.pow(2, i),0);
        retMap[i][j] = key[lookup];
    }
  }
  return retMap;
}

const ex1 = (file) => {
  const lines = readFile(file);

  const key = lines[0].split("").map(char => (char == '#') ? true : false);

  const startingImage = [];
  lines.slice(2).forEach(line => {
    startingImage.push(line.split("").map(char => (char == '#') ? true : false))
  });

  const fill = false;

  let map = (expandImageMap(startingImage, fill));
  for (let i = 0; i < 10; i++) {
    map = (expandImageMap(map, fill));
  }
  for (let i = 0; i < 2; i++) {
    map = processMap(map, key);
  }
  for (let i = 0; i < 5; i++) {
    map = (reduceImageMap(map, fill));
  }

  const litChars = map.flat().filter(char => (char)).length;

  console.log(`EX 20-1: The total number of lit pixels is ${litChars}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  const key = lines[0].split("").map(char => (char == '#') ? true : false);

  const startingImage = [];
  lines.slice(2).forEach(line => {
    startingImage.push(line.split("").map(char => (char == '#') ? true : false))
  });

  const fill = false;

  let map = (expandImageMap(startingImage, fill));
  for (let i = 0; i < 110; i++) {
    map = (expandImageMap(map, fill));
  }
  for (let i = 0; i < 50; i++) {
    map = processMap(map, key);
  }
  for (let i = 0; i < 55; i++) {
    map = (reduceImageMap(map, fill));
  }

  const litChars = map.flat().filter(char => (char)).length;

  console.log(`EX 20-2: The total number of lit pixels is ${litChars}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 20-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 20-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);