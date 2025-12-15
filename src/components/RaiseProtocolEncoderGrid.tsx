
import React from 'react';
import { COLOR_MAP, COLORS } from '@/lib/raise';
import { flatToGrid } from '@/lib/raiseCodeUtils';

const GRID_DIMENSION = 8;

interface RaiseProtocolEncoderGridProps {
  grid: number[][] | number[]; // Can be 2D grid or flat array
  size: number;
}

const RaiseProtocolEncoderGrid: React.FC<RaiseProtocolEncoderGridProps> = ({ grid, size }) => {
  // Convert flat array to 2D grid if needed
  const normalizedGrid = Array.isArray(grid[0]) 
    ? grid as number[][] 
    : flatToGrid(grid as number[]);

  if (!normalizedGrid || normalizedGrid.length === 0) {
    return (
      <div style={{ 
        width: size, 
        height: size, 
        border: '1px solid #ccc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '10px', 
        boxSizing: 'border-box' 
      }}>
        <p style={{ color: '#555', textAlign: 'center', margin: 0, fontSize: '12px' }}>
          No code data.
        </p>
      </div>
    );
  }

  const cellSize = size / GRID_DIMENSION;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: COLORS.LIGHT }}>
      {normalizedGrid.map((row, r) =>
        row.map((cellValue, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill={COLOR_MAP[cellValue]}
          />
        ))
      )}
    </svg>
  );
};

export default RaiseProtocolEncoderGrid;
