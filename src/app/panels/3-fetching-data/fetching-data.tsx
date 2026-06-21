"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { State, Grid } from "@/types";
import { fetchElevationFromAPI } from "@/app/lib/data-manager";

export type FetchingDataProps = {
  state: State;
  onDataFetched: (grid: Grid) => void; // Added a callback to pass the data back to your main state
};

const FetchingDataPanel = ({ state, onDataFetched }: FetchingDataProps) => {
  // Use a ref to ensure the API is only called once even in React StrictMode
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if coordinates exist and we haven't initiated a fetch yet
    if (!state.userConfig.a || !state.userConfig.b || hasFetched.current)
      return;

    hasFetched.current = true;

    const getData = async () => {
      try {
        console.log("Starting API fetch for coordinates...", {
          a: state.userConfig.a,
          b: state.userConfig.b,
        });

        // Fetch the data from your API utility
        const gridData: Grid | undefined = await fetchElevationFromAPI(
          state.userConfig.a!,
          state.userConfig.b!,
          state.userConfig.dataResolution,
        );

        if (gridData == undefined) {
          console.error("Failed to fetch data");
          return;
        }

        // Your requested console log when it successfully finishes
        console.log("Finished fetching data! Grid results:", gridData);

        onDataFetched?.(gridData);
      } catch (error) {
        console.error("Failed to fetch elevation data:", error);
      }
    };

    getData();
  }, [
    state.userConfig.a,
    state.userConfig.b,
    state.userConfig.dataResolution,
    onDataFetched,
  ]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Fetching Data From API...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col items-center justify-center p-6 space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Downloading elevation matrix data...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FetchingDataPanel;
