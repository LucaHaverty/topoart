// marchingSquares.ts

/**
 * Optimized Marching Squares with interpolation
 * Returns line segments [[x1,y1],[x2,y2]] representing the contour
 */

export function marchingSquares(
  grid: number[][],
  threshold: number
): Array<[[number, number], [number, number]]> {
  const rows = grid.length;
  const cols = grid[0].length;
  const segments: Array<[[number, number], [number, number]]> = [];

  // Lookup table: for each 4-bit index, which edges are connected
  // Edges: 0=top, 1=right, 2=bottom, 3=left
  const edgeTable: Array<Array<[number, number]>> = [
    [], // 0
    [[3, 2]], // 1
    [[2, 1]], // 2
    [[3, 1]], // 3
    [[0, 1]], // 4
    [
      [0, 3],
      [2, 1],
    ], // 5 (ambiguous)
    [[0, 2]], // 6
    [[0, 3]], // 7
    [[0, 3]], // 8
    [[0, 2]], // 9
    [
      [0, 1],
      [2, 3],
    ], // 10 (ambiguous)
    [[0, 1]], // 11
    [[3, 1]], // 12
    [[2, 1]], // 13
    [[3, 2]], // 14
    [], // 15
  ];

  // Edge midpoints relative to cell
  const edgeOffsets: [number, number][] = [
    [0.5, 0], // top
    [1, 0.5], // right
    [0.5, 1], // bottom
    [0, 0.5], // left
  ];

  // Linear interpolation between two points
  function interp(
    p1: [number, number],
    p2: [number, number],
    v1: number,
    v2: number
  ): [number, number] {
    if (Math.abs(v1 - v2) < 1e-6) return p1;
    const t = (threshold - v1) / (v2 - v1);
    return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
  }

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      // Cell corners
      const tl = grid[y][x];
      const tr = grid[y][x + 1];
      const br = grid[y + 1][x + 1];
      const bl = grid[y + 1][x];

      // Compute cell index
      let idx = 0;
      if (tl >= threshold) idx |= 8;
      if (tr >= threshold) idx |= 4;
      if (br >= threshold) idx |= 2;
      if (bl >= threshold) idx |= 1;

      const cellEdges = edgeTable[idx];
      if (!cellEdges.length) continue;

      // Compute edge points
      const corners: [number, number][] = [
        [x, y], // tl
        [x + 1, y], // tr
        [x + 1, y + 1], // br
        [x, y + 1], // bl
      ];

      const edgePoints: ([number, number] | null)[] = [null, null, null, null];

      for (let e = 0; e < 4; e++) {
        let p1: [number, number], p2: [number, number], v1: number, v2: number;
        switch (e) {
          case 0:
            p1 = corners[0];
            p2 = corners[1];
            v1 = tl;
            v2 = tr;
            break; // top
          case 1:
            p1 = corners[1];
            p2 = corners[2];
            v1 = tr;
            v2 = br;
            break; // right
          case 2:
            p1 = corners[2];
            p2 = corners[3];
            v1 = br;
            v2 = bl;
            break; // bottom
          case 3:
            p1 = corners[3];
            p2 = corners[0];
            v1 = bl;
            v2 = tl;
            break; // left
        }
        edgePoints[e] = interp(p1!, p2!, v1!, v2!);
      }

      // Add segments
      for (const [a, b] of cellEdges) {
        const pA = edgePoints[a]!;
        const pB = edgePoints[b]!;
        segments.push([pA, pB]);
      }
    }
  }

  return segments;
}
