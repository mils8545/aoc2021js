const fs = require('fs');

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const fishDay = (initialFishCount) => {
  let fishCount = [];
  if (typeof(initialFishCount[0])== 'bigint') {
    fishCount = initialFishCount.map(fish => 0n);
  } else {
    fishCount = initialFishCount.map(fish => 0);
  }
  
  for (let i = 0; i < 8; i++) {
    fishCount[i] = initialFishCount[i+1];
  }
  fishCount[6] += initialFishCount[0];
  fishCount[8] = initialFishCount[0];
  return fishCount;
}

const fishTotal = (fishCount) => {
  if (typeof(fishCount[0]) == 'bigint') {
    return fishCount.reduce((prev, curr) => prev + curr,0n);
  } else {
    return fishCount.reduce((prev, curr) => prev + curr,0);
  }
}

const ex1 = (file) => {
  const DAYS = 80;
  const fileLines = readFile(file);
  const startingFish = fileLines[0].split(",").map(fish => Number(fish));
  let fishCount = [0,0,0,0,0,0,0,0,0];

  startingFish.forEach(fish => fishCount[fish] += 1);

  for (let i = 1; i <= DAYS; i++) {
    fishCount = fishDay(fishCount);
  }

  console.log(`Ex 1: After ${DAYS} there would be ${fishTotal(fishCount)} fish.`);
}

const ex2 = (file) => {
  const DAYS = 256;
  const fileLines = readFile(file);
  const startingFish = fileLines[0].split(",").map(fish => Number(fish));
  let fishCount = [0n,0n,0n,0n,0n,0n,0n,0n,0n];

  startingFish.forEach(fish => fishCount[fish] += 1n);

  for (let i = 1; i <= DAYS; i++) {
    fishCount = fishDay(fishCount);
  }

  console.log(`Ex 2: After ${DAYS} there would be ${fishTotal(fishCount)} fish.`);
}


ex1(process.argv[2]);
ex2(process.argv[2]);