const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const playGameEx2 = (p1p, p2p, p1s, p2s, p1t) => {
  if (p1s >= 21) return {p1w: 1, p2w: 0};
  if (p2s >= 21) return {p1w: 0, p2w: 1};

  let ret = {p1w: 0, p2w: 0};
  let res;
  let posCalc;

  const rolls = [[3,1],[4,3],[5,6],[6,7],[7,6],[8,3],[9,1]];

  if (p1t) {
    rolls.forEach(roll => {
      posCalc = (roll[0] + p1p - 1) % 10 + 1;
      res = playGameEx2(posCalc, p2p, p1s + posCalc, p2s, false);
      ret.p1w += roll[1] * res.p1w;
      ret.p2w += roll[1] * res.p2w;
    });
    return ret;
  }
  if (!p1t) {
    rolls.forEach(roll => {
      posCalc = (roll[0] + p2p - 1) % 10 + 1;
      res = playGameEx2(p1p, posCalc, p1s, p2s + posCalc, true);
      ret.p1w += roll[1] * res.p1w;
      ret.p2w += roll[1] * res.p2w;
    });
    return ret;
  }
  console.log("UNREACHABLE");
}

const ex1 = (file) => {
  const lines = readFile(file);
  let p1position = Number(lines[0].slice(lines[0].indexOf(':')+2));
  let p2position = Number(lines[1].slice(lines[1].indexOf(':')+2));
  let p1score = 0;
  let p2score = 0;
  let dieRolls = 0;
  let die = 1;
  p1turn = true;

  while ((p1score < 1000) && (p2score < 1000)) {
    let count = 0;
    count += die;
    die = die % 100 + 1;
    count += die;
    die = die % 100 + 1;
    count += die;
    die = die % 100 + 1;
    if (p1turn) {
      p1position = (count + p1position - 1) % 10 + 1;
      p1score += p1position;
      dieRolls += 3;
      p1turn = false;
    } else {
      p2position = (count + p2position - 1) % 10 + 1;
      p2score += p2position;
      dieRolls += 3;
      p1turn = true;
    }
  }

  let loserRolls = dieRolls;
  if (p1score > p2score) {
    loserRolls = loserRolls * p2score;
  } else {
    loserRolls = loserRolls * p1score;
  }

  console.log(`EX 21-1: The losers score times the number of rolls is ${loserRolls}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  let p1position = Number(lines[0].slice(lines[0].indexOf(':')+2));
  let p2position = Number(lines[1].slice(lines[1].indexOf(':')+2));

  let results = playGameEx2(p1position, p2position, 0, 0, true);

  if (results.p1w > results.p2w) {
    console.log(`EX 21-2: Player 1 wins in more universes with ${results.p1w} wins.`);
  } else if (results.p1w < results.p2w) {
    console.log(`EX 21-2: Player 2 wins in more universes with ${results.p2w} wins.`);
  } else {
    console.log(`EX 21-2: Player 1&2 win in an equal amount of universes with ${results.p1w} wins.`);
  }
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 21-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 21-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);