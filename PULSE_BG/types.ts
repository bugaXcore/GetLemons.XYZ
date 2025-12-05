
export interface AppConfig {
  speed: number;
  frequency: number;
  lifespan: number;
  strokeWidth: number;
  baseHue: number;
  hueRange: number;
  colorCycleSpeed: number;
  rotationSpeed: number;
  initialRotation: number;
  initialSize: number;
  shapeRoundness: number;
  customSvg: {
    path: string;
    viewBox: { x: number; y: number; width: number; height: number };
  } | null;
}

export interface Point {
  x: number;
  y: number;
}
