"use client";

import { useState } from "react";

import JumpstartPanel from "./panels/0-jumpstart/jumpstart";
import { State } from "@/types";
import LocationMapPanel from "./panels/1-location-map/location-map";
import ResultsPanel from "./panels/5-results/results";
import FetchingDataPanel from "./panels/3-fetching-data/fetching-data";

export default function Home() {
  const [state, setState] = useState<State | undefined>(undefined);

  if (!state) {
    return <JumpstartPanel stateCreated={(s) => setState(s)} />;
  }
  switch (state.currentPhase) {
    case "location-selection":
      return (
        <LocationMapPanel
          state={state}
          onNext={() => {
            setState({ ...state, currentPhase: "fetching-data" });
          }}
        />
      );
    case "fetching-data":
      return (
        <FetchingDataPanel
          state={state}
          onDataFetched={(grid) => {
            setState({ ...state, grid: grid, currentPhase: "results" });
          }}
        />
      );
    case "configuration":
    case "results":
      return <ResultsPanel state={state} />;
  }
}
