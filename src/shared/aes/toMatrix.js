export function toMatrix(hexArray) {
  if (!Array.isArray(hexArray) || hexArray.length !== 16) {
    throw new Error("toMatrix() requires an array of exactly 16 hex values.");
  }

  const matrix = [[], [], [], []];
  for (let i = 0; i < 16; i++) {
    matrix[i % 4].push(hexArray[i]); // column-major
  }

  return matrix;
}
export function matrixToHexColumnWise(matrix) {
  const result = [];
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      result.push(matrix[row][col]);
    }
  }
  return result;
}