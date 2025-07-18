// src/shared/des/keyScheduleHelper.js

/**
 * PC-1 (64 → 56 bits)
 */
const PC1 = [
  57,49,41,33,25,17,9, 1,58,50,42,34,26,18,
  10,2,59,51,43,35,27,19,11,3,60,52,44,36,
  63,55,47,39,31,23,15,7,62,54,46,38,30,22,
  14,6,61,53,45,37,29,21,13,5,28,20,12,4
];

/**
 * PC-2 (56 → 48 bits)
 */
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

/**
 * Main DES round key generator
 * @param {string[]} hexKey - array of 8 hex bytes (e.g., ['13','34','57','79','9B','BC','DF','F1'])
 * @returns {string[][]} - array of 16 round keys (each is 6 hex bytes)
 */
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
    const hexKey = [];
    for (let j = 0; j < 48; j += 8) {
      hexKey.push(parseInt(roundKey.slice(j, j + 8), 2).toString(16).padStart(2, '0'));
    }
    roundKeys.push(hexKey);
  }

  return roundKeys;
}

/**
 * Converts a 64-bit binary key into 16 round key matrices (6x8) for DES.
 * @param {string} keyBits - A 64-character binary string
 * @returns {string[][][]} - Array of 6x8 matrices
 */
export function prepareKeyScheduleMatrix(keyBits) {
  const hexBytes = [];
  for (let i = 0; i < 64; i += 8) {
    const byte = keyBits.slice(i, i + 8);
    hexBytes.push(parseInt(byte, 2).toString(16).padStart(2, '0'));
  }

  const roundKeyHex = generateRoundKeys(hexBytes);

  return roundKeyHex.map(round => {
    const binStr = round
      .map(h => parseInt(h, 16).toString(2).padStart(8, '0'))
      .join(''); // 48-bit binary string

    return Array.from({ length: 6 }, (_, i) => binStr.slice(i * 8, i * 8 + 8).split(''));
  });
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
  const traceMap = {};              // fromIndex (0–63) → toIndex (0–55)
  const permutedBits = [];
  const droppedBits = [];

  const bitArray = keyBits.split('');

  for (let i = 0; i < 64; i++) {
    if (!PC1.includes(i + 1)) {
      droppedBits.push(i);         // index of each parity bit dropped
    }
  }

  PC1.forEach((fromPos, toIndex) => {
    const bit = bitArray[fromPos - 1];
    permutedBits[toIndex] = bit;
    traceMap[fromPos - 1] = toIndex;
  });

  return {
    permuted56Bit: permutedBits.join(''),
    traceMap,                      // e.g. { 56: 0, 48: 1, ... }
    droppedParityBitIndices: droppedBits
  };
}

/**
 * Generates the 64-bit key state before PC-1 for each round
 * @param {string} keyBits - Original 64-bit key
 * @returns {string[]} - Array of 16 64-bit strings representing the key state before PC-1 for each round
 */
export function getBeforePC1PerRound(keyBits) {
  const binKey = keyBits;
  const key56 = PC1.map(i => binKey[i - 1]).join('');

  let C = key56.slice(0, 28);
  let D = key56.slice(28);
  const beforePC1States = [];

  for (let i = 0; i < 16; i++) {
    C = C.slice(SHIFTS[i]) + C.slice(0, SHIFTS[i]);
    D = D.slice(SHIFTS[i]) + D.slice(0, SHIFTS[i]);
    
    // Combine C and D to get 56 bits
    const combined56 = C + D;
    
    // Reconstruct 64-bit key by inserting parity bits
    // The parity bits are at positions 8, 16, 24, 32, 40, 48, 56, 64
    let reconstructed64 = '';
    let combinedIndex = 0;
    
    for (let j = 0; j < 64; j++) {
      if (PC1.includes(j + 1)) {
        // This position should have a data bit
        reconstructed64 += combined56[combinedIndex];
        combinedIndex++;
      } else {
        // This position should have a parity bit
        // Calculate parity for the previous 7 bits
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

/**
 * Applies PC-2 permutation with tracing information
 * @param {string} cdBits - 56-bit C+D combination
 * @returns {object} - Object containing permuted bits, trace map, and dropped bit indices
 */
export function applyPC2WithTrace(cdBits) {
  const traceMap = {};              // fromIndex (0–55) → toIndex (0–47)
  const permutedBits = [];
  const droppedBits = [];

  const bitArray = cdBits.split('');

  for (let i = 0; i < 56; i++) {
    if (!PC2.includes(i + 1)) {
      droppedBits.push(i);         // index of each bit dropped by PC-2
    }
  }

  PC2.forEach((fromPos, toIndex) => {
    const bit = bitArray[fromPos - 1];
    permutedBits[toIndex] = bit;
    traceMap[fromPos - 1] = toIndex;
  });

  return {
    permuted48Bit: permutedBits.join(''),
    traceMap,                      // e.g. { 0: 0, 1: 1, ... }
    droppedBitIndices: droppedBits
  };
}


/**
 * Generate 16 round keys as 48-bit binary strings
 * @param {string} keyBits - 64-bit binary string
 * @returns {string[]} - Array of 16 strings, each 48 bits long
 */
export function generateBinaryRoundKeys(keyBits) {
  const hexBytes = [];
  for (let i = 0; i < 64; i += 8) {
    const byte = keyBits.slice(i, i + 8);
    hexBytes.push(parseInt(byte, 2).toString(16).padStart(2, '0'));
  }

  const hexRoundKeys = generateRoundKeys(hexBytes); // returns array of 6-hex-byte arrays

  const binaryRoundKeys = hexRoundKeys.map(hexArr =>
    hexArr
      .map(h => parseInt(h, 16).toString(2).padStart(8, '0'))
      .join('')
  );

  return binaryRoundKeys; // array of 48-bit binary strings
}
