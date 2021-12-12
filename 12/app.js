const { performance } = require('perf_hooks');

let paths = [];

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const parseLines = (lines) => {
  let nodeList = lines.map(line => line.slice(0,line.indexOf('-'))).concat(lines.map(line => line.slice(line.indexOf('-')+1))).sort();
  nodeList = nodeList.filter((node, i) => node != nodeList[i-1]); 
  let nodes = {};
  nodeList.forEach(node => nodes[node] = []);
  for (let i = 0; i < lines.length; i++) {
    nodes[lines[i].slice(0,lines[i].indexOf('-'))].push(lines[i].slice(lines[i].indexOf('-')+1));
    nodes[lines[i].slice(lines[i].indexOf('-')+1)].push(lines[i].slice(0,lines[i].indexOf('-')));
  }
  nodeList.forEach(node => {
    nodes[node] = nodes[node].sort();
  });
  return {nodeList: nodeList, nodes: nodes};

}

const pathFind = (nodes, path, small) => {
  const curNode = path[path.length-1];
  if (curNode == 'end') {
    paths.push(path);
    return;
  }
  nodes[curNode].forEach((pathOption => {
    if (pathOption == pathOption.toUpperCase()) {
      pathFind(nodes, [...path, pathOption], small);
      return;
    } else 
    if (!path.includes(pathOption)) {
      pathFind(nodes, [...path, pathOption], small);
      return;
    }
    if ((!small) && (pathOption != 'start') && (pathOption != 'end')) {
      pathFind(nodes, [...path, pathOption], true);
      return;
    }
  }));
}


const ex1 = (file) => {
  const lines = readFile(file);
  const {nodeList, nodes} = parseLines(lines); 
  paths = [];

  pathFind(nodes, ['start'], true);

  console.log(`EX 11-1: There are ${paths.length} paths through the cave system.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  const {nodeList, nodes} = parseLines(lines); 
  paths = [];

  pathFind(nodes, ['start'], false);

  console.log(`EX 11-2: There are ${paths.length} paths through the cave system.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 12-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 12-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);