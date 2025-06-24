// src/components/MatrixTable.jsx
import React from 'react';
import PropTypes from 'prop-types';

const MatrixTable = ({ matrix, highlightMap = {}, tooltipMap = {}, onCellHover = () => {} }) => (
  <table border="1" cellPadding="10">
    <tbody>
      {matrix.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => {
            const key = `${i}-${j}`;
            const bg =
              highlightMap[key] === 'result'
                ? '#c1f0c1'
                : highlightMap[key] === 'source'
                ? '#ffeeba'
                : 'white';

            return (
              <td
                key={j}
                style={{
                  backgroundColor: bg,
                  transition: 'background 0.3s ease',
                  position: 'relative',
                  fontFamily: 'monospace',
                  padding: '10px',
                  cursor: tooltipMap[key] ? 'help' : 'default'
                }}
                onMouseEnter={() => onCellHover(key)}
                onMouseLeave={() => onCellHover(null)}
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
  onCellHover: PropTypes.func,
};

export default MatrixTable;
