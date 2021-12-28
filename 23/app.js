const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const findMoves = (map, cost) => {
  const moveCost = {A: 1, B: 10, C: 100, D: 1000};
  let retArr = [];
  let newMove;

  let aStack;
  let bStack;
  let cStack;
  let dStack;

  const aEmpty = 4 - map.slice(11, 15).replaceAll(".","").length;
  const bEmpty = 4 - map.slice(15, 19).replaceAll(".","").length;
  const cEmpty = 4 - map.slice(19, 23).replaceAll(".","").length;
  const dEmpty = 4 - map.slice(23, 27).replaceAll(".","").length;

  if (map.slice(11, 15).replaceAll(".","").replaceAll("A","").length != 0) {
    aStack = -1;    
  } else if (map[14] == '.') {
    aStack = 0;
  } else if (map[13] == '.') {
    aStack = 1;
  } else if (map[12] == '.') {
    aStack = 2;
  } else if (map[11] == '.') {
    aStack = 3;
  } else if (map[11] == 'A') {
    aStack = 4;
  }

  if (map.slice(15, 19).replaceAll(".","").replaceAll("B","").length != 0) {
    bStack = -1;    
  } else if (map[18] == '.') {
    bStack = 0;
  } else if (map[17] == '.') {
    bStack = 1;
  } else if (map[16] == '.') {
    bStack = 2;
  } else if (map[15] == '.') {
    bStack = 3;
  } else if (map[15] == 'B') {
    bStack = 4;
  }

  if (map.slice(19, 23).replaceAll(".","").replaceAll("C","").length != 0) {
    cStack = -1;    
  } else if (map[22] == '.') {
    cStack = 0;
  } else if (map[21] == '.') {
    cStack = 1;
  } else if (map[20] == '.') {
    cStack = 2;
  } else if (map[19] == '.') {
    cStack = 3;
  } else if (map[19] == 'C') {
    cStack = 4;
  }

  if (map.slice(23).replaceAll(".","").replaceAll("D","").length != 0) {
    dStack = -1;    
  } else if (map[26] == '.') {
    dStack = 0;
  } else if (map[25] == '.') {
    dStack = 1;
  } else if (map[24] == '.') {
    dStack = 2;
  } else if (map[23] == '.') {
    dStack = 3;
  } else if (map[23] == 'D') {
    dStack = 4;
  }

  if (map[0] != "." && map[1] == ".") {
    if (map[0] == "A" && aStack >= 0) {
      newMove = "." + map.slice(1,14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (6-aStack) ) });
    } else if (map[0] == "B" && map[3] == "." && bStack >= 0 ) {
      newMove = "." + map.slice(1,18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (8-bStack) ) });
    } else if (map[0] == "C" && map[3] == "." && map[5] == "." && cStack >= 0) {
      newMove = "." + map.slice(1,22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (10-cStack) ) });
    } else if (map[0] == "D" && map[3] == "." && map[5] == "." && map[7] == "." && dStack >= 0) {
      newMove = "." + map.slice(1,26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (12-dStack) ) });
    }
  }

  if (map[1] != ".") {
    if (map[1] == "A" && aStack >= 0) {
      newMove = map[0] + "." + map.slice(2,14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (5-aStack) ) });
    } else if (map[1] == "B" && map[3] == "." && bStack >= 0) {
      newMove = map[0] + "." + map.slice(2,18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (7-bStack) ) });
    } else if (map[1] == "C" && map[3] == "." && map[5] == "." && cStack >= 0) {
      newMove = map[0] + "." + map.slice(2,22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (9-cStack) ) });
    } else if (map[1] == "D" && map[3] == "." && map[5] == "." && map[7] == "." && dStack >= 0) {
      newMove = map[0] + "." + map.slice(2,26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (11-dStack) ) });
    }
  }

  if (map[10] != "." && map[9] == ".") {
    if (map[10] == "A" && map[3] == "." && map[5] == "." && map[7] == "." && aStack >= 0) {
      newMove = map.slice(0,10) + "." + map.slice(11, 14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (12-aStack) ) });
    } else if (map[10] == "B" && map[5] == "." && map[7] == "." && bStack >= 0 ) {
      newMove = map.slice(0,10) + "." + map.slice(11, 18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (10-bStack) ) });
    } else if (map[10] == "C" && map[7] == "." && cStack >= 0) {
      newMove = map.slice(0,10) + "." + map.slice(11, 22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (8-cStack) ) });
    } else if (map[10] == "D" && dStack >= 0) {
      newMove = map.slice(0,10) + "." + map.slice(11, 26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (6-dStack) ) });
    }
  }

  if (map[9] != ".") {
    if (map[9] == "A" && map[3] == "." && map[5] == "." && map[7] == "." && aStack >= 0) {
      newMove = map.slice(0,9) + "." + map.slice(10, 14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (11-aStack) ) });
    } else if (map[9] == "B" && map[5] == "." && map[7] == "." && bStack >= 0 ) {
      newMove = map.slice(0,9) + "." + map.slice(10, 18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (9-bStack) ) });
    } else if (map[9] == "C" && map[7] == "." && cStack >= 0) {
      newMove = map.slice(0,9) + "." + map.slice(10, 22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (7-cStack) ) });
    } else if (map[9] == "D" && dStack >= 0) {
      newMove = map.slice(0,9) + "." + map.slice(10, 26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (5-dStack) ) });
    }
  }

  if (map[3] != ".") {
    if (map[3] == "A" && aStack >= 0) {
      newMove = map.slice(0,3) + "." + map.slice(4, 14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (5-aStack) ) });
    } else if (map[3] == "B" && bStack >= 0 ) {
      newMove = map.slice(0,3) + "." + map.slice(4, 18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (5-bStack) ) });
    } else if (map[3] == "C" && map[5] == "." && cStack >= 0) {
      newMove = map.slice(0,3) + "." + map.slice(4, 22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (7-cStack) ) });
    } else if (map[3] == "D" && map[5] == "." && map[7] == "." && dStack >= 0) {
      newMove = map.slice(0,3) + "." + map.slice(4, 26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (9-dStack) ) });
    }
  }

  if (map[5] != ".") {
    if (map[5] == "A" && map[3] == "." && aStack >= 0) {
      newMove = map.slice(0,5) + "." + map.slice(6, 14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (7-aStack) ) });
    } else if (map[5] == "B" && bStack >= 0 ) {
      newMove = map.slice(0,5) + "." + map.slice(6, 18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (5-bStack) ) });
    } else if (map[5] == "C" && cStack >= 0) {
      newMove = map.slice(0,5) + "." + map.slice(6, 22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (5-cStack) ) });
    } else if (map[5] == "D" && map[7] == "." && dStack >= 0) {
      newMove = map.slice(0,5) + "." + map.slice(6, 26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (7-dStack) ) });
    }
  }

  if (map[7] != ".") {
    if (map[7] == "A" && map[3] == '.' && map[5] == "." && aStack >= 0) {
      newMove = map.slice(0,7) + "." + map.slice(8, 14-aStack) + "A" + map.slice(15-aStack);
      retArr.push({map: newMove, cost: cost + (moveCost["A"] * (9-aStack) ) });
    } else if (map[7] == "B" && map[5] == "." && bStack >= 0 ) {
      newMove = map.slice(0,7) + "." + map.slice(8, 18-bStack) + "B" + map.slice(19-bStack);
      retArr.push({map: newMove, cost: cost + (moveCost["B"] * (7-bStack) ) });
    } else if (map[7] == "C" && cStack >= 0) {
      newMove = map.slice(0,7) + "." + map.slice(8, 22-cStack) + "C" + map.slice(23-cStack);
      retArr.push({map: newMove, cost: cost + (moveCost["C"] * (5-cStack) ) });
    } else if (map[7] == "D" && dStack >= 0) {
      newMove = map.slice(0,7) + "." + map.slice(8, 26-dStack) + "D" + map.slice(27-dStack);
      retArr.push({map: newMove, cost: cost + (moveCost["D"] * (5-dStack) ) });
    }
  }

  if (aStack < 0) {
    if (aEmpty < 4) {
      if (map[1] == '.') {
        newMove = map.slice(0,1) + map[11 + aEmpty] + map.slice(2, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (2 + aEmpty) ) });  
        if (map[0] == '.') {
          newMove = map[11 + aEmpty] + map.slice(1, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (3 + aEmpty) ) });  
        }
      } 
      if (map[3] == '.') {
        newMove = map.slice(0, 3) + map[11 + aEmpty] + map.slice(4, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (2 + aEmpty) ) });  
        if (map[5] == '.') {
          newMove = map.slice(0, 5) + map[11 + aEmpty] + map.slice(6, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (4 + aEmpty) ) });  
          if (map[7] == '.') {
            newMove = map.slice(0, 7) + map[11 + aEmpty] + map.slice(8, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
            retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (6 + aEmpty) ) });  
            if (map[9] == '.') {
              newMove = map.slice(0, 9) + map[11 + aEmpty] + map.slice(10, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
              retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (8 + aEmpty) ) });  
              if (map[10] == '.') {
                newMove = map.slice(0, 10) + map[11 + aEmpty] + map.slice(11, 11 + aEmpty) + "." + map.slice(12 + aEmpty);
                retArr.push({map: newMove, cost: cost + (moveCost[map[11 + aEmpty]] * (9 + aEmpty) ) });  
              }
            }
          }
        }
      }
    }
  }

  if (bStack < 0) {
    if (bEmpty < 4) {
      if (map[3] == '.') {
        newMove = map.slice(0,3) + map[15 + bEmpty] + map.slice(4, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (2 + bEmpty) ) });
        if (map[1] == '.') {
          newMove = map.slice(0,1) + map[15 + bEmpty] + map.slice(2, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (4 + bEmpty) ) });
          if (map[0] == '.') {
            newMove = map[15 + bEmpty] + map.slice(1, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
            retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (5 + bEmpty) ) });
          }
        }
      }
      if (map[5] == '.') {
        newMove = map.slice(0,5) + map[15 + bEmpty] + map.slice(6, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (2 + bEmpty) ) });
        if (map[7] == '.') {
          newMove = map.slice(0,7) + map[15 + bEmpty] + map.slice(8, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (4 + bEmpty) ) });
          if (map[9] == '.') {
            newMove = map.slice(0,9) + map[15 + bEmpty] + map.slice(10, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
            retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (6 + bEmpty) ) });
            if (map[10] == '.') {
              newMove = map.slice(0,10) + map[15 + bEmpty] + map.slice(11, 15 + bEmpty) + "." + map.slice(16 + bEmpty);
              retArr.push({map: newMove, cost: cost + (moveCost[map[15 + bEmpty]] * (7 + bEmpty) ) });
            }
          }
        }
      }
    }
  }

  if (cStack < 0) {
    if (cEmpty < 4) {
      if (map[5] == '.') {
        newMove = map.slice(0,5) + map[19 + cEmpty] + map.slice(6, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (2 + cEmpty) ) });
        if (map[3] == '.') {
          newMove = map.slice(0,3) + map[19 + cEmpty] + map.slice(4, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (4 + cEmpty) ) });
          if (map[1] == '.') {
            newMove = map.slice(0,1) + map[19 + cEmpty] + map.slice(2, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
            retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (6 + cEmpty) ) });
            if (map[0] == '.') {
              newMove = map[19 + cEmpty] + map.slice(1, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
              retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (7 + cEmpty) ) });
            }
          }
        }
      }
      if (map[7] == '.') {
        newMove = map.slice(0,7) + map[19 + cEmpty] + map.slice(8, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (2 + cEmpty) ) });
        if (map[9] == '.') {
          newMove = map.slice(0,9) + map[19 + cEmpty] + map.slice(10, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (4 + cEmpty) ) });
          if (map[10] == '.') {
            newMove = map.slice(0,10) + map[19 + cEmpty] + map.slice(11, 19 + cEmpty) + "." + map.slice(20 + cEmpty);
            retArr.push({map: newMove, cost: cost + (moveCost[map[19 + cEmpty]] * (5 + cEmpty) ) });
          }
        }
      }
    }
  }

  if (dStack < 0) {
    if (dEmpty < 4) {
      if (map[9] == '.') {
        newMove = map.slice(0,9) + map[23 + dEmpty] + map.slice(10, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (2 + dEmpty) ) });
        if (map[10] == '.') {
          newMove = map.slice(0,10) + map[23 + dEmpty] + map.slice(11, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (3 + dEmpty) ) });
        }
      }
      if (map[7] == '.') {
        newMove = map.slice(0,7) + map[23 + dEmpty] + map.slice(8, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
        retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (2 + dEmpty) ) });
        if (map[5] == '.') {
          newMove = map.slice(0,5) + map[23 + dEmpty] + map.slice(6, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
          retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (4 + dEmpty) ) });
          if (map[3] == '.') {
            newMove = map.slice(0,3) + map[23 + dEmpty] + map.slice(4, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
            retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (6 + dEmpty) ) });
            if (map[1] == '.') {
              newMove = map.slice(0,1) + map[23 + dEmpty] + map.slice(2, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
              retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (8 + dEmpty) ) });
              if (map[0] == '.') {
                newMove = map[23 + dEmpty] + map.slice(1, 23 + dEmpty) + "." + map.slice(24 + dEmpty);
                retArr.push({map: newMove, cost: cost + (moveCost[map[23 + dEmpty]] * (9 + dEmpty) ) });
              } 
            } 
          } 
        } 
      } 
    }
  }

  return (retArr);
} 

