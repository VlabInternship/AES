// src/shared/des/round1.js
import { SBOXES } from './sboxUtils';
// /client/src/shared/des/expandR0.js
export function expandR0(r0Bits) {
  const expansionTable = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10,11,12,13,
    12,13,14,15,16,17,
    16,17,18,19,20,21,
    20,21,22,23,24,25,
    24,25,26,27,28,29,
    28,29,30,31,32,1
  ];
  return expansionTable.map(pos => r0Bits[pos - 1]).join('');
}
// /client/src/shared/des/xor48.js
export function xor48(a, b) {
  return a.split('').map((bit, i) => bit ^ b[i]).join('');
}
// /client/src/shared/des/sboxes.js
export function applySBoxes(bits48) {
  let result = '';
  for (let i = 0; i < 8; i++) {
    const chunk = bits48.slice(i * 6, i * 6 + 6);
    const row = parseInt(chunk[0] + chunk[5], 2);
    const col = parseInt(chunk.slice(1, 5), 2);
    const sboxVal = SBOXES[i][row][col].toString(2).padStart(4, '0');
    result += sboxVal;
  }
  return result;
}
// /client/src/shared/des/pbox.js
export function pboxPermute(bits32) {
  const pBox = [
    16,7,20,21,
    29,12,28,17,
    1,15,23,26,
    5,18,31,10,
    2,8,24,14,
    32,27,3,9,
    19,13,30,6,
    22,11,4,25
  ];
  return pBox.map(pos => bits32[pos - 1]).join('');
}
