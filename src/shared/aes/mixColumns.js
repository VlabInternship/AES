//mixColumns.js

// Helper for GF(2^8) multiplication
function gmul(a, b) {
  let p = 0;
  for (let counter = 0; counter < 8; counter++) {
    if ((b & 1) !== 0) p ^= a;
    let hiBitSet = (a & 0x80);
    a = (a << 1) & 0xFF;
    if (hiBitSet) a ^= 0x1b;
    b >>= 1;
  }
  return p;
}

export function mixColumns(state) {
  const newState = [[], [], [], []];

  for (let col = 0; col < 4; col++) {
    const a0 = parseInt(state[0][col], 16);
    const a1 = parseInt(state[1][col], 16);
    const a2 = parseInt(state[2][col], 16);
    const a3 = parseInt(state[3][col], 16);

    newState[0][col] = (gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3).toString(16).padStart(2, '0');
    newState[1][col] = (a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3).toString(16).padStart(2, '0');
    newState[2][col] = (a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3)).toString(16).padStart(2, '0');
    newState[3][col] = (gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2)).toString(16).padStart(2, '0');
  }

  return newState;
}
