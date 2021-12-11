const fs = require('fs');
let lines;

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const bitArrayToNumber = (bitArray) => {
  return bitArray.reverse().reduce((previousValue, currentValue, index) => {
    return previousValue + (currentValue * Math.pow(2,index));
  }, 0);
}

const generateCommonBitMap = (lines) => {
  let bitCount = [];
  for(let i = 0; i < lines[0].length; i++) {
    bitCount.push(0);
  }
  for(let i = 0; i < lines.length; i++) {
    for(let j = 0; j < bitCount.length; j++) {
      bitCount[j] += (lines[i][j] == 1)? 1 : 0;
    }
  }
  let entryCount = lines.length;
  let bitMap = bitCount.map((count) => (count < entryCount/2) ? 0 : 1);
  return bitMap;
}

const ex1 = (file) => {
  lines = readFile(file);
  let gammaBits = generateCommonBitMap(lines);
  let epsilonBits = gammaBits.map((bit) => (bit) ? 0 : 1);

  let gamma = bitArrayToNumber(gammaBits);
  let epsilon = bitArrayToNumber(epsilonBits);

  console.log(`EX 03-1: Gamma: ${gamma} Epsilon: ${epsilon} Product: ${gamma * epsilon}`);
}

const ex2 = (file) => {
  lines = readFile(file);
  let filteredLines = lines;
  let currentBit = 0;
  while (filteredLines.length > 1) {
    let bitMap = generateCommonBitMap(filteredLines);
    filteredLines = filteredLines.filter( (line) => {
      return (Number(line[currentBit]) == bitMap[currentBit]);
    });
    currentBit += 1;
  }
  let oxygenBits = generateCommonBitMap(filteredLines);

  filteredLines = lines;
  currentBit = 0;
  while (filteredLines.length > 1) {
    let bitMap = generateCommonBitMap(filteredLines);
    bitMap = bitMap.map((bit) => (bit) ? 0 : 1);
    filteredLines = filteredLines.filter( (line) => {
      return (Number(line[currentBit]) == bitMap[currentBit]);
    });
    currentBit += 1;
  }
  let co2Bits = generateCommonBitMap(filteredLines);

  let oxygen = bitArrayToNumber(oxygenBits);
  let co2 = bitArrayToNumber(co2Bits);

  console.log(`EX 03-2: Oxygen: ${oxygen} CO2: ${co2} Product: ${oxygen * co2}`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 03-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 03-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);