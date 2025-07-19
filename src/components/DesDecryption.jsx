import { asciiToBinaryMatrix } from '../shared/des/asciiToBinaryMatrix';
import { initialPermutation } from '../shared/des/initialPermutation';
import { finalPermutation } from '../shared/des/finalPermutation';
import { expandR0, xor48, applySBoxes, pboxPermute } from '../shared/des/round1';
import { generateReversedBinaryRoundKeys } from '../shared/des/keyScheduleHelper';

export function DesDecryption(ciphertext, key) {
  const inputMatrix = asciiToBinaryMatrix(ciphertext);
  const keyMatrix = asciiToBinaryMatrix(key);

  const inputBits = inputMatrix.flat().join('');
  const keyBits = keyMatrix.flat().join('');

  const permutedBits = initialPermutation(inputBits);
  let L = permutedBits.slice(0, 32);
  let R = permutedBits.slice(32, 64);

  const roundKeys = generateReversedBinaryRoundKeys(keyBits);

  const rounds = [];

  for (let i = 0; i < 16; i++) {
    const expandedR = expandR0(R);
    const xor = xor48(expandedR, roundKeys[i]);
    const sbox = applySBoxes(xor);
    const pbox = pboxPermute(sbox);

    const newL = R;
    const newR = xor48(L, pbox);

    rounds.push({ round: i + 1, L, R, K: roundKeys[i], expandedR, xor, sbox, pbox, newL, newR });

    L = newL;
    R = newR;
  }

  const preOutputBits = R + L;
  const cipherBits = finalPermutation(preOutputBits);

  return {
    inputMatrix,
    keyMatrix,
    inputBits,
    keyBits,
    permutedBits,
    L0: permutedBits.slice(0, 32),
    R0: permutedBits.slice(32),
    roundKeys,
    rounds,
    L16: L,
    R16: R,
    preOutputBits,
    cipherBits,
    asciiOutput: cipherBits.match(/.{8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('')
  };
}
