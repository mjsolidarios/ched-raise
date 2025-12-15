export const generateRaiseCode = (): number[][] => {
  // Generate a 5x5 grid of random 0s and 1s
  const grid: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const row: number[] = [];
    for (let j = 0; j < 5; j++) {
      // 80% chance of 1, 20% chance of 0
      row.push(Math.random() < 0.8 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
};
