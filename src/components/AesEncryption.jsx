import { toMatrix } from '../shared/aes/toMatrix';
import { expandKey } from '../shared/aes/keyExpansion';
import { addRoundKey } from '../shared/aes/addRoundKey';
import { subBytes } from '../shared/aes/subBytes';
import { shiftRows } from '../shared/aes/shiftRows';
import { mixColumns } from '../shared/aes/mixColumns';

/**
 * AES-128 ECB Encryption without any padding
 * @param {string} inputHex - Array of 16 hex bytes (32 chars total)
 * @param {string} keyHex - Array of 16 hex bytes (32 chars total)
 */
export function AesEncryption(inputHex, keyHex) {
  const inputMatrix = toMatrix(inputHex);
  const keyMatrix = toMatrix(keyHex);
  const { roundKeys } = expandKey(keyHex);

  let state = addRoundKey(inputMatrix, roundKeys[0]);

  for (let round = 1; round <= 9; round++) {
    state = subBytes(state);
    state = shiftRows(state);
    state = mixColumns(state);
    state = addRoundKey(state, roundKeys[round]);
  }

  state = subBytes(state);
  state = shiftRows(state);
  state = addRoundKey(state, roundKeys[10]);



  return {
    inputMatrix: inputMatrix,
    keyMatrix: keyMatrix,
    cipherMatrix: state,
  };
}