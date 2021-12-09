const fs = require('fs')

fs.readFile(process.argv[2], 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split(/\r?\n/);
  const moves = lines.map( (line) => line.split(" "));
  console.log(moves);
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
  console.log(`Horizontal: ${horizontal}, Depth: ${depth}, Multiplied: ${horizontal * depth}`);

});
