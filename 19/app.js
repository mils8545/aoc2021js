const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n\r\n/);
  return lines;
};

// Counter Rotations, not necessary but keeping in case I reuse the code.
//  0- 0,  1- 3,  2- 2,  3- 1,
//  4- 4,  5- 5,  6- 6,  7- 7,
//  8-12,  9-23, 10-10, 11-17,
// 12- 8, 13-19, 14-14, 15-21,
// 16-20, 17-11, 18-18, 19-13,
// 20-16, 21-15, 22-22, 23- 9

const rotatePoint = (point, rotation) => {
  const { x, y, z } = point;
  switch (rotation) {
    case 0:
      return { x: x, y: y, z: z };
    case 1:
      return { x: -y, y: x, z: z };
    case 2:
      return { x: -x, y: -y, z: z };
    case 3:
      return { x: y, y: -x, z: z };
    case 4:
      return { x: -x, y: y, z: -z };
    case 5:
      return { x: y, y: x, z: -z };
    case 6:
      return { x: x, y: -y, z: -z };
    case 7:
      return { x: -y, y: -x, z: -z };
    case 8:
      return { x: -z, y: y, z: x };
    case 9:
      return { x: -y, y: -z, z: x };
    case 10:
      return { x: z, y: -y, z: x };
    case 11:
      return { x: y, y: z, z: x };
    case 12:
      return { x: z, y: y, z: -x };
    case 13:
      return { x: -y, y: z, z: -x };
    case 14:
      return { x: -z, y: -y, z: -x };
    case 15:
      return { x: y, y: -z, z: -x };
    case 16:
      return { x: x, y: -z, z: y };
    case 17:
      return { x: z, y: x, z: y };
    case 18:
      return { x: -x, y: z, z: y };
    case 19:
      return { x: -z, y: -x, z: y };
    case 20:
      return { x: x, y: z, z: -y };
    case 21:
      return { x: -z, y: x, z: -y };
    case 22:
      return { x: -x, y: -z, z: -y };
    case 23:
      return { x: z, y: -x, z: -y };
  }
};

const rotatePoints = (points, rotation) => {
  return points.map(point => rotatePoint(point, rotation));
}

const calcDistances = (points) => {
  let distances = [];
  points.forEach(p1 => {
    distances.push(
      points.map(p2 => ({x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z, dist: Math.pow(Math.pow(p2.x - p1.x,2)+Math.pow(p2.y - p1.y,2)+Math.pow(p2.z - p1.z,2),1/2)}))
    );
  })
  return distances;
};

const compareDistancesQuick = (dist1, dist2) => {
  let maxCount = -Infinity;
  for (let i = 0; i < dist1.length; i++) {
    let count = 0;
    for (let j = i + 1; j < dist1.length; j++) {
      for (let k = 0; k < dist2.length; k++) {
        for (let l = k + 1; l < dist2.length; l++) {
          if (i != j && k != l) {
            if (dist1[i][j].dist == dist2[k][l].dist) {
              count++;
            }
          }
        }
      }
    }
    if (count > maxCount) maxCount = count;
  }
  return maxCount + 1;
};

const compareDistancesFull = (dist1, dist2) => {
  let maxCount = -Infinity;
  for (let i = 0; i < dist1.length; i++) {
    let count = 0;
    for (let j = 0; j < dist1.length; j++) {
      for (let k = 0; k < dist2.length; k++) {
        for (let l = 0; l < dist2.length; l++) {
          if (i != j && k != l) {
            if ((dist1[i][j].x == dist2[k][l].x)&&(dist1[i][j].y == dist2[k][l].y)&&(dist1[i][j].z == dist2[k][l].z)) {
              count++;
            }
          }
        }
      }
    }
    if (count > maxCount) maxCount = count;
  }
  return maxCount + 1;
};

const findRotation = (knownPoints, unknownPoints) => {
  for (let i = 0; i < 24; i++) {
    if (compareDistancesFull(calcDistances(knownPoints), calcDistances(rotatePoints(unknownPoints, i))) >= 12) return i;
  }
}

const findRelativePosition = (basePoints, unknownPoints) => {
  for (let i = 0; i < basePoints.length; i++) {
    for (let k = 0; k < unknownPoints.length; k++) {
      let count = 0;
      for (let j = 0; j < basePoints.length; j++) {
        for (let l = 0; l < unknownPoints.length; l++) {
          if (i != j) {
            if (((basePoints[j].x - basePoints[i].x) == (unknownPoints[l].x - unknownPoints[k].x)) &&
            ((basePoints[j].y - basePoints[i].y) == (unknownPoints[l].y - unknownPoints[k].y)) &&
            ((basePoints[j].z - basePoints[i].z) == (unknownPoints[l].z - unknownPoints[k].z)) ) {
              count++;
            }
          }
        }
      }
      if (count >=6) return {x: basePoints[i].x - unknownPoints[k].x, y: basePoints[i].y - unknownPoints[k].y, z: basePoints[i].z - unknownPoints[k].z};
    }
  }
}

