import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserAvatarProps {
    seed: string;
    size?: number;
    className?: string;
    interactive?: boolean;
    onRegenerate?: () => void;
    color?: string;
    transparent?: boolean;
}

export const AVATAR_COLORS = [
    'hsl(217 91% 67%)', // Primary (Blue)
    'hsl(160 84% 39%)', // Secondary (Teal)
    'hsl(0 84% 70%)',   // Destructive (Red-ish)
    'hsl(35 92% 65%)',  // Amber/Orange
    'hsl(280 80% 60%)', // Purple
    'hsl(320 80% 60%)', // Pink
];

// Simple hash function to generate deterministic numbers from string
const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
    seed,
    size = 48,
    className,
    interactive = false,
    onRegenerate,
    color: overrideColor,
    transparent = false
}) => {
    const { grid, color } = useMemo(() => {
        const hash = hashCode(seed);
        const colorIndex = hash % AVATAR_COLORS.length;

        // Generate 5x5 grid (symmetric)
        // We only need to generate 3 columns (0, 1, 2) and mirror them to 4, 3
        const gridData: boolean[][] = [];
        for (let row = 0; row < 5; row++) {
            const rowData: boolean[] = [];
            for (let col = 0; col < 3; col++) {
                // Use different parts of the hash/seed for each cell
                // Using simple pseudo-random logic seeded by hash + position
                const val = (hash >> (row * 3 + col)) & 1;
                rowData.push(val === 1);
            }
            // Mirror
            rowData.push(rowData[1]); // col 3 is mirror of col 1
            rowData.push(rowData[0]); // col 4 is mirror of col 0
            gridData.push(rowData);
        }

        return {
            grid: gridData,
            color: overrideColor || AVATAR_COLORS[colorIndex]
        };
    }, [seed, overrideColor]);

    return (
        <div className={cn("relative group", className)} style={{ width: size, height: size }}>
            <div
                className={cn(
                    "overflow-hidden rounded-lg",
                    !transparent && "bg-muted/30 shadow-sm border border-border/50"
                )}
                style={{ width: '100%', height: '100%' }}
            >
                <svg viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" width="100%" height="100%">
                    <rect width="5" height="5" fill={transparent ? "transparent" : "#1e293b"} /> {/* Background - slate-800 equivalent */}
                    {grid.map((row, rIndex) => (
                        row.map((active, cIndex) => (
                            active ? (
                                <rect
                                    key={`${rIndex}-${cIndex}`}
                                    x={cIndex}
                                    y={rIndex}
                                    width="1"
                                    height="1"
                                    fill={color}
                                />
                            ) : null
                        ))
                    ))}
                </svg>
            </div>

            {interactive && onRegenerate && (
                <div className="absolute -bottom-2 -right-2 scale-90">
                    <Button
                        size="icon"
                        variant="default"
                        className="border border-2 h-7 w-7 rounded-full shadow-lg text-white"
                        onClick={onRegenerate}
                        title="Regenerate Avatar"
                    >
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
};
