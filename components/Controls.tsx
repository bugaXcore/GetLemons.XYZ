
import React from 'react';
import { AppConfig } from '../types';

interface ControlsProps {
  config: AppConfig;
  onChange: (newConfig: AppConfig) => void;
}

// Preset shapes
const PRESET_SHAPES = {
  square: null, // null means use default square
  lemon: {
    path: "M22.33,1.67c-1.27-1.27-3.07-1.62-4.39-.86-1.79,1.04-7.4-2.27-13.38,3.73C-1.44,10.54,1.87,16.14.83,17.92c-.77,1.31-.42,3.12.86,4.39s3.07,1.62,4.39.86c1.79-1.04,7.4,2.27,13.38-3.73,5.99-5.99,2.68-11.59,3.73-13.38.77-1.31.42-3.12-.86-4.39h0Z",
    viewBox: { x: 0, y: 0, width: 24, height: 24 }
  },
  heart: {
    path: "M12,22.38L1.81,12.2c-1.17-1.17-1.81-2.73-1.81-4.38s.64-3.21,1.81-4.38c1.17-1.17,2.72-1.81,4.38-1.81s3.21.64,4.38,1.81l1.43,1.43,1.43-1.43c1.17-1.17,2.73-1.81,4.38-1.81s3.21.64,4.38,1.81h0c1.17,1.17,1.81,2.72,1.81,4.38s-.64,3.21-1.81,4.38l-10.19,10.19h0Z",
    viewBox: { x: 0, y: 0, width: 24, height: 24 }
  },
  circle: {
    path: "M12,2 C6.477,2 2,6.477 2,12 C2,17.523 6.477,22 12,22 C17.523,22 22,17.523 22,12 C22,6.477 17.523,2 12,2 Z",
    viewBox: { x: 0, y: 0, width: 24, height: 24 }
  }
};

export const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  // Helper for partial updates
  const updateConfig = (updates: Partial<AppConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleChange = (key: keyof AppConfig, value: number | boolean | null) => {
    updateConfig({ [key]: value });
  };

  const handleShapeSelect = (shape: keyof typeof PRESET_SHAPES) => {
    updateConfig({ customSvg: PRESET_SHAPES[shape] });
  };

  return (
    <div className="fixed top-20 left-4 w-72 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 pt-14 text-zinc-200 shadow-2xl z-50 max-h-[85vh] overflow-y-auto">
      <div className="space-y-5">
        <ControlGroup label="Shape">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleShapeSelect('square')}
              className={`aspect-square p-3 border-2 rounded-lg transition-all flex items-center justify-center ${
                !config.customSvg 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
              title="Square"
            >
              <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
            </button>
            
            <button
              onClick={() => handleShapeSelect('lemon')}
              className={`aspect-square p-3 border-2 rounded-lg transition-all flex items-center justify-center ${
                config.customSvg?.path === PRESET_SHAPES.lemon.path
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
              title="Lemon"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={PRESET_SHAPES.lemon.path} />
              </svg>
            </button>
            
            <button
              onClick={() => handleShapeSelect('heart')}
              className={`aspect-square p-3 border-2 rounded-lg transition-all flex items-center justify-center ${
                config.customSvg?.path === PRESET_SHAPES.heart.path
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
              title="Heart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={PRESET_SHAPES.heart.path} />
              </svg>
            </button>
            
            <button
              onClick={() => handleShapeSelect('circle')}
              className={`aspect-square p-3 border-2 rounded-lg transition-all flex items-center justify-center ${
                config.customSvg?.path === PRESET_SHAPES.circle.path
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
              title="Circle"
            >
              <div className="w-6 h-6 border-2 border-current rounded-full"></div>
            </button>
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
