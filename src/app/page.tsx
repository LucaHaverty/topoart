"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // Adjusted to standard shadcn import path

import { marchingSquares } from "./lib/marching-squares/marching-squares";
import {
  downloadGridJson,
  fetchElevationFromAPI,
  loadElevationJson,
} from "./lib/data-manager";
import JumpstartPanel from "./panels/0-jumpstart/jumpstart";
import { Grid } from "@/types";

export default function Home() {
  // 1. Manage the grid data via React state
  const [gridData, setGridData] = useState<Grid | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalize = (grid: Grid): Grid => {
    const flat = grid.flat();
    const max = Math.max(...flat);
    const min = Math.min(...flat);
    const diff = max - min || 1;
    return grid.map((row) => row.map((n) => (n - min) / diff));
  };

  // 2. Click handler directly bound to user interaction
  const handleLoadJson = async () => {
    try {
      console.log("Prompting user for elevation grid file...");
      const grid = await loadElevationJson();

      if (!grid) throw new Error("Failed to read grid from file");

      // Update state to trigger processing
      setGridData(grid);
    } catch (error) {
      console.error("Error loading JSON file:", error);
    }
  };

  // Alternative API fetch handler if you still want to support it
  const handleFetchAPI = async () => {
    try {
      console.log("Fetching elevation grid from API...");
      const lat1 = 45.3,
        lon1 = -121.85;
      const lat2 = 45.45,
        lon2 = -121.65;

      const grid = await fetchElevationFromAPI(lat1, lon1, lat2, lon2, 0.01);
      if (!grid) throw new Error("Failed to fetch grid from API");

      downloadGridJson(grid);
      setGridData(grid);
    } catch (error) {
      console.error("Error fetching from API:", error);
    }
  };

  // 3. This effect runs only when gridData changes
  useEffect(() => {
    if (!gridData) return;

    // Clear previous canvas if it exists to avoid stack-ups
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    let grid = normalize(gridData);

    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    containerRef.current?.appendChild(canvas);

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

    for (let threshold = 0.1; threshold < 1; threshold += 0.1) {
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
  }, [gridData]);

  return JumpstartPanel({ stateCreated: () => {} });
  // <div className="p-6 flex flex-col gap-4 items-start">
  //   <div className="flex gap-2">
  //     <Button onClick={handleLoadJson}>Upload Elevation JSON</Button>
  //     <Button variant="outline" onClick={handleFetchAPI}>
  //       Fetch from API
  //     </Button>
  //   </div>

  //   {/* The canvas gets safely mounted inside this wrapper container */}
  //   <div
  //     ref={containerRef}
  //     className="border border-slate-200 rounded mt-4 overflow-auto"
  //   />
  // </div>
  // );
}
