// desEncrypt.js    
import { asciiToBinaryMatrix } from '../shared/des/asciiToBinaryMatrix';
import { initialPermutation } from '../shared/des/initialPermutation';
import { expandR0, xor48, applySBoxes, pboxPermute } from '../shared/des/round1';
import { generateBinaryRoundKeys } from '../shared/des/keyScheduleHelper';
import { finalPermutation } from '../shared/des/finalPermutation';

export function DesEncryption(plainText, keyText) {
  // Pad to 8 characters (64 bits)
  const paddedInput = plainText.padEnd(8, '\x00');
  const paddedKey = keyText.padEnd(8, '\x00');

  const inputMatrix = asciiToBinaryMatrix(paddedInput);
  const keyMatrix = asciiToBinaryMatrix(paddedKey);

  const inputBits = inputMatrix.flat().join('');
  const keyBits = keyMatrix.flat().join('');

  if (inputBits.length !== 64 || keyBits.length !== 64) {
    throw new Error('Plaintext and key must be exactly 64 bits (8 ASCII characters).');
  }

  const permutedBits = initialPermutation(inputBits);
  const roundKeys = generateBinaryRoundKeys(keyBits);

  const L0 = permutedBits.slice(0, 32);
  const R0 = permutedBits.slice(32);
  const K1 = roundKeys[0];
  const expandedR0 = expandR0(R0);
  const xorR0K1 = xor48(expandedR0, K1);
  const sboxR0 = applySBoxes(xorR0K1);
  const pboxR0 = pboxPermute(sboxR0);
  const R1 = L0.split('').map((b, i) => b ^ pboxR0[i]).join('');
  const L1 = R0;

  // === Rounds 2–16 ===
  let L = L1;
  let R = R1;
  for (let i = 1; i < 16; i++) {
    const K = roundKeys[i];
    const expandedR = expandR0(R);
    const xored = xor48(expandedR, K);
    const sboxOut = applySBoxes(xored);
    const pboxOut = pboxPermute(sboxOut);
    const newR = L.split('').map((b, j) => b ^ pboxOut[j]).join('');
    const newL = R;
    L = newL;
    R = newR;
  }

  const L16 = L;
  const R16 = R;
  const preOutputBits = R16 + L16;
  const cipherBits = finalPermutation(preOutputBits);

  // Convert to ASCII
  const asciiChars = [];
  for (let i = 0; i < 64; i += 8) {
    asciiChars.push(String.fromCharCode(parseInt(cipherBits.slice(i, i + 8), 2)));
  }

  const asciiOutput = asciiChars.join('');

  return {
    paddedInput,
    paddedKey,
    inputMatrix,
    keyMatrix,
    inputBits,
    keyBits,
    permutedBits,
    roundKeys,
    L0,
    R0,
    K1,
    expandedR0,
    xorR0K1,
    sboxR0,
    pboxR0,
    R1,
    L1,
    L16,
    R16,
    preOutputBits,
    cipherBits,
    asciiOutput,
  };
}
