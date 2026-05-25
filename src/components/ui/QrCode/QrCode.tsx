import { useMemo } from 'react';

interface QrCodeProps {
  value?: string;
  size?: number;
}

export function QrCode({ value = 'PASSINI', size = 200 }: QrCodeProps) {
  const cells = useMemo(() => {
    const n = 25;
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    const grid: boolean[][] = [];
    for (let y = 0; y < n; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < n; x++) {
        seed = (seed * 1103515245 + 12345) >>> 0;
        row.push((seed & 0xff) > 124);
      }
      grid.push(row);
    }
    const finder = (gx: number, gy: number) => {
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 7; x++) {
          const onBorder = x === 0 || x === 6 || y === 0 || y === 6;
          const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[gy + y][gx + x] = onBorder || inner;
        }
    };
    finder(0, 0);
    finder(n - 7, 0);
    finder(0, n - 7);
    return grid;
  }, [value]);

  const n = cells.length;
  const cell = size / n;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map((row, y) =>
        row.map((v, x) =>
          v ? (
            <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#111" />
          ) : null,
        ),
      )}
    </svg>
  );
}
