// RAISE Protocol v3.0 - Encoding/Decoding Utilities
// Based on: https://github.com/mjsolidarios/raise-protocol

const GRID_SIZE = 8;
const BITS_PER_CELL = 2;
const DATA_CELLS = GRID_SIZE * GRID_SIZE - 4; // 64 - 4 anchors = 60
const MAX_PAYLOAD_BYTES = Math.floor((DATA_CELLS * BITS_PER_CELL) / 8) - 1; // -1 for checksum = 14 bytes

/**
 * Encode text string to RAISE protocol color array (flat 64-element array)
 * @param text - Input text to encode (max ~14 characters)
 * @returns Flat array of 64 color values (0-3)
 */
export const encodeTextToRaiseId = (text: string): number[] => {
  // 1. Text to Binary String
  let binary = '';
  for (let i = 0; i < text.length && i < MAX_PAYLOAD_BYTES; i++) {
    const bin = text.charCodeAt(i).toString(2).padStart(8, '0');
    binary += bin;
  }

  // 2. Calculate Checksum (simple XOR of all bytes)
  let checksum = 0;
  for (let i = 0; i < text.length && i < MAX_PAYLOAD_BYTES; i++) {
    checksum ^= text.charCodeAt(i);
  }
  binary += checksum.toString(2).padStart(8, '0');

  // 3. Pad with zeros to fill capacity (120 bits)
  const capacityBits = DATA_CELLS * BITS_PER_CELL;
  if (binary.length > capacityBits) {
    binary = binary.substring(0, capacityBits);
  } else {
    binary = binary.padEnd(capacityBits, '0');
  }

  // 4. Map to grid with anchor corners
  const colors: number[] = [];
  let dataPointer = 0;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      // Anchors (fixed corner values)
      // Top Left Corner = 0 (LIGHT)
      if (r === 0 && c === 0) {
        colors.push(0);
        continue;
      }
      // Top Right Corner = 1 (TEAL)
      if (r === 0 && c === GRID_SIZE - 1) {
        colors.push(1);
        continue;
      }
      // Bottom Left Corner = 2 (INDIGO)
      if (r === GRID_SIZE - 1 && c === 0) {
        colors.push(2);
        continue;
      }
      // Bottom Right Corner = 3 (MIDNIGHT)
      if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) {
        colors.push(3);
        continue;
      }

      // Data Cell (2 bits)
      const chunk = binary.substring(dataPointer, dataPointer + BITS_PER_CELL);
      const val = parseInt(chunk, 2);
      colors.push(val);
      dataPointer += BITS_PER_CELL;
    }
  }

  return colors;
};

/**
 * Convert flat array of 64 numbers into an 8x8 grid.
 * @param flatGrid The flat array to convert.
 * @returns An 8x8 2D array.
 */
export const flatToGrid = (flatGrid: number[]): number[][] => {
  if (!flatGrid || flatGrid.length !== GRID_SIZE * GRID_SIZE) {
    // Return an empty grid or throw an error if the flat array is not valid
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  }

  const grid: number[][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid.push(flatGrid.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE));
  }
  return grid;
};

/**
 * Legacy function - now uses text encoding instead of random generation
 * @deprecated Use encodeTextToRaiseId instead
 */
export const generateRaiseId = (): number[] => {
  // Generate a random ID string for legacy compatibility
  const randomId = Math.random().toString(36).substring(2, 16);
  return encodeTextToRaiseId(randomId);
};