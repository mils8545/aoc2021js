const { performance } = require('perf_hooks');

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const parseLine = (line) => {
  return JSON.parse(`{"arr": ${line}}`).arr;
}

const addSnail = (snail1, snail2) => {
  return [snail1, snail2];
}

const canExplode = (snail, indexes) => {
  let scan = [];
  if (typeof snail[0] == 'number') {
    if (indexes.length >= 4) {
      return indexes;
    }
  } else {
    scan = canExplode(snail[0], [...indexes, 0]);
    if (scan.length >= 4) return scan;
  }
  if (typeof snail[1] == 'number') {
    if (indexes.length >= 4) {
      return indexes;
    }
  } else {
    scan = canExplode(snail[1], [...indexes, 1]);
    if (scan.length >= 4) return scan;
  }
  return [];
}

const canSplit = (snail, indexes) => {
  let scan = [];
  if (typeof snail[0] == 'number') {
    if (snail[0] > 9) {
      return [...indexes, 0];
    }
  } else {
    scan = canSplit(snail[0], [...indexes, 0]);
    if (scan.length > 0) return scan;
  }
  if (typeof snail[1] == 'number') {
    if (snail[1] > 9) {
      return [...indexes, 1];
    }
  } else {
    scan = canSplit(snail[1], [...indexes, 1]);
    if (scan.length > 0) return scan;
  }
  return [];
}

const explode = (snail, indexes) => {
  let track = [...indexes];
  let leftTrack = [...indexes];
  let rightTrack = [...indexes];

  let subSnail = snail;
  while (track.length > 1) {
    subSnail = subSnail[track.shift()];
  }
  let leftVal = subSnail[track[0]][0];
  let rightVal = subSnail[track[0]][1];
  subSnail[track[0]] = 0;

  let done = false;
  while (!done) {
    if (leftTrack.length == 0) {
      done = true;
    } else {
      if (leftTrack.pop() == 1) {
        leftTrack.push(0);
        done = true;
      }
    }
  }

  done = false;
  while (!done) {
    if (rightTrack.length == 0) {
      done = true;
    } else {
      if (rightTrack.pop() == 0) {
        rightTrack.push(1);
        done = true;
      }
    }
  }

  if (leftTrack.length != 0) {
    subSnail = snail;
    while (leftTrack.length > 1) {
      subSnail = subSnail[leftTrack.shift()];
    }
    if (typeof subSnail[leftTrack[0]] != 'number') {
      subSnail = subSnail[leftTrack[0]];
      leftTrack[0] = 1;
    }
    while (typeof subSnail[leftTrack[0]] != 'number') {
      subSnail = subSnail[leftTrack[0]];
    }
    subSnail[leftTrack[0]] += leftVal;
  }
  
  if (rightTrack.length != 0) {
    subSnail = snail;
    while (rightTrack.length > 1) {
      subSnail = subSnail[rightTrack.shift()];
    }
    if (typeof subSnail[rightTrack[0]] != 'number') {
      subSnail = subSnail[rightTrack[0]];
      rightTrack[0] = 0;
    }
    while (typeof subSnail[rightTrack[0]] != 'number') {
      subSnail = subSnail[rightTrack[0]];
    }
    subSnail[rightTrack[0]] += rightVal;
  }
  return snail;
}

const split = (snail, indexes) => {
  let track = [...indexes];
  let subSnail = snail;
  while (track.length > 1) {
    subSnail = subSnail[track.shift()];
  }
  subSnail[track[0]] = [Math.floor(subSnail[track[0]]/2),Math.ceil(subSnail[track[0]]/2)];
  return snail;
}

const magnitude = (snail) => {
  let left = 0;
  let right = 0;
  if (typeof snail[0] == 'number') {
    left = 3 * snail[0];
  } else {
    left = 3 * magnitude(snail[0]);
  }
  if (typeof snail[1] == 'number') {
    right = 2 * snail[1];
  } else {
    right = 2 * magnitude(snail[1]);
  }
  return left + right;
}

const reduce = (snail) => {
  let done = false;
  while (!done) {
    done = true;

    if (canExplode(snail, []).length > 0) {
      snail = explode(snail, canExplode(snail, []));
      done = false;
    } else if (canSplit(snail, []).length > 0) {
      snail = split(snail, canSplit(snail, []));
      done = false;
    }

  }
  return snail;
}

const ex1 = (file) => {
  const lines = readFile(file);
  let snail = parseLine(lines.shift());

  while (lines.length > 0) {
   snail = addSnail(snail, parseLine(lines.shift()));
   snail = reduce(snail);
  }

  console.log(`EX 18-1: The answer to the homework problem is ${JSON.stringify(snail)} with a magnitude of ${magnitude(snail)}.`);
}

const ex2 = (file) => {
  const lines = readFile(file);

  let maxI = -1;
  let maxJ = -1;
  let maxMagnitude = -Infinity;

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i != j) {
        let snail = addSnail(parseLine(lines[i]),parseLine(lines[j]));
        snail = reduce(snail);
        if (magnitude(snail) > maxMagnitude) {
          maxI = i;
          maxJ = j;
          maxMagnitude = magnitude(snail);
        }
      }
    }
  }

  console.log(`EX 18-2: The highest magnitude from two lines is ${maxMagnitude}.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);