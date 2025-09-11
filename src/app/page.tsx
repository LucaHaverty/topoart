"use client";

import { useEffect } from "react";

import { marchingSquares } from "./lib/marching-squares/marching-squares";

export default function Home() {
  const getElevationGrid = async (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    step: number = 0.01 // degrees
  ): Promise<number[][]> => {
    const minLat = Math.min(lat1, lat2);
    const maxLat = Math.max(lat1, lat2);
    const minLon = Math.min(lon1, lon2);
    const maxLon = Math.max(lon1, lon2);

    // Calculate exact number of rows/columns
    const rows = Math.round((maxLat - minLat) / step) + 1;
    const cols = Math.round((maxLon - minLon) / step) + 1;

    const locations: string[] = [];
    for (let i = 0; i < rows; i++) {
      const lat = minLat + i * step;
      for (let j = 0; j < cols; j++) {
        const lon = minLon + j * step;
        locations.push(`${lat.toFixed(5)},${lon.toFixed(5)}`);
      }
    }

    // Fetch elevations in chunks (max 100 locations per request)
    const chunkSize = 100;
    const elevations: number[] = [];

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < locations.length; i += chunkSize) {
      console.log("calling api");
      const chunk = locations.slice(i, i + chunkSize).join("|");
      const url = `/api/elevation?locations=${chunk}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        data.results.forEach((r: any) => elevations.push(r.elevation ?? 0));
      }
      console.log("called api");
      await delay(1000); // 200ms pause between requests
    }

    // Rebuild 2D grid using exact rows/cols
    const grid: number[][] = [];
    let index = 0;
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(elevations[index++] ?? 0);
      }
      grid.push(row);
    }

    return grid;
  };

  const normalize = (grid: number[][]): number[][] => {
    const flat = grid.flat();
    const max = Math.max(...flat);
    const min = Math.min(...flat);
    const diff = max - min || 1;
    return grid.map((row) => row.map((n) => (n - min) / diff));
  };

  useEffect(() => {
    (async () => {
      console.log("Fetching elevation grid...");

      // Rough bounding box around Mt. Hood
      const lat1 = 45.3,
        lon1 = -121.85;
      const lat2 = 45.45,
        lon2 = -121.65;

      let grid = await getElevationGrid(lat1, lon1, lat2, lon2, 0.0015);
      grid = normalize(grid);

      const canvas = document.createElement("canvas") as HTMLCanvasElement;
      document.body.appendChild(canvas);

      const cellSize = 20;
      canvas.width = grid[0].length * cellSize;
      canvas.height = grid.length * cellSize;

      const ctx = canvas.getContext("2d")!;

      // Draw grid as grayscale
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          const value = Math.max(0, Math.min(1, grid[y][x]));
          const gray = Math.floor(value * 255);
          ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }

      for (let threshold = 0.05; threshold < 1; threshold += 0.05) {
        // Run marching squares
        const result = marchingSquares(grid, threshold);

        // Draw edges in red
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        for (const segment of result) {
          const [[x1, y1], [x2, y2]] = segment;
          ctx.beginPath();
          ctx.moveTo(x1 * cellSize, y1 * cellSize);
          ctx.lineTo(x2 * cellSize, y2 * cellSize);
          ctx.stroke();
        }
      }
    })();
  }, []);

  return <div></div>;
}
