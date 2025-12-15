
// src/lib/raise.ts

// RAISE v4.0 Protocol Constants
const GRID_DIMENSION = 8;

// Each cell stores a 2-bit symbol (00, 01, 10, 11) mapped to a fixed palette.
const BITS_PER_CELL = 2;

const TOTAL_CELLS = GRID_DIMENSION * GRID_DIMENSION;
const ANCHOR_CELLS_COUNT = 4;
const DATA_CELLS_COUNT = TOTAL_CELLS - ANCHOR_CELLS_COUNT;

// Maximum raw payload capacity in bits (excluding anchor cells).
const RAW_CAPACITY_BITS = DATA_CELLS_COUNT * BITS_PER_CELL;

// Overhead: header (1 byte) + length (1 byte) + CRC-8 (1 byte).
const OVERHEAD_BITS = 3 * 8;

// Payload bits available after overhead.
const MAX_PAYLOAD_BITS = RAW_CAPACITY_BITS - OVERHEAD_BITS;

export const COLORS = {
  LIGHT: '#f8fafc',    // 00
  TEAL: '#10b77f',     // 01
  INDIGO: '#08349f',   // 10
  MIDNIGHT: '#020617', // 11
};

export const COLOR_MAP = [COLORS.LIGHT, COLORS.TEAL, COLORS.INDIGO, COLORS.MIDNIGHT];

const ANCHORS = {
  '0,0': 0, // Top-Left (Origin)
  '0,7': 1, // Top-Right (X-axis)
  '7,0': 2, // Bottom-Left (Y-axis)
  '7,7': 3, // Bottom-Right (Parity)
};

// --- CRC-8 Implementation (Polynomial 0x07) ---
const crc8 = (data: Uint8Array): number => {
  let crc = 0;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x80) !== 0) {
        crc = (crc << 1) ^ 0x07;
      } else {
        crc <<= 1;
      }
    }
  }
  return crc & 0xff;
};

// --- Encoding Logic ---
const encodeToRaiseV4 = (payload: string) => {
  // 1. Encode payload to UTF-8
  const textEncoder = new TextEncoder();
  const payloadBytes = textEncoder.encode(payload);

  if (payloadBytes.length * 8 > MAX_PAYLOAD_BITS) {
    throw new Error(`Payload exceeds maximum size of ${MAX_PAYLOAD_BITS / 8} bytes.`);
  }

  // 2. Construct Header (8 bits)
  // Version: 001 (v4), ECC: 00 (None), Encoding: 1 (UTF-8), Reserved: 00
  const header = 0b00100100;

  // 3. Get Payload Length (8 bits)
  const length = payloadBytes.length;

  // 4. Combine Header, Length, and Payload
  const preCrcData = new Uint8Array([header, length, ...payloadBytes]);

  // 5. Compute CRC-8
  const crc = crc8(preCrcData);

  // 6. Create final bitstream
  const fullData = new Uint8Array([...preCrcData, crc]);
  
  const bitStream: number[] = [];
  fullData.forEach(byte => {
    for (let i = 7; i >= 0; i--) {
      bitStream.push((byte >> i) & 1);
    }
  });

  // 7. Convert bitstream to 2-bit symbols
  const symbols: number[] = [];
  for (let i = 0; i < bitStream.length; i += 2) {
    if (i + 1 < bitStream.length) {
      const symbol = (bitStream[i] << 1) | bitStream[i + 1];
      symbols.push(symbol);
    }
  }

  return symbols;
};


// --- Grid Mapping ---
export const generateRaiseGrid = (payload: string): number[][] => {
    const symbols = encodeToRaiseV4(payload);
    const grid: number[][] = Array(GRID_DIMENSION).fill(0).map(() => Array(GRID_DIMENSION).fill(0));
    
    let symbolIndex = 0;

    for (let r = 0; r < GRID_DIMENSION; r++) {
        const isEvenRow = r % 2 === 0;
        for (let c_idx = 0; c_idx < GRID_DIMENSION; c_idx++) {
            const c = isEvenRow ? c_idx : GRID_DIMENSION - 1 - c_idx;

            const anchorValue = ANCHORS[`${r},${c}` as keyof typeof ANCHORS];
            if (anchorValue !== undefined) {
                grid[r][c] = anchorValue;
            } else {
                if (symbolIndex < symbols.length) {
                    grid[r][c] = symbols[symbolIndex++];
                } else {
                    grid[r][c] = 0; // Fill with 'Light' if no more data
                }
            }
        }
    }

    return grid;
};
