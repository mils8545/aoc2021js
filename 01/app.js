const fs = require('fs')

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const ex1 = (file) => {
  let arrayData = readFile(file);
  let firstCount = 0;

  for (let i = 1; i < arrayData.length; i++) {
    if ((Number(arrayData[i]) > Number(arrayData[i - 1]))) {
      firstCount++;
    };
  };

  console.log(`EX 01-1: Data Set Size: ${arrayData.length}   Single Increase Count: ${firstCount}`);
}

const ex2 = (file) => {
  let arrayData = readFile(file);
  let secondCount = 0;

  for (let i = 3; i < arrayData.length; i++) {
    if ((Number(arrayData[i]) > Number(arrayData[i - 3]))) {
      secondCount++;
    };
  };
  console.log(`EX 01-2: Data Set Size: ${arrayData.length}   Rolling Set of 3 Increase Count: ${secondCount}`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 01-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 01-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

