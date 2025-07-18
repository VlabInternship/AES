// invShiftRows.js

function rightRotate(array, times) {
  const len = array.length;
  return array.slice(len - times).concat(array.slice(0, len - times));
}

export function invShiftRows(state) {
  if (!state || state.length !== 4 || state.some(row => row.length !== 4)) {
    return state; // return as-is if invalid input
  }

  const rows = [[], [], [], []];
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      rows[row][col] = state[row][col];
    }
  }

  for (let i = 1; i < 4; i++) {
    rows[i] = rightRotate(rows[i], i);
  }

  const newState = [[], [], [], []];
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      newState[row][col] = rows[row][col];
    }
  }

  return newState;
}
