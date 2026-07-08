import React, { useEffect, useRef } from 'react';
import type { StampSettings } from '../types';
import { drawStamp } from '../utils/drawStamp';


interface CanvasPreviewProps {
  settings: StampSettings;
  zoom: number;
  imagesLoaded: Record<string, HTMLImageElement>;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ settings, zoom, imagesLoaded }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate canvas dimensions based on stamp type
  const isCircular = settings.type === 'circular';
  const width = settings.size;
  const height = isCircular ? settings.size : Math.round(settings.size / settings.aspectRatio);

  // Drawing effect calling shared drawStamp engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    drawStamp(ctx, settings, width, height, imagesLoaded);
  }, [settings, width, height, imagesLoaded]);

  // Adjust preview visual scale
  const aspect = width / height;
  
  return (
    <div 
      ref={containerRef} 
      className="canvas-container"
      style={{
        transform: `scale(${zoom / 100})`,
        transition: 'transform 0.2s ease-out',
        width: '100%',
        maxWidth: isCircular ? '500px' : '650px',
        aspectRatio: `${aspect}`,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          borderRadius: isCircular ? '50%' : `${settings.cornerRadius * 0.15}px`,
          backgroundColor: settings.backgroundColor === 'transparent' ? 'transparent' : 'initial',
          backgroundImage: settings.backgroundColor === 'transparent' 
            ? 'linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)'
            : 'none',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      />
    </div>
  );
};
export default CanvasPreview;
