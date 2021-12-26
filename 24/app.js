const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};




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

const ex1 = (file) => {
  const lines = readFile(file);

  const instructions = lines.map(line => line.split(" "));

  let number = 99999999999999;
  let accepted = false;

  while (!accepted) {
    const registers = {w: 0, x: 0, y: 0, z: 0};
    let input = number.toString().split("").map(dig => Number(dig));
    if (!(input.includes(0))) {
      console.log(number);
      instructions.forEach(instruction => run(instruction, registers, input));
      if (registers.z == 0) {
        accepted = true;
      } else {
        number--;
      }
    } else {
      number--;
    }
  }

  console.log(number);



//  console.log(`EX 24-1: The losers score times the number of rolls is ${loserRolls}.`);
};

const ex2 = (file) => {
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 24-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 24-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);