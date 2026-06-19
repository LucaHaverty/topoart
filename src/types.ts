export type State = {
  config: UserConfigData;
  mapData: MapData;
};

export type UserConfigData = {
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

export type MapData = {
  grid: number[][] | undefined;
};

export const initialMapData: MapData = {
  grid: undefined,
};

export const initialConfig: UserConfigData = {
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

export const initialSate: State = {
  config: initialConfig,
  mapData: initialMapData,
};

//TODO: remove

export type Grid = number[][];