const ex1 = (file) => {
  const lines = readFile(file);

  let map = "..........." + lines[2][3] + lines[3][3] + "AA" + lines[2][5] + lines[3][5] + "BB" + lines[2][7] + lines[3][7] + "CC" + lines[2][9] + lines[3][9] + "DD";

  const solved = "...........AAAABBBBCCCCDDDD";

  let mapped = {};
  mapped[map] = 0;
  let queue = [map];

  while (queue[0] != solved) {
    const current = queue.shift();
    const moves = findMoves(current, mapped[current]);

    moves.forEach(move => {
      if (!(mapped[move.map])) {
        mapped[move.map] = move.cost;
        queue.push(move.map);
      } else if (mapped[move.map] > move.cost) {
        mapped[move.map] = move.cost;
        if (!queue.includes(move.map)) queue.push(move.map);
      }
    });
    queue.sort((a,b) => mapped[a] - mapped[b]);
  }

  console.log(`EX 23-1: The minimum energy required is ${mapped[solved]} for the Amphipods to organize.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let map = "..........." + lines[2][3] + "DD" + lines[3][3] + lines[2][5] + "CB" + lines[3][5] + lines[2][7] + "BA" + lines[3][7] + lines[2][9] + "AC" + lines[3][9];

  // #D#C#B#A#
  // #D#B#A#C#
  
  const solved = "...........AAAABBBBCCCCDDDD";

  let mapped = {};
  mapped[map] = 0;
  let queue = [map];

  while (queue[0] != solved) {
    const current = queue.shift();
    const moves = findMoves(current, mapped[current]);

    moves.forEach(move => {
      if (!(mapped[move.map])) {
        mapped[move.map] = move.cost;
        queue.push(move.map);
      } else if (mapped[move.map] > move.cost) {
        mapped[move.map] = move.cost;
        if (!queue.includes(move.map)) queue.push(move.map);
      }
    });
    queue.sort((a,b) => mapped[a] - mapped[b]);
  }

  console.log(`EX 23-2: The minimum energy required is ${mapped[solved]} for the Amphipods to organize.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 23-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 23-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);