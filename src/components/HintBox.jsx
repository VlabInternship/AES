// src/components/HintBox.jsx
const HintBox = ({ step }) => {
  const hints = {
    0: "Here we take plaintext/key, pad them, and convert into 4x4 state matrices.",
    1: "The key schedule generates 10 additional round keys using substitution and XOR.",
    2: "This step mixes the key into the input state using XOR — it's called AddRoundKey.",
    3: "Now we substitute every byte using the AES S-Box. This adds confusion to the cipher.",
    4: "Each row of the state matrix is cyclically shifted left. This spreads byte influence across columns.",
    5: "This step mixes the columns of the state matrix to further diffuse the data.",

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
