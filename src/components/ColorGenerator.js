import React, { useState, useCallback } from 'react';
import ColorMatrix from './ColorMatrix';
import { generateColorMatrix, COLORS } from '../utils/colorGeneratorUtils';
import '../css/ColorGenerator.css';

const ColorGenerator = () => {
  const [xValue, setXValue] = useState(10);
  const [yValue, setYValue] = useState(10);
  const [zValue, setZValue] = useState(20);
  const [matrix, setMatrix] = useState(null);

  const handleGenerate = useCallback(() => {
    const x = parseFloat(xValue);
    const y = parseFloat(yValue);
    const z = parseFloat(zValue);
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      alert("Please enter valid numbers for X, Y, and Z percentages.");
      return;
    }
    const newMatrix = generateColorMatrix(x, y, z);
    setMatrix(newMatrix);
  }, [xValue, yValue, zValue]);

  return (
    <div className="color-generator-section">
      <h2>随机颜色矩阵生成器</h2>
      <p>本程序生成一个 10x10 的随机颜色矩阵，颜色选择基于概率规则。</p>
      <div className="controls color-generator-controls">
        <div className="color-legend">
          <span>颜色:</span>
          {COLORS.map(color => (
            <div key={color} className="color-swatch" style={{ backgroundColor: color }}></div>
          ))}
        </div>
        <div className="input-group">
          <label htmlFor="xValue">X值 (%):</label>
          <input
            type="number"
            id="xValue"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        <div className="input-group">
          <label htmlFor="yValue">Y值 (%):</label>
          <input
            type="number"
            id="yValue"
            value={yValue}
            onChange={(e) => setYValue(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        <div className="input-group">
          <label htmlFor="zValue">Z值 (%):</label>
          <input
            type="number"
            id="zValue"
            value={zValue}
            onChange={(e) => setZValue(e.target.value)}
            placeholder="e.g., 20"
          />
        </div>
        <button onClick={handleGenerate} className="generate-button">
          生成矩阵
        </button>
      </div>
      <ColorMatrix matrix={matrix} />
    </div>
  );
};

export default ColorGenerator; 