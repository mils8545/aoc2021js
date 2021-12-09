const fs = require('fs');
let lines;

const readFile = (readFile) => {
  fs.readFile(readFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let lines = data.split(/\r?\n/);
    ex2(lines);
  });
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

const ex1 = (lines) => {
  let gammaBits = generateCommonBitMap(lines);
  let epsilonBits = gammaBits.map((bit) => (bit) ? 0 : 1);

  let gamma = bitArrayToNumber(gammaBits);
  let epsilon = bitArrayToNumber(epsilonBits);

  console.log(`Gamma: ${gamma} Epsilon: ${epsilon} Product: ${gamma * epsilon}`);
}



const ex2 = (lines) => {
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
  console.log(oxygenBits);

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
  console.log(co2Bits);

  let oxygen = bitArrayToNumber(oxygenBits);
  let co2 = bitArrayToNumber(co2Bits);

  console.log(`Oxygen: ${oxygen} CO2: ${co2} Product: ${oxygen * co2}`);

}


readFile(process.argv[2]);