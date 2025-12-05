
import { Asset } from './types';

export const ASSETS: Asset[] = [
  {
    id: 1,
    title: "EASE_COPY.JSX",
    category: "AE Scripts",
    version: "v2.4",
    license: "MIT",
    fileType: ".JSX",
    shortDesc: "Copy/Paste keyframe distinct curves.",
    fullDesc: "A precise utility for copying easing data between keys without affecting values. Essential for graph editor workflows.",
    featured: true,
    section: 'repository'
  },
  {
    id: 2,
    title: "LAYER_RENAMER",
    category: "AE Scripts",
    version: "CC24",
    license: "Commercial",
    fileType: ".JSXBIN",
    shortDesc: "Regex-based batch renaming tool.",
    fullDesc: "Terminal-style renaming utility. Supports Grep, Append, Prepend, and Search/Replace logic for heavy comps.",
    featured: false,
    section: 'repository'
  },
  {
    id: 3,
    title: "LOW_POLY_UI_KIT",
    category: "3D Assets",
    version: "v1.0",
    license: "CC0",
    fileType: ".OBJ",
    shortDesc: "Kitbash set of UI widgets.",
    fullDesc: "A collection of 50+ hard-surface UI elements. UV unwrapped. Ready for Element 3D or C4D usage.",
    featured: true,
    section: 'repository'
  },
  {
    id: 4,
    title: "GRAIN_LAB",
    category: "Other",
    version: "v3.0",
    license: "Free",
    fileType: ".FFX",
    shortDesc: "Procedural noise presets.",
    fullDesc: "Digitally generated film grain emulation. Non-destructive preset based on fractal noise algorithms.",
    featured: false,
    section: 'repository'
  },
  {
    id: 5,
    title: "NULL_SWAPPER",
    category: "AE Scripts",
    version: "v1.5",
    license: "MIT",
    fileType: ".JSX",
    shortDesc: "Swap layers with Nulls instantly.",
    fullDesc: "One-click solution to replace selected footage layers with Null objects while maintaining transform data.",
    featured: false,
    section: 'repository'
  }
];
