import React from 'react';
import PropTypes from 'prop-types';

const MatrixTable = ({ matrix, highlightMap = {}, tooltipMap = {} }) => (
  <table border="1" cellPadding="10">
    <tbody>
      {matrix.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => {
            const key = `${i}-${j}`;
            let bg = 'white';
            if (highlightMap[key] === 'result') bg = '#c1f0c1'; // light green
            else if (highlightMap[key] === 'source') bg = '#ffeeba'; // light yellow

            const tooltip = tooltipMap[key];

            return (
              <td
                key={j}
                style={{
                  backgroundColor: bg,
                  transition: 'background 0.3s ease',
                  position: 'relative',
                  fontFamily: 'monospace',
                  padding: '10px',
                }}
                title={tooltip}
              >
                {cell.toUpperCase()}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

MatrixTable.propTypes = {
  matrix: PropTypes.array.isRequired,
  highlightMap: PropTypes.object,
  tooltipMap: PropTypes.object,
};

export default MatrixTable;
