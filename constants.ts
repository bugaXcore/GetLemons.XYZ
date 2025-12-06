
import { AppConfig, HomepageConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  speed: 2,
  frequency: 5,
  lifespan: 150,
  strokeWidth: 1.5,
  baseHue: 50, // Yellow hue for lemons
  hueRange: 30, // Yellow-green range
  colorCycleSpeed: 0.5,
  rotationSpeed: 0.2,
  initialRotation: 0,
  initialSize: 10,
  shapeRoundness: 0,
  customSvg: {
    path: "M22.33,1.67c-1.27-1.27-3.07-1.62-4.39-.86-1.79,1.04-7.4-2.27-13.38,3.73C-1.44,10.54,1.87,16.14.83,17.92c-.77,1.31-.42,3.12.86,4.39s3.07,1.62,4.39.86c1.79-1.04,7.4,2.27,13.38-3.73,5.99-5.99,2.68-11.59,3.73-13.38.77-1.31.42-3.12-.86-4.39h0Z",
    viewBox: { x: 0, y: 0, width: 24, height: 24 }
  },
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  headlinePart1: "WHEN LIFE GIVES",
  headlinePart2: "YOU LEMONS...",
  subheadline: "MAKE LEMONADE.",
  manifesto: "// High-grade tools for motion designers to squeeze every drop of creativity out of their workflow.\n\nDon't let technical limitations sour your project.",
  heroVisualUrl: ""
};