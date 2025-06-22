// src/shared/aes/asciiToHex.js
export function asciiToHex(input) {
  return input
    .split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'));
}
