// src/components/HintBox.jsx
const HintBox = ({ step }) => {
  const hints = {
    0: "For easier understanding.",
    1: "Here we take plaintext/key, pad them, and convert into 4x4 state matrices.",
    2: "The key schedule generates 10 additional round keys using substitution and XOR.",
    3: "This step mixes the key into the input state using XOR — it's called AddRoundKey.",
    4: "Now we substitute every byte using the AES S-Box. This adds confusion to the cipher.",
    5: "Each row of the state matrix is cyclically shifted left. This spreads byte influence across columns.",
    6: "This step mixes the columns of the state matrix to further diffuse the data.",
    7: "We repeat the substitution, shifting, and mixing for 9 rounds to increase security.",
    8: "In the final round, we skip the MixColumns step but still substitute and shift rows.",
    9: "After 10 rounds, we perform the final AddRoundKey to complete the encryption.",
    10: "The final state matrix is flattened into a single hex string for output.",
    11: "After 10 AES rounds, this is your final encrypted output as a matrix and ASCII string.",


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
