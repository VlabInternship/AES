// src/shared/des/keyScheduleHelper.js

const PC1 = [
  57,49,41,33,25,17,9, 1,58,50,42,34,26,18,
  10,2,59,51,43,35,27,19,11,3,60,52,44,36,
  63,55,47,39,31,23,15,7,62,54,46,38,30,22,
  14,6,61,53,45,37,29,21,13,5,28,20,12,4
];

const PC2 = [
  14,17,11,24,1,5,3,28,15,6,21,10,
  23,19,12,4,26,8,16,7,27,20,13,2,
  41,52,31,37,47,55,30,40,51,45,33,48,
  44,49,39,56,34,53,46,42,50,36,29,32
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

function leftShift(bits, n) {
  return bits.slice(n) + bits.slice(0, n);
}

export function generateRoundKeys(hexKey = []) {
  const binKey = hexKey.map(h => parseInt(h, 16).toString(2).padStart(8, '0')).join('');
  const key56 = PC1.map(i => binKey[i - 1]).join('');

  let C = key56.slice(0, 28);
  let D = key56.slice(28);
  const roundKeys = [];

  for (let i = 0; i < 16; i++) {
    C = leftShift(C, SHIFTS[i]);
    D = leftShift(D, SHIFTS[i]);
    const combined = C + D;
    const roundKey = PC2.map(i => combined[i - 1]).join('');
    roundKeys.push(roundKey);
  }

  return roundKeys; // 16 x 48-bit binary strings
}

export function generateBinaryRoundKeys(keyBits) {
  const hexBytes = [];
  for (let i = 0; i < 64; i += 8) {
    const byte = keyBits.slice(i, i + 8);
    hexBytes.push(parseInt(byte, 2).toString(16).padStart(2, '0'));
  }
  return generateRoundKeys(hexBytes);
}

export function generateReversedBinaryRoundKeys(keyBits) {
  return generateBinaryRoundKeys(keyBits).reverse();
}

export function prepareKeyScheduleMatrix(keyBits) {
  const roundKeyBits = generateBinaryRoundKeys(keyBits);
  return roundKeyBits.map(to6x8Matrix);
}

export function prepareKeyScheduleMatrixReversed(keyBits) {
  const roundKeyBits = generateBinaryRoundKeys(keyBits).reverse();
  return roundKeyBits.map(to6x8Matrix);
}

function to6x8Matrix(bitStr48) {
  return Array.from({ length: 6 }, (_, i) => bitStr48.slice(i * 8, i * 8 + 8).split(''));
}

export function getCDHalvesPerRound(keyBits) {
  const binKey = keyBits;
  const key56 = PC1.map(i => binKey[i - 1]).join('');

  let C = key56.slice(0, 28);
  let D = key56.slice(28);
  const rounds = [];

  for (let i = 0; i < 16; i++) {
    C = C.slice(SHIFTS[i]) + C.slice(0, SHIFTS[i]);
    D = D.slice(SHIFTS[i]) + D.slice(0, SHIFTS[i]);
    rounds.push({ C, D });
  }

  return rounds;
}

export function applyPC1WithTrace(keyBits) {
  const traceMap = {};
  const permutedBits = [];
  const droppedBits = [];

  const bitArray = keyBits.split('');

  for (let i = 0; i < 64; i++) {
    if (!PC1.includes(i + 1)) droppedBits.push(i);
  }

  PC1.forEach((fromPos, toIndex) => {
    const bit = bitArray[fromPos - 1];
    permutedBits[toIndex] = bit;
    traceMap[fromPos - 1] = toIndex;
  });

  return {
    permuted56Bit: permutedBits.join(''),
    traceMap,
    droppedParityBitIndices: droppedBits
  };
}

export function getBeforePC1PerRound(keyBits) {
  const binKey = keyBits;
  const key56 = PC1.map(i => binKey[i - 1]).join('');

  let C = key56.slice(0, 28);
  let D = key56.slice(28);
  const beforePC1States = [];

  for (let i = 0; i < 16; i++) {
    C = C.slice(SHIFTS[i]) + C.slice(0, SHIFTS[i]);
    D = D.slice(SHIFTS[i]) + D.slice(0, SHIFTS[i]);
    const combined56 = C + D;

    let reconstructed64 = '';
    let combinedIndex = 0;

    for (let j = 0; j < 64; j++) {
      if (PC1.includes(j + 1)) {
        reconstructed64 += combined56[combinedIndex];
        combinedIndex++;
      } else {
        const startPos = Math.floor(j / 8) * 8;
        const endPos = j;
        const dataBits = reconstructed64.slice(startPos, endPos);
        const parity = dataBits.split('').filter(bit => bit === '1').length % 2;
        reconstructed64 += parity.toString();
      }
    }

    beforePC1States.push(reconstructed64);
  }

  return beforePC1States;
}

export function applyPC2WithTrace(cdBits) {
  const traceMap = {};
  const permutedBits = [];
  const droppedBits = [];

  const bitArray = cdBits.split('');

  for (let i = 0; i < 56; i++) {
    if (!PC2.includes(i + 1)) droppedBits.push(i);
  }

  PC2.forEach((fromPos, toIndex) => {
    const bit = bitArray[fromPos - 1];
    permutedBits[toIndex] = bit;
    traceMap[fromPos - 1] = toIndex;
  });

  return {
    permuted48Bit: permutedBits.join(''),
    traceMap,
    droppedBitIndices: droppedBits
  };
}
