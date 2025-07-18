// invMixColumns.js

// Helper for GF(2^8) multiplication
function gmul(a, b) {
  let p = 0;
  for (let counter = 0; counter < 8; counter++) {
    if ((b & 1) !== 0) p ^= a;
    let hiBitSet = a & 0x80;
    a = (a << 1) & 0xFF;
    if (hiBitSet) a ^= 0x1b;
    b >>= 1;
  }
  return p;
}

// Inverse MixColumns matrix for AES decryption
function generateInvMixMatrix() {
  return [
    [0x0e, 0x0b, 0x0d, 0x09],
    [0x09, 0x0e, 0x0b, 0x0d],
    [0x0d, 0x09, 0x0e, 0x0b],
    [0x0b, 0x0d, 0x09, 0x0e],
  ];
}

// Applies the inverse MixColumns transformation to the state matrix
export function invMixColumns(state, matrix = generateInvMixMatrix()) {
  const newState = [[], [], [], []];

  for (let col = 0; col < 4; col++) {
    const a = [
      parseInt(state[0][col], 16),
      parseInt(state[1][col], 16),
      parseInt(state[2][col], 16),
      parseInt(state[3][col], 16),
    ];

    for (let row = 0; row < 4; row++) {
      let value = 0;
      for (let k = 0; k < 4; k++) {
        value ^= gmul(matrix[row][k], a[k]);
      }
      newState[row][col] = value.toString(16).padStart(2, '0');
    }
  }

  return newState;
}

export { generateInvMixMatrix };
