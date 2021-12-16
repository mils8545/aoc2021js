const { performance } = require('perf_hooks');

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const parseLines = (lines) => {
  let rules = {};
  lines.slice(2).forEach(line => rules[line.slice(0,2)] = [line[0]+line[6],line[6]+line[1]]);
  let pairCount = {};
  lines.slice(2).forEach(line => pairCount[line.slice(0,2)] = 0);
  const template = lines[0];
  for (let i = 0; i < template.length -1; i++) {
    pairCount[template.slice(i, i+2)] += 1;
  }
  const pairs = lines.slice(2).map(line => line.slice(0,2));

  return {pairCount: pairCount, rules: rules, pairs: pairs};
}

const polymerize = (pairCount, rules, pairs) => {
  let retCount = {};
  pairs.forEach(pair => retCount[pair] = 0);
  pairs.forEach(pair => {
    retCount[rules[pair][0]] += pairCount[pair];
    retCount[rules[pair][1]] += pairCount[pair];
  });
  return retCount;
} 

const ex1 = (file) => {
  const lines = readFile(file);
  let {pairCount, rules, pairs} = parseLines(lines);
  const runLength = 10;

  const charList = (lines) => lines.slice(2).map(str => str.replace(/[ ->]/g,'')).join("").split("").sort().filter((char, i, chars) => char != chars[i-1]);
  let charCount = {};
  charList(lines).forEach(char => charCount[char] = 0);

  for(let i = 0; i < runLength; i++) pairCount = polymerize(pairCount, rules, pairs);

  pairs.forEach(pair => {
    charCount[pair[0]] += pairCount[pair];
    charCount[pair[1]] += pairCount[pair];
  });

  charCount[lines[0][0]] += 1;
  charCount[lines[0][lines[0].length-1]] += 1;

  let charCount2 = [];
  charList(lines).forEach(char => charCount2.push({char: char, count: charCount[char]/2}));
  charCount2 = charCount2.sort((a, b) => b.count - a.count);

  console.log(`EX 14-1: The difference between the most common and least common elements is ${charCount2[0].count - charCount2[charCount2.length-1].count} after ${runLength} steps.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  let {pairCount, rules, pairs} = parseLines(lines);
  const runLength = 40;

  const charList = (lines) => lines.slice(2).map(str => str.replace(/[ ->]/g,'')).join("").split("").sort().filter((char, i, chars) => char != chars[i-1]);
  let charCount = {};
  charList(lines).forEach(char => charCount[char] = 0);

  for(let i = 0; i < runLength; i++) pairCount = polymerize(pairCount, rules, pairs);

  pairs.forEach(pair => {
    charCount[pair[0]] += pairCount[pair];
    charCount[pair[1]] += pairCount[pair];
  });

  charCount[lines[0][0]] += 1;
  charCount[lines[0][lines[0].length-1]] += 1;

  let charCount2 = [];
  charList(lines).forEach(char => charCount2.push({char: char, count: charCount[char]/2}));
  charCount2 = charCount2.sort((a, b) => b.count - a.count);

  console.log(`EX 14-2: The difference between the most common and least common elements is ${charCount2[0].count - charCount2[charCount2.length-1].count} after ${runLength} steps.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);