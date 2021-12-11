const closerValues = {')': 3, ']': 57, '}': 1197, '>': 25137};
const openers = {')' : '(', ']': '[', '}': '{', '>': '<'};

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const checkLine = (line) => {
  let openStack = [];
  for (let i = 0; i < line.length; i++) {
    if (closerValues[line[i]]) {
      if (!(openStack.pop() == openers[line[i]])) {
        return line[i];
      }
    } else {
      openStack.push(line[i]);
    }
  }
  return openStack;
}

const scoreCompletion = (openerStack) => {
  const openerValues = {'(': 1, '[': 2, '{': 3, '<': 4};
  let total = 0;
  while(openerStack.length > 0) {
    total = (total * 5) + openerValues[openerStack.pop()];
  }
  return total;
}

const ex1 = (file) => {
  const lines = readFile(file);
  const errors = lines.map(line => checkLine(line));
  const score = errors.filter(error => typeof error == 'string').reduce((prev, curr) => prev += closerValues[curr],0);

  console.log(`EX 10-1: The score of the errors is ${score}.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  const errors = lines.map(line => checkLine(line));

  let scores = errors.filter(error => !(typeof error == 'string')).map(com => scoreCompletion(com)).sort((a,b) => Number(a) - Number(b));

  let midScore = scores[Math.floor(scores.length/2)];

  console.log(`EX 10-2: The score of the completions is ${midScore}.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 10-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 10-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);