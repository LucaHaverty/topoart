export type State = {
  userConfig: UserConfigData;

  currentPhase: TopoPhase;
  furthestPhase: TopoPhase;

  grid: number[][] | undefined;
};

export type UserConfigData = {
  a: Coordinate | undefined;
  b: Coordinate | undefined;
  dataResolution: DataResolution;

  minAltitude: number;
  maxAltitude: number;
  numContourLines: number;
  gradientStartColor: number;
  gradientEndColor: number;
  smoothing: number;
  showLabels: boolean;
  majorContourInterval: number;
  majorContourOffset: number;
};

export type TopoPhase =
  | "location-selection"
  | "configuration"
  | "fetching-data"
  | "results";

export type Coordinate = { lat: number; lng: number };
export enum DataResolution {
  Low,
  Medium,
  High,
}

export const initialConfig: UserConfigData = {
  a: undefined,
  b: undefined,
  dataResolution: DataResolution.Low,
  minAltitude: 0,
  maxAltitude: 0,
  numContourLines: 10,
  gradientStartColor: 0x000000,
  gradientEndColor: 0xffffff,
  smoothing: 0.5,
  showLabels: false,
  majorContourInterval: 5,
  majorContourOffset: 3,
};

export const initialState: State = {
  userConfig: initialConfig,
  currentPhase: "location-selection",
  furthestPhase: "location-selection",
  grid: undefined,
};

//TODO: remove

export type Grid = number[][];
