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
function generateMixMatrix() {
  const base = [0x02, 0x01, 0x01, 0x03];
  const matrix = [];
  for (let i = 0; i < 4; i++) {
    const rotated = base.slice(-i).concat(base.slice(0, -i));
    matrix.push(rotated);
  }
  // Transpose to get correct layout
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function mixColumns(state,matrix = generateMixMatrix()) {
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
export { generateMixMatrix };
