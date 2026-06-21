"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { State, Grid } from "@/types";
import { marchingSquares } from "../../lib/marching-squares/marching-squares"; // Double-check this import path matches your project structure

export type ResultsProps = {
  state: State;
};

const ResultsPanel = ({ state }: ResultsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const gridData = state.grid;

  useEffect(() => {
    if (!gridData || !gridData.length) return;

    // Clear previous canvas if it exists to avoid stack-ups on re-renders
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Normalization helper local to the render loop
    const normalize = (grid: Grid): Grid => {
      const flat = grid.flat();
      const max = Math.max(...flat);
      const min = Math.min(...flat);
      const diff = max - min || 1;
      return grid.map((row) => row.map((n) => (n - min) / diff));
    };

    const grid = normalize(gridData);

    // Create the canvas element programmatically
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    containerRef.current?.appendChild(canvas);

    const cellSize = 20;
    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw grid as grayscale background
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const value = Math.max(0, Math.min(1, grid[y][x]));
        const gray = Math.floor(value * 255);
        ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Run marching squares algorithms across thresholds
    for (let threshold = 0.04; threshold < 1; threshold += 0.04) {
      const result = marchingSquares(grid, threshold);

      // Draw vector contour edges in red
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-6 flex flex-col gap-4 items-center justify-center">
          {!gridData && (
            <p className="text-sm text-muted-foreground">
              No grid elevation data found to display.
            </p>
          )}
          {/* The canvas gets safely mounted inside this wrapper container */}
          <div
            ref={containerRef}
            className="border border-slate-200 rounded mt-4 overflow-auto max-w-full bg-slate-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;
