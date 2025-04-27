import React from 'react';

const ColorMatrix = ({ matrix }) => {
  if (!matrix || matrix.length === 0) {
    return <div>Click "Generate Matrix" to start.</div>;
  }

  return (
    <div className="matrix-container">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="matrix-row">
          {row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="matrix-cell"
              style={{ backgroundColor: color || 'white' }}
              title={`(${rowIndex}, ${colIndex}): ${color}`}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ColorMatrix;
