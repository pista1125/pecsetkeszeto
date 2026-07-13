export type StampType = 'circular' | 'rectangular';

export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export interface BorderSettings {
  show: boolean;
  radius: number; // Radius (for circular) or width/height offset (for rectangular)
  thickness: number;
  style: BorderStyle;
  spacing: number; // Space between double lines
}

export interface TextLayer {
  id: string;
  type: 'curved' | 'straight';
  text: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  letterSpacing: number; // spacing multiplier or px
  
  // Curved text parameters (circular only)
  radius: number;
  startAngle: number; // in degrees (0 = right, 90 = bottom, 180 = left, 270/-90 = top)
  direction: 'clockwise' | 'counterclockwise';
  
  // Straight text parameters
  x: number; // percentage offset from center (-100 to 100)
  y: number; // percentage offset from center (-100 to 100)
  rotation: number; // in degrees

  // Mirroring options
  flipX?: boolean;
  flipY?: boolean;
}

export interface ImageLayer {
  id: string;
  src: string; // Base64 or Object URL
  name: string;
  x: number; // percentage offset from center
  y: number; // percentage offset from center
  scale: number;
  rotation: number; // in degrees
  opacity: number;
  colorize: boolean; // Paint with stamp ink color
  removeWhite: boolean; // Remove white background
  whiteThreshold: number; // Threshold for white color removal
}


export interface StampSettings {
  type: StampType;
  size: number; // Base preview canvas size (usually 1000px for high-res output)
  aspectRatio: number; // width / height (for rectangular, e.g. 1.6 or 2.0)
  inkColor: string;
  backgroundColor: 'transparent' | 'white' | 'paper';
  
  // Borders
  outerBorder: BorderSettings;
  innerBorder1: BorderSettings;
  innerBorder2: BorderSettings;
  
  // Rectangular options
  cornerRadius: number; // border radius for rectangular shapes
  
  // Decorative lines
  middleDividers: {
    show: boolean;
    thickness: number;
    yOffset1: number; // percentage offset from center
    yOffset2: number; // percentage offset from center
    style: 'single' | 'double';
  };
  
  // Realism Effects
  grungeStrength: number; // 0 (none) to 100 (heavy wear)
  inkBleed: number; // 0 (crisp) to 10 (high bleed)
  opacity: number; // stamp opacity (usually 100, can fade)
  
  // Layers
  textLayers: TextLayer[];
  imageLayers: ImageLayer[];
}

export interface StampTemplate {
  id: string;
  name: string;
  description: string;
  settings: StampSettings;
}
