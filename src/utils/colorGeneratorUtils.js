export const COLORS = ['red', 'green', 'blue', 'yellow', 'orange'];
const MATRIX_SIZE = 10;

const selectColorBasedOnProbability = (probabilities) => {
  const rand = Math.random();
  let cumulativeProb = 0;
  for (let i = 0; i < COLORS.length; i++) {
    cumulativeProb += probabilities[i];
    if (rand < cumulativeProb) {
      return COLORS[i];
    }
  }
  // 浮点数不精确时的备选方案
  return COLORS[COLORS.length - 1];
};

export const generateColorMatrix = (xPercent, yPercent, zPercent) => {
  const matrix = Array(MATRIX_SIZE)
    .fill(null)
    .map(() => Array(MATRIX_SIZE).fill(null));

  const baseProb = 1.0 / COLORS.length;
  const maxAdjustment = 1.0 - baseProb;
  const x = Math.min(xPercent / 100.0, maxAdjustment);
  const y = Math.min(yPercent / 100.0, maxAdjustment);
  const z = Math.min(zPercent / 100.0, maxAdjustment);


  for (let m = 0; m < MATRIX_SIZE; m++) {
    for (let n = 0; n < MATRIX_SIZE; n++) {
      if (m === 0 && n === 0) {
        // 随机选择第一个单元格
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        matrix[m][n] = COLORS[randomIndex];
        continue;
      }

      let probabilities = Array(COLORS.length).fill(0);
      const adjustedIndices = new Set();
      let adjustedProbSum = 0;

      const leftColor = n > 0 ? matrix[m][n - 1] : null;
      const topColor = m > 0 ? matrix[m - 1][n] : null;
      const leftIndex = leftColor ? COLORS.indexOf(leftColor) : -1;
      const topIndex = topColor ? COLORS.indexOf(topColor) : -1;

      // Calculate initial probabilities based on neighbors
      if (leftIndex !== -1 && topIndex !== -1) {
        if (leftIndex === topIndex) {
          probabilities[leftIndex] = baseProb + z;
          adjustedProbSum = baseProb + z;
          adjustedIndices.add(leftIndex);
        } else {
          probabilities[leftIndex] = baseProb + x;
          probabilities[topIndex] = baseProb + y;
          adjustedProbSum = probabilities[leftIndex] + probabilities[topIndex];
          adjustedIndices.add(leftIndex);
          adjustedIndices.add(topIndex);
        }
      } else if (leftIndex !== -1) {
        probabilities[leftIndex] = baseProb + x;
        adjustedProbSum = baseProb + x;
        adjustedIndices.add(leftIndex);
      } else if (topIndex !== -1) {
        probabilities[topIndex] = baseProb + y;
        adjustedProbSum = baseProb + y;
        adjustedIndices.add(topIndex);
      } else {
        // 如果(0,0)已处理，理论上不应到达此分支
        adjustedProbSum = 0;
      }

      let remainingProb = 0;
      if (adjustedProbSum > 1.0) {
        const scale = 1.0 / adjustedProbSum;
        for (let i = 0; i < COLORS.length; i++) {
          if (adjustedIndices.has(i)) {
            probabilities[i] *= scale;
          } else {
            probabilities[i] = 0;
          }
        }
        adjustedProbSum = 1.0;
        remainingProb = 0;
      } else {
        remainingProb = Math.max(0, 1.0 - adjustedProbSum);
      }

      const numRemainingColors = COLORS.length - adjustedIndices.size;
      if (numRemainingColors > 0 && remainingProb > 0) {
        const probPerRemaining = remainingProb / numRemainingColors;
        for (let i = 0; i < COLORS.length; i++) {
          if (!adjustedIndices.has(i)) {
            probabilities[i] = probPerRemaining;
          }
        }
      } else if (numRemainingColors === 0 && adjustedProbSum < 1.0 && adjustedProbSum > 0) {
        // 边缘情况：所有颜色概率都被调整，但总和 < 1。进行归一化。
        const scale = 1.0 / adjustedProbSum;
        for (let i = 0; i < COLORS.length; i++) {
          probabilities[i] *= scale;
        }
        adjustedProbSum = 1.0;
      } else if (adjustedProbSum === 0) {
        // 如果没有进行调整，分配基础概率
        for (let i = 0; i < COLORS.length; i++) {
          probabilities[i] = baseProb;
        }
        adjustedProbSum = 1.0;
      }

      // Final normalization
      let currentSum = probabilities.reduce((acc, p) => acc + p, 0);
      if (Math.abs(currentSum - 1.0) > 1e-9) {
        if (currentSum <= 0) {
          console.warn(`Probabilities sum to ${currentSum} at (${m}, ${n}). Resetting.`);
          probabilities = Array(COLORS.length).fill(baseProb);
        } else {
          probabilities = probabilities.map(p => p / currentSum);
        }
      }

      matrix[m][n] = selectColorBasedOnProbability(probabilities);
    }
  }

  return matrix;
}; 