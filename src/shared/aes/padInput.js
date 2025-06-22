//padInput.js

export function padInput(hexArray) {
  if (hexArray.length > 16) {
    throw new Error("Input too long for single AES block (max 16 bytes)");
  }

  const padded = [...hexArray];
  while (padded.length < 16) {
    padded.push('0b'); // You can change this to PKCS-style later
  }

  return padded;
}
