//shiftRows.js

function leftRotate(row, times) {
  return row.slice(times).concat(row.slice(0, times));
}

export function shiftRows(state) {
  const newState = state.map((row, index) => {
    if (index === 0) return row;
    return leftRotate(row, index);
  });

  return newState;
}