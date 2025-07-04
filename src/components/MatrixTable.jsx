import React from 'react';
import PropTypes from 'prop-types';

const MatrixTable = ({
  matrix,
  highlightMap = {},
  tooltipMap = {},
  hoveredCell = null,
  onCellHover = () => {}
}) => (
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
                  cursor: tooltipMap[key] ? 'help' : 'default',
                  overflow: 'visible',
                }}
                onMouseEnter={() => onCellHover(key)}
                onMouseLeave={() => onCellHover(null)}
              >
                {cell.toUpperCase()}

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

MatrixTable.propTypes = {
  matrix: PropTypes.array.isRequired,
  highlightMap: PropTypes.object,
  tooltipMap: PropTypes.object,
  hoveredCell: PropTypes.string,
  onCellHover: PropTypes.func,
};
export default MatrixTable;