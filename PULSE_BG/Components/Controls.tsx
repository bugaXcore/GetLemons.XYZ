
import React, { useRef } from 'react';
import { AppConfig } from '../types';

interface ControlsProps {
  config: AppConfig;
  onChange: (newConfig: AppConfig) => void;
}

export const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for partial updates
  const updateConfig = (updates: Partial<AppConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleChange = (key: keyof AppConfig, value: number | boolean | null) => {
    updateConfig({ [key]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "image/svg+xml");
          const pathElement = doc.querySelector('path');
          const svgElement = doc.querySelector('svg');
          
          if (pathElement) {
            const d = pathElement.getAttribute('d');
            if (d) {
              // 1. Try to get ViewBox
              let viewBox = { x: 0, y: 0, width: 24, height: 24 }; // Default fallback
              
              if (svgElement) {
                const vbAttr = svgElement.getAttribute('viewBox');
                if (vbAttr) {
                  const parts = vbAttr.split(/[\s,]+/).filter(Boolean).map(parseFloat);
                  if (parts.length === 4) {
                    viewBox = { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
                  }
                } else {
                  // 2. Fallback to width/height attributes if viewBox is missing
                  const w = parseFloat(svgElement.getAttribute('width') || '24');
                  const h = parseFloat(svgElement.getAttribute('height') || '24');
                  if (!isNaN(w) && !isNaN(h)) {
                    viewBox = { x: 0, y: 0, width: w, height: h };
                  }
                }
              }

              // Update config with both path AND dimensions
              updateConfig({ 
                customSvg: {
                  path: d,
                  viewBox: viewBox
                }
              });
            } else {
              alert("Could not find a 'd' attribute in the first <path> tag.");
            }
          } else {
            alert("No <path> tag found in this SVG.");
          }
        } catch (err) {
          console.error("Error parsing SVG", err);
          alert("Failed to parse SVG file.");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed top-4 right-4 w-72 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 pt-14 text-zinc-200 shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
      <div className="space-y-5">
        <ControlGroup label="Custom Shape">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".svg"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-medium transition-colors text-zinc-300"
            >
              {config.customSvg ? "Change SVG File" : "Upload SVG File"}
            </button>
            
            {config.customSvg && (
              <div className="flex items-center justify-between bg-zinc-950/50 p-2 rounded border border-zinc-800">
                <span className="text-xs text-green-500 font-mono">SVG Loaded</span>
                <button 
                  onClick={() => updateConfig({ customSvg: null })}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Clear
                </button>
              </div>
            )}
            <p className="text-[10px] text-zinc-500 leading-tight">
              Automatically detects SVG viewbox for correct centering.
            </p>
          </div>
        </ControlGroup>

        <ControlGroup label="Emission">
          <Slider
            label="Speed"
            value={config.speed}
            min={0.5}
            max={10}
            step={0.1}
            onChange={(v) => handleChange('speed', v)}
          />
          <Slider
            label="Frequency"
            value={config.frequency}
            min={0.1}
            max={20}
            step={0.1}
            onChange={(v) => handleChange('frequency', v)}
          />
          <Slider
            label="Lifespan"
            value={config.lifespan}
            min={50}
            max={500}
            step={10}
            onChange={(v) => handleChange('lifespan', v)}
          />
        </ControlGroup>

        <ControlGroup label="Appearance">
          <Slider
            label="Stroke Width"
            value={config.strokeWidth}
            min={0.5}
            max={10}
            step={0.5}
            onChange={(v) => handleChange('strokeWidth', v)}
          />
          <Slider
            label="Initial Size"
            value={config.initialSize}
            min={0}
            max={100}
            step={5}
            onChange={(v) => handleChange('initialSize', v)}
          />
          <Slider
            label="Corner Roundness"
            value={config.shapeRoundness}
            min={0}
            max={50}
            step={1}
            onChange={(v) => handleChange('shapeRoundness', v)}
          />
        </ControlGroup>

        <ControlGroup label="Color & Motion">
          <Slider
            label="Base Hue"
            value={config.baseHue}
            min={0}
            max={360}
            step={1}
            onChange={(v) => handleChange('baseHue', v)}
          />
          <Slider
            label="Hue Range"
            value={config.hueRange}
            min={0}
            max={360}
            step={5}
            onChange={(v) => handleChange('hueRange', v)}
          />
           <Slider
            label="Cycle Speed"
            value={config.colorCycleSpeed}
            min={0}
            max={5}
            step={0.1}
            onChange={(v) => handleChange('colorCycleSpeed', v)}
          />
          <Slider
            label="Initial Rotation"
            value={config.initialRotation}
            min={0}
            max={360}
            step={5}
            onChange={(v) => handleChange('initialRotation', v)}
          />
          <Slider
            label="Rotation Speed"
            value={config.rotationSpeed}
            min={-5}
            max={5}
            step={0.1}
            onChange={(v) => handleChange('rotationSpeed', v)}
          />
        </ControlGroup>
      </div>
    </div>
  );
};

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</h3>
    {children}
  </div>
);

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step, onChange }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs text-zinc-400">
      <span>{label}</span>
      <span className="font-mono">{value.toFixed(1)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
    />
  </div>
);
