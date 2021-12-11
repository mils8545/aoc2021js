const fs = require('fs')

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const ex1 = (file) => {
  lines = readFile(file);
  const moves = lines.map( (line) => line.split(" "));
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  moves.forEach(move => {
    switch (move[0]) {
      case 'forward':
        horizontal += Number(move[1]);
        break;
      case 'up':
        depth -= Number(move[1]);
        break;
      case 'down':
        depth += Number(move[1]);
        break;      
      default:
        break;
    }
    
  });
  console.log(`EX 02-1: Horizontal: ${horizontal}, Depth: ${depth}, Multiplied: ${horizontal * depth}`);
}

const ex2 = (file) => {
  lines = readFile(file);
  lines = readFile(file);
  const moves = lines.map( (line) => line.split(" "));
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  moves.forEach(move => {
    switch (move[0]) {
      case 'forward':
        horizontal += Number(move[1]);
        depth += aim * (move[1]);
        break;
      case 'up':
        aim -= Number(move[1]);
        break;
      case 'down':
        aim += Number(move[1]);
        break;      
      default:
        break;
    }
    
  });
  console.log(`EX 02-2: Horizontal: ${horizontal}, Depth: ${depth}, Multiplied: ${horizontal * depth}`);

}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 02-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 02-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);