const translatePoints = (points, translation) => {
  return points.map(point => ({x: point.x + translation.x, y: point.y + translation.y, z: point.z + translation.z}));
}

const manhattanDistance = (point1, point2) => {
  return (Math.abs(point2.x-point1.x)+Math.abs(point2.y-point1.y)+Math.abs(point2.z-point1.z));
}

const ex1 = (file) => {
  const rawProbes = readFile(file);
  let probes = rawProbes.map((lines) => ({
    points: lines
      .split(/\r\n/)
      .slice(1)
      .map((line) => ({
        x: Number(line.split(",")[0]),
        y: Number(line.split(",")[1]),
        z: Number(line.split(",")[2]),
      })),
  }));
  probes.forEach((probe) => (probe.distances = calcDistances(probe.points)));

  let linked = [];
  for (let i = 0; i < probes.length; i++) {
    for (let j = i + 1; j < probes.length; j++) {
      const tempCount = compareDistancesQuick(probes[i].distances, probes[j].distances);
      if (tempCount >= 12) {
        linked.push([i, j]);
      }
    }
  }

  linked = [...linked, ...linked.map(link => [link[1],link[0]])];

  let solved = [0];
  probes[0].rotation = 0;
  probes[0].coords = {x: 0, y: 0, z: 0};

  while (solved.length < probes.length) {
    linked.forEach(link => {
      let rot;
      if ((solved.includes(link[0]))&&!(solved.includes(link[1]))) {
        rot = findRotation(probes[link[0]].points, probes[link[1]].points);
        probes[link[1]].rotation = rot;
        probes[link[1]].points = rotatePoints(probes[link[1]].points, rot);
        probes[link[1]].distances = calcDistances(probes[link[1]].points);
        const relativePosition = findRelativePosition(probes[link[0]].points, probes[link[1]].points);
        probes[link[1]].coords = {x: relativePosition.x + probes[link[0]].coords.x,y: relativePosition.y + probes[link[0]].coords.y, z: relativePosition.z + probes[link[0]].coords.z };
        solved.push(link[1]);
      };
    });
  }

  let pointList = [];

  probes.forEach(probe => {
    translatePoints(probe.points, probe.coords).forEach(point => {
      let exists = false;
      pointList.forEach(pl => {
        if ((point.x == pl.x)&&(point.y == pl.y)&&(point.z == pl.z)) {
          exists = true;
        }
      });
      if (exists == false) pointList.push(point);
    });
  });

  console.log(`EX 19-1: The total number of beacons found is ${pointList.length}.`);
};

const ex2 = (file) => {
  const rawProbes = readFile(file);
  let probes = rawProbes.map((lines) => ({
    points: lines
      .split(/\r\n/)
      .slice(1)
      .map((line) => ({
        x: Number(line.split(",")[0]),
        y: Number(line.split(",")[1]),
        z: Number(line.split(",")[2]),
      })),
  }));
  probes.forEach((probe) => (probe.distances = calcDistances(probe.points)));

  let linked = [];
  for (let i = 0; i < probes.length; i++) {
    for (let j = i + 1; j < probes.length; j++) {
      const tempCount = compareDistancesQuick(probes[i].distances, probes[j].distances);
      if (tempCount >= 12) {
        linked.push([i, j]);
      }
    }
  }

  linked = [...linked, ...linked.map(link => [link[1],link[0]])];

  let solved = [0];
  probes[0].rotation = 0;
  probes[0].coords = {x: 0, y: 0, z: 0};

  while (solved.length < probes.length) {
    linked.forEach(link => {
      let rot;
      if ((solved.includes(link[0]))&&!(solved.includes(link[1]))) {
        rot = findRotation(probes[link[0]].points, probes[link[1]].points);
        probes[link[1]].rotation = rot;
        probes[link[1]].points = rotatePoints(probes[link[1]].points, rot);
        probes[link[1]].distances = calcDistances(probes[link[1]].points);
        const relativePosition = findRelativePosition(probes[link[0]].points, probes[link[1]].points);
        probes[link[1]].coords = {x: relativePosition.x + probes[link[0]].coords.x,y: relativePosition.y + probes[link[0]].coords.y, z: relativePosition.z + probes[link[0]].coords.z };
        solved.push(link[1]);
      };
    });
  }

  let maxDistance = -Infinity;
  let furthestI = -1;
  let furthestJ = -1;

  for (let i = 0; i < probes.length; i++) {
    for (let j = i+1; j < probes.length; j++) {
      const distance = manhattanDistance(probes[i].coords, probes[j].coords);
      if (distance > maxDistance) {
        furthestI = i;
        furthestJ = j;
        maxDistance = distance;
      }
    }
  }

  console.log(`EX 19-2: Probes ${furthestI} and ${furthestJ} are the furthest apart at a manhatten distance of ${maxDistance}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(
  `Exercise 19-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`
);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(
  `Exercise 19-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`
);