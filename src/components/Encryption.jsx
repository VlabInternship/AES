// src/components/Encryption.jsx
import { asciiToHex } from '../shared/aes/asciiToHex';
import { padInput } from '../shared/aes/padInput';
import { toMatrix } from '../shared/aes/toMatrix';
import { expandKey } from '../shared/aes/keyExpansion';
import { addRoundKey } from '../shared/aes/addRoundKey';
import { subBytes } from '../shared/aes/subBytes';
import { shiftRows } from '../shared/aes/shiftRows';
import { mixColumns } from '../shared/aes/mixColumns';

// src/components/Encryption.jsx
export function encrypt(inputHex, keyHex, isPadded = false) {
  const paddedInput = isPadded ? inputHex : padInput(asciiToHex(inputHex));
  const paddedKey = isPadded ? keyHex : padInput(asciiToHex(keyHex));

  const paddedInputMatrix = toMatrix(paddedInput).map(row => [...row]);
  const paddedKeyMatrix = toMatrix(paddedKey);
  const { roundKeys } = expandKey(paddedKey);

  let state = addRoundKey(toMatrix(paddedInput), roundKeys[0]);

  for (let round = 1; round <= 9; round++) {
    state = subBytes(state);
    state = shiftRows(state);
    state = mixColumns(state);
    state = addRoundKey(state, roundKeys[round]);
  }

  state = subBytes(state);
  state = shiftRows(state);
  state = addRoundKey(state, roundKeys[10]);

  const ascii = state.flat().map(b => {
    const code = parseInt(b, 16);
    return code >= 32 && code <= 126 ? String.fromCharCode(code) : '.';
  }).join('');

  return {
    paddedInputMatrix,
    paddedKeyMatrix,
    cipherMatrix: state,
    ascii
  };
}
