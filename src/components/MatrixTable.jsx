import React from 'react';
import PropTypes from 'prop-types';

const MatrixTable = ({
  matrix,
  highlightMap = {},
  tooltipMap = {},
  hoveredCell = null,
  onCellHover = () => {}
}) => {

  const formatCell = (cell) => {
    if (cell === undefined || cell === null) return '';
    return String(cell).toUpperCase();
  };

  const getBackgroundColor = (i, j) => {
    const key = `${i}-${j}`;
    if (highlightMap[key] === 'result') return '#c1f0c1';
    if (highlightMap[key] === 'source') return '#ffeeba';
    if (highlightMap[key] === 'dropped') return '#ffcccc';
    if (highlightMap[key] === 'parity') return '#ffcccc';

    // Highlight last bit of each row as parity (DES key only)
    const isParityBit = j === 7;
    if (isParityBit && highlightMap.__parity__) return '#ffcccc';

    return 'white';
  };

  return (
    <table border="1" cellPadding="10">
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => {
              const key = `${i}-${j}`;
              const bg = getBackgroundColor(i, j);

              return (
                <td
                  key={j}
                  style={{
                    backgroundColor: bg,
                    transition: 'background 0.3s ease',
                    position: 'relative',
                    fontFamily: 'monospace',
                    padding: '10px',
                    cursor: tooltipMap[key] ? 'help' : 'default',
                    overflow: 'visible',
                  }}
                  onMouseEnter={() => onCellHover(key)}
                  onMouseLeave={() => onCellHover(null)}
                >
                  {formatCell(cell)}

                  {hoveredCell === key && tooltipMap[key] && (
                    <div className="tooltip-box">
                      {tooltipMap[key]}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MatrixTable.propTypes = {
  matrix: PropTypes.array.isRequired,
  highlightMap: PropTypes.object,
  tooltipMap: PropTypes.object,
  hoveredCell: PropTypes.string,
  onCellHover: PropTypes.func,
};
export default MatrixTable;