import { RCON, SBOX } from './constants';

function rotWord(word) {
  return word.slice(1).concat(word.slice(0, 1));
}

function subWord(word) {
  return word.map(b => SBOX[parseInt(b, 16)].toString(16).padStart(2, '0'));
}

export function expandKey(keyHex) {
  const Nk = 4;  // AES-128 key size (4 words)
  const Nr = 10; // AES-128 rounds
  const Nb = 4;  // Block size (4 words)

  // Convert input key into words (each word = 4 bytes)

  const w = []; // ← Keep this available for return

  for (let i = 0; i < Nk; i++) {
    w[i] = keyHex.slice(i * 4, (i + 1) * 4);
  }

  for (let i = Nk; i < Nb * (Nr + 1); i++) {
    let temp = [...w[i - 1]];
    if (i % Nk === 0) {
      temp = subWord(rotWord(temp));
      temp[0] = (parseInt(temp[0], 16) ^ RCON[i / Nk]).toString(16).padStart(2, '0');
    }
    w[i] = w[i - Nk].map((b, j) =>
      (parseInt(b, 16) ^ parseInt(temp[j], 16)).toString(16).padStart(2, '0')
    );
  }

  const roundKeys = [];
  for (let round = 0; round <= Nr; round++) {
    const matrix = [[], [], [], []];
    for (let col = 0; col < Nb; col++) {
      const word = w[round * Nb + col];
      for (let row = 0; row < 4; row++) {
        matrix[row].push(word[row]);
      }
    }
    roundKeys.push(matrix);
  }

  return { roundKeys, words: w };
}
export { rotWord, subWord };
