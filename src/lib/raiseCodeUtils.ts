const GRID_DIMENSION = 8;
const COLOR_COUNT = 8;

/**
 * Generates a RAISE ID, which is a flat array of 64 numbers (0-7).
 * This represents an 8x8 grid.
 * @returns A flat array of 64 numbers.
 */
export const generateRaiseId = (): number[] => {
  const grid: number[] = [];
  for (let i = 0; i < GRID_DIMENSION * GRID_DIMENSION; i++) {
    grid.push(Math.floor(Math.random() * COLOR_COUNT));
  }
  return grid;
};

/**
 * Converts a flat array of 64 numbers into an 8x8 grid.
 * @param flatGrid The flat array to convert.
 * @returns An 8x8 2D array.
 */
export const flatToGrid = (flatGrid: number[]): number[][] => {
  if (!flatGrid || flatGrid.length !== GRID_DIMENSION * GRID_DIMENSION) {
    // Return an empty grid or throw an error if the flat array is not valid
    return Array.from({ length: GRID_DIMENSION }, () => Array(GRID_DIMENSION).fill(0));
  }

  const grid: number[][] = [];
  for (let i = 0; i < GRID_DIMENSION; i++) {
    grid.push(flatGrid.slice(i * GRID_DIMENSION, (i + 1) * GRID_DIMENSION));
  }
  return grid;
};