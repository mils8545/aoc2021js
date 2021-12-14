const { performance } = require('perf_hooks');

let paths = [];

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const parseLines = (lines) => {
  let template = lines[0].split("");
  const charList = lines.slice(2).map(str => str.replace(/[ ->]/g,'')).join("").split("").sort().filter((char, i, chars) => char != chars[i-1]);
  let rules = {};
  charList.forEach(char => rules[char] = {});
  lines.slice(2).forEach(line => rules[line[1]][line[0]] = line[6]);

  return {template: template, rules: rules};
}

const polymerize = (chain, rules) => {
  let newChain = [chain[0]]; 
  chain.slice(1).forEach((l, i) => {
    newChain.push(rules[l][chain[i]]);
    newChain.push(l);
  });
  return newChain;
}

const ex1 = (file) => {
  const lines = readFile(file);
  const {template, rules} = parseLines(lines);
  let chain = template;
  for(let i = 0; i < 9; i++) chain = polymerize(chain, rules)

  console.log(`EX 14-1: There are ${chain.length} points after 10 steps.`);
}

const ex2 = (file) => {

}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 13-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 13-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);