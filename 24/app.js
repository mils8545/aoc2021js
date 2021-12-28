const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

// Can run the custon assembly but is way to slow to check all options
const run = (instruction, registers, input) => {
  const regNames = ['w', 'x', 'y', 'z'];
  let val;
  switch (instruction[0]) {
    // inp a - Read an input value and write it to variable a.
    case 'inp':
      registers[instruction[1]] = input.shift();
      break;
    // add a b - Add the value of a to the value of b, then store the result in variable a.
    case 'add':
      val = (regNames.includes(instruction[2]) ? registers[instruction[2]] : Number(instruction[2]) ); 
      registers[instruction[1]] += val;
      break;
    // mul a b - Multiply the value of a by the value of b, then store the result in variable a.
    case 'mul':
      val = (regNames.includes(instruction[2]) ? registers[instruction[2]] : Number(instruction[2]) ); 
      registers[instruction[1]] *= val;
      break;
    // div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
    case 'div':
      val = (regNames.includes(instruction[2]) ? registers[instruction[2]] : Number(instruction[2]) ); 
      registers[instruction[1]] = Math.floor(registers[instruction[1]] / val);
      break;
    // mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
    case 'mod':
      val = (regNames.includes(instruction[2]) ? registers[instruction[2]] : Number(instruction[2]) ); 
      registers[instruction[1]] = registers[instruction[1]] % val;
      break;
    // eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.
    case 'eql':
      val = (regNames.includes(instruction[2]) ? registers[instruction[2]] : Number(instruction[2]) ); 
      registers[instruction[1]] = (registers[instruction[1]] == val) ? 1 : 0;
      break;
  }
}

// finds the indexes of the digits checked against each other and their checked diff
const matches = (params) => {
  let stack = [];
  let retArr = [];
  for (let i = 0; i < 14; i++) {
    if (params[i].div != 26) {
      stack.push({index: i, num2: params[i].num2});
    } else {
      const pop = stack.pop();
      retArr.push({i1: pop.index, i2: i, diff: (pop.num2 + params[i].num1)});
    }
  }
  return retArr;
}

const ex1 = (file) => {
  const lines = readFile(file);

  const ins = lines.map(line => line.split(" "));

  let params = [];
  for (let i = 0; i < 14; i++) {
    params.push({div: Number(ins[i*18+4][2]), num1: Number(ins[i*18+5][2]), num2: Number(ins[i*18+15][2])});
  }

  const matchArr = matches(params);

  let min = [1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  let max = [9,9,9,9,9,9,9,9,9,9,9,9,9,9];

  matchArr.forEach(match => {
    if (match.diff >= 0) {
      min[match.i1] = 1;
      min[match.i2] = 1 + match.diff;
      max[match.i1] = 9 - match.diff;
      max[match.i2] = 9;
    } else {
      min[match.i1] = 1 - match.diff;
      min[match.i2] = 1;
      max[match.i1] = 9;
      max[match.i2] = 9 + match.diff;
    }
  });

  console.log(`EX 24-1: The maximum viable serial number is ${max.join("")}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  const ins = lines.map(line => line.split(" "));

  let params = [];
  for (let i = 0; i < 14; i++) {
    params.push({div: Number(ins[i*18+4][2]), num1: Number(ins[i*18+5][2]), num2: Number(ins[i*18+15][2])});
  }

  const matchArr = matches(params);

  let min = [1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  let max = [9,9,9,9,9,9,9,9,9,9,9,9,9,9];

  matchArr.forEach(match => {
    if (match.diff >= 0) {
      min[match.i1] = 1;
      min[match.i2] = 1 + match.diff;
      max[match.i1] = 9 - match.diff;
      max[match.i2] = 9;
    } else {
      min[match.i1] = 1 - match.diff;
      min[match.i2] = 1;
      max[match.i1] = 9;
      max[match.i2] = 9 + match.diff;
    }
  });

  console.log(`EX 24-2: The minimum viable serial number is ${min.join("")}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 24-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 24-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);