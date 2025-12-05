
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

export type Category = 'All' | 'AE Scripts' | '3D Assets' | 'Other' | string;

export interface Asset {
  id: number;
  title: string;
  category: string;
  version: string;
  license: string;
  fileType: string;
  shortDesc: string;
  fullDesc: string;
  featured: boolean;
  section?: 'repository' | 'works';
  gallery?: string[];
}

export interface HomepageConfig {
  headlinePart1: string;
  headlinePart2: string;
  subheadline: string;
  manifesto: string;
  heroVisualUrl?: string;
}

export type ViewState = 'home' | 'repository' | 'works' | 'info' | 'admin';