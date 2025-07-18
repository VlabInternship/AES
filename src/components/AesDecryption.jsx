import { addRoundKey } from '../shared/aes/addRoundKey';
import { invShiftRows } from '../shared/aes/invShiftRows';
import { invSubBytes } from '../shared/aes/invSubBytes';
import { invMixColumns } from '../shared/aes/invMixColumns';

export function compute9to2(step7Output, roundKey1, roundKeys) {
  if (
    !step7Output || step7Output.length !== 4 ||
    !roundKey1 || roundKey1.length !== 4 ||
    !roundKeys || roundKeys.length < 10
  ) {
    return [];
  }

  let state = step7Output;
  for (let r = 8; r >= 2; r--) {
    if (!roundKeys[r] || roundKeys[r].length !== 4) return [];

    state = addRoundKey(state, roundKeys[r]);
    state = invShiftRows(state);
    state = invSubBytes(state);
    state = invMixColumns(state);
  }

  // Apply AddRoundKey(K1) only (Round 1 starts here)
  return addRoundKey(state, roundKey1);
}


