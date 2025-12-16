// RAISE Protocol v3.0 - Color Constants
// Based on: https://github.com/mjsolidarios/raise-protocol

export const GRID_SIZE = 8;
export const BITS_PER_CELL = 2;
export const DATA_CELLS = GRID_SIZE * GRID_SIZE - 4;

// Color Palette (4-ary Logic)
export const COLORS = {
  LIGHT: '#f8fafc',    // 00 - Light
  TEAL: '#10b77f',     // 01 - Teal
  INDIGO: '#08349f',   // 10 - Indigo (Primary Blue)
  MIDNIGHT: '#020617', // 11 - Midnight (Dark Navy)
};

// Color map indexed by value (0-3)
export const COLOR_MAP = [
  COLORS.LIGHT,    // 0
  COLORS.TEAL,     // 1
  COLORS.INDIGO,   // 2
  COLORS.MIDNIGHT  // 3
];

// RGB values for each color (used by scanners for color detection)
export const COLOR_RGB: Record<number, [number, number, number]> = {
  0: [248, 250, 252], // LIGHT
  1: [16, 183, 127],  // TEAL
  2: [8, 52, 159],    // INDIGO
  3: [2, 6, 23],      // MIDNIGHT
};
