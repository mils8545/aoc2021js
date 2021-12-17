const { performance } = require('perf_hooks');

const readFile = (readFile) => {
  const fs = require('fs');
  const data = fs.readFileSync(readFile, {encoding:'utf8', flag:'r'});
  let lines = data.split(/\r?\n/);
  return lines;
}

const hexToBinaryString = ( str ) => {
  const hexDict = {'0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001', 'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
  'E': '1110', 'F': '1111'};
  let retStr = "";
  str.split("").forEach(char => retStr += hexDict[char]);
  return retStr;
}

const binaryArrayToNumber = ( arr ) => {
  return arr.reduce((prev, bit, i) => prev + (bit * Math.pow(2, arr.length - i - 1)), 0)
}

const bitPullArr = (bitStream, num) => {
  let bitArray = [];
  for (let i = 0; i < num; i++) {
    bitArray.push(bitStream.shift());
  }
  return (bitArray);
}

const bitPullInt = (bitStream, num) => {
  return (binaryArrayToNumber(bitPullArr(bitStream, num)));
}

const parsePacket = (bitStream) => {
  let packet = {v: bitPullInt(bitStream, 3), t: bitPullInt(bitStream, 3)};
  if (packet.t == 4) {
    let literalArray = [];
    let done = false;
    while (!done) {
      done = (bitPullInt(bitStream, 1) == 0);
      literalArray = [...literalArray, ...(bitPullArr(bitStream, 4))];
    }
    packet.literal = binaryArrayToNumber(literalArray);
  } else {
    packet.packets = [];
    if ((packet.I = bitPullInt(bitStream, 1)) == 1) {
      const packetCount = bitPullInt(bitStream, 11);
      for (let i = 0; i < packetCount; i++) {
        packet.packets.push(parsePacket(bitStream));
      }
    } else {
      const bitCount = bitPullInt(bitStream, 15);
      const targetCount = bitStream.length - bitCount;
      while (bitStream.length > targetCount) {
        packet.packets.push(parsePacket(bitStream));
      }
    }
  }
  return packet;
}

const vTotal = (packet) => {
  if (packet.t == 4) return packet.v;
  return packet.packets.reduce((prev, p) => prev + vTotal(p),packet.v);
}

const evalPacket = (packet) => {
  switch (packet.t) {
    // Packets with type ID 0 are sum packets
    case 0:
      return packet.packets.reduce((prev, curr) => prev + evalPacket(curr),0);
    // Packets with type ID 1 are product packets
    case 1:
      return packet.packets.reduce((prev, curr) => prev * evalPacket(curr),1);
    // Packets with type ID 2 are minimum packets
    case 2:
      return packet.packets.reduce((prev, curr) => Math.min(prev, evalPacket(curr)),Infinity);
    // Packets with type ID 3 are maximum packets
    case 3:
      return packet.packets.reduce((prev, curr) => Math.max(prev, evalPacket(curr)),-Infinity);
    // Packets with type ID 4 are literal packets
    case 4:
      return packet.literal;
    // Packets with type ID 5 are greater than packets
    case 5:
      return ((evalPacket(packet.packets[0]) > evalPacket(packet.packets[1])) ? 1 : 0);
    // Packets with type ID 6 are less than packets
    case 6:
      return ((evalPacket(packet.packets[0]) < evalPacket(packet.packets[1])) ? 1 : 0);
    // Packets with type ID 7 are equal to packets
    case 7:
      return ((evalPacket(packet.packets[0]) == evalPacket(packet.packets[1])) ? 1 : 0);
    }
}


const ex1 = (file) => {
  const lines = readFile(file);
  let bitStream = hexToBinaryString(lines[0]).split("").map(bit => Number(bit));

  let packets = [];
  while (bitStream.length > 0) {
    packets.push(parsePacket(bitStream));
    while ((bitStream.length % 8) != 0) {
      bitPullArr(bitStream, 1);
    }
  }

  const total = packets.reduce((prev, p) => prev + vTotal(p), 0)
  console.log(`EX 16-1: The total of all of the version numbers in all of the packets is ${total}.`);
}

const ex2 = (file) => {
  const lines = readFile(file);
  let bitStream = hexToBinaryString(lines[0]).split("").map(bit => Number(bit));

  let packets = [];
  while (bitStream.length > 0) {
    packets.push(parsePacket(bitStream));
    while ((bitStream.length % 8) != 0) {
      bitPullArr(bitStream, 1);
    }
  }

  const value = packets.reduce((prev, p) => prev + evalPacket(p), 0);
  console.log(`EX 16-2: The value of the outermost packet is ${value}.`);
}

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(4)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(4)} milliseconds`);