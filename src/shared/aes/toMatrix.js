
export function toMatrix(hexArray) {
  if (hexArray.length < 16) {
    const padding = Array(16 - hexArray.length).fill('0b');
    hexArray = hexArray.concat(padding);
  }

  const matrix = [[], [], [], []];

  for (let i = 0; i < 16; i++) {
    matrix[i % 4].push(hexArray[i]);
  }

  return matrix;
}
