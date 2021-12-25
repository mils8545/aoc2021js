const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const checkIntersect = (box1, box2) => {
  let overlap = false;
  if ((((box1.x1 >= box2.x1) && (box1.x1 <= box2.x2)) || ((box2.x1 >= box1.x1) && (box2.x1 <= box1.x2))) 
    && (((box1.y1 >= box2.y1) && (box1.y1 <= box2.y2)) || ((box2.y1 >= box1.y1) && (box2.y1 <= box1.y2))) 
    && (((box1.z1 >= box2.z1) && (box1.z1 <= box2.z2)) || ((box2.z1 >= box1.z1) && (box2.z1 <= box1.z2)))) overlap = true;
  return overlap;
};

const calcIntersect = (box1, box2) => {

  const x1 = Math.max(box1.x1, box2.x1);
  const x2 = Math.min(box1.x2, box2.x2);

  const y1 = Math.max(box1.y1, box2.y1);
  const y2 = Math.min(box1.y2, box2.y2);

  const z1 = Math.max(box1.z1, box2.z1);
  const z2 = Math.min(box1.z2, box2.z2);

  return {x1: x1, x2: x2, y1: y1, y2: y2, z1: z1, z2: z2};
}

const boxScore = (box) => {
  return (Math.abs(box.x2-box.x1+1)*Math.abs(box.y2-box.y1+1)*Math.abs(box.z2-box.z1+1)) * ((box.on) ? 1 : -1);
}

const ex1 = (file) => {
  const lines = readFile(file);

  let boxes = lines.map(line => {
    const xyz = line.replaceAll("=", ',').replaceAll("..", ",").split(",");
    const on = (line[1] == 'f') ? false : true;
    return {x1: Number(xyz[1]), x2: Number(xyz[2]), y1: Number(xyz[4]), y2: Number(xyz[5]), z1: Number(xyz[7]), z2: Number(xyz[8]), on: on };
  });

  boxes = boxes.filter(box => {
    let bounds = true;
    if (Math.abs(box.x1) > 51) bounds  = false;
    if (Math.abs(box.x2) > 51) bounds  = false;
    if (Math.abs(box.y1) > 51) bounds  = false;
    if (Math.abs(box.y2) > 51) bounds  = false;
    if (Math.abs(box.z1) > 51) bounds  = false;
    if (Math.abs(box.z2) > 51) bounds  = false;
    return bounds;
  });

  let checked = [];

  while (boxes.length > 0) {
    const curBox = boxes.shift();
    let calcedBoxes = [];
    for (let i = 0; i < checked.length; i++) {
      if (checkIntersect(curBox, checked[i])) {
        let intersect = (calcIntersect(curBox, checked[i]));
        if (checked[i].on) {
          intersect.on = false;
          calcedBoxes.push(intersect);          
        }
        if (!checked[i].on) {
          intersect.on = true;
          calcedBoxes.push(intersect);          
        }
      }
    }
    if (curBox.on) calcedBoxes.push(curBox);
    checked = [...checked, ...calcedBoxes];
  }

  score = checked.reduce((prev, curr) => prev + boxScore(curr),0);

  console.log(`EX 22-1: After the reboot procedure ${score} cells are on.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let boxes = lines.map(line => {
    const xyz = line.replaceAll("=", ',').replaceAll("..", ",").split(",");
    const on = (line[1] == 'f') ? false : true;
    return {x1: Number(xyz[1]), x2: Number(xyz[2]), y1: Number(xyz[4]), y2: Number(xyz[5]), z1: Number(xyz[7]), z2: Number(xyz[8]), on: on };
  });

  let checked = [];

  while (boxes.length > 0) {
    const curBox = boxes.shift();
    let calcedBoxes = [];
    for (let i = 0; i < checked.length; i++) {
      if (checkIntersect(curBox, checked[i])) {
        let intersect = (calcIntersect(curBox, checked[i]));
        if (checked[i].on) {
          intersect.on = false;
          calcedBoxes.push(intersect);          
        }
        if (!checked[i].on) {
          intersect.on = true;
          calcedBoxes.push(intersect);          
        }
      }
    }
    if (curBox.on) calcedBoxes.push(curBox);
    checked = [...checked, ...calcedBoxes];
  }

  score = checked.reduce((prev, curr) => prev + boxScore(curr),0);

  console.log(`EX 22-2: After the reboot procedure ${score} cells are on.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 22-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 22-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);