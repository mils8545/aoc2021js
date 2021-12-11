const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

// takes a line in the form of "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"
// and returns an object in the form of {pattern: array sorted by length of array of charachters sorted alpbetically, signal: array of strings }
const parseLine = (line) => {
  const pattern = line
    .split(' ')
    .slice(0,10)
    .sort((a,b) => a.length - b.length)
    .map(list => list.split("").sort());
  const signal = line
    .split(' ')
    .slice(11);

  return {pattern: pattern, signal: signal};
}

// returns true if the encoded signal is identifiable as a 1, 7, 4 or 8
const isIdentifiableSignal = (signal) => {
  const identifiable = [2, 3, 4, 7];
  return identifiable.includes(signal.length);
}

// takes an array or arrays and returns an object that is a map of the encoded segment name to the decoded segment name fg. {a: 'b', b:'d'......}
const segmentMap = (pattern) => {
  let map = {a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'};
  const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  const bd = segments.filter(seg => (!pattern[0].includes(seg) && pattern[2].includes(seg)));
  const cde = segments.filter(seg => (!pattern[6].includes(seg) || !pattern[7].includes(seg) || !pattern[8].includes(seg)));

  map.a = segments.filter(seg => (!pattern[0].includes(seg) && pattern[1].includes(seg)))[0];
  map.d = segments.filter(seg => (bd.includes(seg) && cde.includes(seg)))[0];
  map.b = segments.filter(seg => (bd.includes(seg) && (seg != map.d)))[0];
  map.c = segments.filter(seg => (pattern[0].includes(seg) && cde.includes(seg)))[0];
  map.f = segments.filter(seg => (pattern[1].includes(seg) && (seg != map.a) && (seg != map.c)))[0];

  const count235 = segments.map(seg => (pattern[3].includes(seg) ? 1 : 0) + (pattern[4].includes(seg) ? 1 : 0) + (pattern[5].includes(seg) ? 1 : 0));
  const single235 = segments.filter(seg => count235[segments.indexOf(seg)] == 1);

  map.e = segments.filter(seg => (single235.includes(seg) && (seg != map.b)))[0];
  map.g = segments.filter(seg => (!pattern[2].includes(seg) && (seg != map.a) && (seg != map.e)))[0];

  let ret = {};
    for(var key in map){
      ret[map[key]] = key;
    }

  return ret;
} 

// takes a seg of encoded segment at a string ans returns a decoded segment
const digitTranslate = (sig, map) => {
  let translatedSig = sig.split("");
  for (let i = 0; i < sig.length; i++) {
    translatedSig[i] = map[translatedSig[i]];
  }
  return translatedSig.sort().join("");
}

// returns the digit value of a decoded segment
const digitVal = (dig) => {
  const digitMap = ["abcefg", "cf", "acdeg", "acdfg", "bcdf", "abdfg", "abdefg", "acf", "abcdefg", "abcdfg"];
  return (digitMap.indexOf(dig));
}

// takes a file line and returns the corresponding decoded 4 digit number 
const decodeLine = (line) => {
  const signal = parseLine(line).signal;
  const pattern = parseLine(line).pattern;

  const map = segmentMap(pattern);
  return signal.reduce((prev, curr) => prev + digitVal(digitTranslate(curr, map)), "");
}

const ex1 = (file) => {
  const fileLines = readFile(file);

  let signals = fileLines.map(line => parseLine(line).signal);

  let identifiableCount = signals.flat().reduce((prev, curr) => prev + ((isIdentifiableSignal(curr) ? 1 : 0)) ,0 );

  console.log (`EX 08-1: There are ${identifiableCount} easily identifiable digits in the signals.`);
}

const ex2 = (file) => {
  const fileLines = readFile(file);

  const signals = fileLines.map(line => parseLine(line).signal);
  const patterns = fileLines.map(line => parseLine(line).pattern);

  const total = fileLines.reduce((prev, curr) => prev + Number(decodeLine(curr)), 0)

  console.log(`EX 08-2: The total of the signals is ${total}.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 08-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 08-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);