// src/components/HintBox.jsx
const HintBox = ({ step }) => {
  const hints = {
    0: "Understand the overall structure of DES encryption rounds.",
    1: "Convert ASCII plaintext and key to binary matrices. Hover over bits to see L₀/R₀ mapping.",
    2: "Apply Initial Permutation (IP) to rearrange bits, then split into L₀ and R₀ halves. Hover to trace bit movements.",
    3: "Generate 16 unique 48-bit round keys from the original 64-bit key using PC-1 and PC-2 permutations.",
    4: "Apply the Feistel network: expand R₀, XOR with round key, apply S-boxes, and permute.",
    5: "Continue the Feistel network for 16 rounds, with each round using a different round key.",
    6: "After 16 rounds, swap L₁₆ and R₁₆, then apply the inverse of Initial Permutation (IP⁻¹).",
    7: "The final result is the encrypted ciphertext in binary format.",
    8: "Convert the binary ciphertext back to ASCII characters for the final output.",
    9: "Display the complete encryption process summary and results.",


  };

  return (
    <div style={{
      background: '#f3f7fc',
      borderLeft: '4px solid var(--primary)',
      padding: '1rem',
      marginTop: '1rem',
      marginBottom: '1rem',
      borderRadius: '6px',
      fontStyle: 'italic'
    }}>
      💡 <strong>Hint:</strong> {hints[step] || "More steps coming soon..."}
    </div>
  );
};

export default HintBox;
