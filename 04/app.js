const fs = require('fs');
let lines;

const readFile = (readFile) => {
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const parseBingoLine = (line) => {
  let returnLine = line;
  if (line[0] == ' ') {
    returnLine = line.slice(1);
  }
  returnLine = returnLine.replaceAll('  ',' ').split(' ');
 
  return returnLine;
}

const dotCard = (card, cardDots, ball) => {
  let returnDots = cardDots;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (card[i][j] == ball) {
        returnDots[i][j] = true; 
      }
    }
  }
  return returnDots;
}

const checkBingo = (cardDots) => { 
  let bingo = false;
  for (let i = 0; i < 5; i++) {
    if (cardDots[i][0] && cardDots[i][1] && cardDots[i][2] && cardDots[i][3] && cardDots[i][4]) bingo = true;
    if (cardDots[0][i] && cardDots[1][i] && cardDots[2][i] && cardDots[3][i] && cardDots[4][i]) bingo = true;
  };
  // if (cardDots[0][0] && cardDots[1][1] && cardDots[2][2] && cardDots[3][3] && cardDots[4][4]) bingo = true;
  // if (cardDots[0][4] && cardDots[1][3] && cardDots[2][2] && cardDots[3][1] && cardDots[4][0]) bingo = true;
  return bingo;
}

const scoreCard = (card, cardDots, ball) => {
  let total = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!cardDots[i][j]) {
        total += Number(card[i][j]); 
      }
    }
  }
  return total * ball;
}

const ex1 = async (file) => {
  let lines = readFile(file);
  let balls = lines.shift().split(',');
  let cards = [];
  let cardDots = [];
  let i = 0;
  while(lines.length > 4) {
    lines.shift();
    cards.push([]);
    cardDots.push([]);
    for (let j = 0; j < 5; j++) {
      cards[i].push(parseBingoLine(lines.shift()));
      cardDots[i].push([false, false, false, false, false]);
    }
    i++;
  }

  let curBall = -1;
  let winningCard = -1;
  while(winningCard < 0) {
    curBall++;
    for (let i = 0; i < cards.length; i++) {
      cardDots[i] = dotCard(cards[i],cardDots[i],balls[curBall]);
      if (checkBingo(cardDots[i])) winningCard = i;
    }
  }

  console.log(`Winning Card Index: ${winningCard}, Score: ${scoreCard(cards[winningCard],cardDots[winningCard],balls[curBall])}`);
}



const ex2 = (file) => {
  let lines = readFile(file);
  let balls = lines.shift().split(',');
  let cards = [];
  let cardDots = [];
  let i = 0;
  while(lines.length > 4) {
    lines.shift();
    cards.push([]);
    cardDots.push([]);
    for (let j = 0; j < 5; j++) {
      cards[i].push(parseBingoLine(lines.shift()));
      cardDots[i].push([false, false, false, false, false]);
    }
    i++;
  }

  let curBall = -1;
  while(cards.length > 1) {
    curBall++;
    for (let i = 0; i < cards.length; i++) {
      cardDots[i] = dotCard(cards[i],cardDots[i],balls[curBall]);
      if (checkBingo(cardDots[i])) {
        cards.splice(i,1);
        cardDots.splice(i,1);
        i--;
      }
    }
  }

  while(!checkBingo(cardDots[0])) {
    curBall++;
    cardDots[0] = dotCard(cards[0],cardDots[0],balls[curBall]);
  }

  console.log(cards);
  console.log(cardDots);

  console.log(`Losing Card Score: ${scoreCard(cards[0],cardDots[0],balls[curBall])}`);
}


ex1(process.argv[2]);
ex2(process.argv[2]);