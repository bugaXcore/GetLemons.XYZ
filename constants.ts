
import { AppConfig, HomepageConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  speed: 2,
  frequency: 5,
  lifespan: 150,
  strokeWidth: 1.5,
  baseHue: 180,
  hueRange: 60,
  colorCycleSpeed: 0.5,
  rotationSpeed: 0.2,
  initialRotation: 0,
  initialSize: 10,
  shapeRoundness: 0,
  customSvg: null,
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  headlinePart1: "WHEN LIFE GIVES",
  headlinePart2: "YOU LEMONS...",
  subheadline: "MAKE LEMONADE.",
  manifesto: "// High-grade tools for motion designers to squeeze every drop of creativity out of their workflow.\n\nDon't let technical limitations sour your project.",
  heroVisualUrl: ""
};