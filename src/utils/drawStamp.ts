import type { StampSettings } from '../types';


// Simple deterministic random generator to prevent noise flickering
function createSeededRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}


export const drawStamp = (
  ctx: CanvasRenderingContext2D,
  settings: StampSettings,
  width: number,
  height: number,
  imagesLoaded: Record<string, HTMLImageElement>
) => {
  const isCircular = settings.type === 'circular';
  const centerX = width / 2;
  const centerY = height / 2;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background (only for export with color, or transparent)
  if (settings.backgroundColor === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (settings.backgroundColor === 'paper') {
    ctx.fillStyle = '#faf6f0';
    ctx.fillRect(0, 0, width, height);
    // Paper grain
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    const paperRand = createSeededRandom(42);
    for (let i = 0; i < 2000; i++) {
      const px = paperRand() * width;
      const py = paperRand() * height;
      ctx.fillRect(px, py, 2, 2);
    }
  }

  // Ink bleed filter (slight blur)
  if (settings.inkBleed > 0) {
    ctx.filter = `blur(${settings.inkBleed * 0.4}px)`;
  } else {
    ctx.filter = 'none';
  }

  ctx.strokeStyle = settings.inkColor;
  ctx.fillStyle = settings.inkColor;

  // --- Helpers ---
  const drawRoundedRect = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  };

  const applyLineStyle = (c: CanvasRenderingContext2D, style: string, thickness: number) => {
    c.lineWidth = thickness;
    if (style === 'dashed') {
      c.setLineDash([thickness * 3, thickness * 2]);
    } else if (style === 'dotted') {
      c.setLineDash([thickness * 0.5, thickness * 2]);
      c.lineCap = 'round';
    } else {
      c.setLineDash([]);
      c.lineCap = 'butt';
    }
  };

  // --- Borders ---
  if (isCircular) {
    const drawCircleBorder = (radius: number, thickness: number, style: string, spacing: number) => {
      if (radius <= 0) return;
      ctx.save();
      if (style === 'double') {
        applyLineStyle(ctx, 'solid', thickness * 0.6);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        applyLineStyle(ctx, 'solid', thickness * 0.4);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - spacing, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        applyLineStyle(ctx, style, thickness);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    if (settings.outerBorder.show) {
      drawCircleBorder(
        settings.outerBorder.radius,
        settings.outerBorder.thickness,
        settings.outerBorder.style,
        settings.outerBorder.spacing
      );
    }
    if (settings.innerBorder1.show) {
      drawCircleBorder(
        settings.innerBorder1.radius,
        settings.innerBorder1.thickness,
        settings.innerBorder1.style,
        settings.innerBorder1.spacing
      );
    }
    if (settings.innerBorder2.show) {
      drawCircleBorder(
        settings.innerBorder2.radius,
        settings.innerBorder2.thickness,
        settings.innerBorder2.style,
        settings.innerBorder2.spacing
      );
    }
  } else {
    // Rectangular shapes
    const rectW = width - 80;
    const rectH = height - 80;
    const rectX = centerX - rectW / 2;
    const rectY = centerY - rectH / 2;

    const drawRectBorder = (
      inset: number,
      thickness: number,
      style: string,
      spacing: number,
      cRadius: number
    ) => {
      const w = rectW - inset * 2;
      const h = rectH - inset * 2;
      const x = rectX + inset;
      const y = rectY + inset;
      const r = Math.max(0, cRadius - inset);

      ctx.save();
      if (style === 'double') {
        applyLineStyle(ctx, 'solid', thickness * 0.6);
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.stroke();

        const inW = w - spacing * 2;
        const inH = h - spacing * 2;
        const inX = x + spacing;
        const inY = y + spacing;
        const inR = Math.max(0, r - spacing);
        applyLineStyle(ctx, 'solid', thickness * 0.4);
        drawRoundedRect(ctx, inX, inY, inW, inH, inR);
        ctx.stroke();
      } else {
        applyLineStyle(ctx, style, thickness);
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.stroke();
      }
      ctx.restore();
    };

    if (settings.outerBorder.show) {
      drawRectBorder(0, settings.outerBorder.thickness, settings.outerBorder.style, settings.outerBorder.spacing, settings.cornerRadius);
    }
    if (settings.innerBorder1.show) {
      drawRectBorder(24, settings.innerBorder1.thickness, settings.innerBorder1.style, settings.innerBorder1.spacing, settings.cornerRadius);
    }
    if (settings.innerBorder2.show) {
      drawRectBorder(48, settings.innerBorder2.thickness, settings.innerBorder2.style, settings.innerBorder2.spacing, settings.cornerRadius);
    }

    if (settings.middleDividers.show) {
      const thickness = settings.middleDividers.thickness;
      const offset1 = (settings.middleDividers.yOffset1 / 100) * (rectH / 2);
      const offset2 = (settings.middleDividers.yOffset2 / 100) * (rectH / 2);
      
      ctx.save();
      ctx.lineWidth = thickness;
      ctx.lineCap = 'square';
      const lineLeft = rectX + 10;
      const lineRight = rectX + rectW - 10;

      ctx.beginPath();
      ctx.moveTo(lineLeft, centerY + offset1);
      ctx.lineTo(lineRight, centerY + offset1);
      ctx.stroke();

      if (settings.middleDividers.style === 'double') {
        ctx.beginPath();
        ctx.moveTo(lineLeft, centerY + offset2);
        ctx.lineTo(lineRight, centerY + offset2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // --- Text Layers ---
  settings.textLayers.forEach((layer) => {
    if (!layer.text.trim()) return;

    ctx.save();
    const fontStyleStr = `${layer.italic ? 'italic' : 'normal'} ${layer.bold ? 'bold' : 'normal'} ${layer.fontSize}px "${layer.fontFamily}"`;
    ctx.font = fontStyleStr;
    ctx.fillStyle = settings.inkColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (layer.type === 'curved' && isCircular) {
      const chars = Array.from(layer.text);
      const letterSpacing = layer.letterSpacing;
      const radius = layer.radius;

      const charAngles = chars.map((char) => {
        const charWidth = ctx.measureText(char).width;
        return (charWidth * letterSpacing) / radius;
      });

      const totalAngle = charAngles.reduce((sum, val) => sum + val, 0);
      const startRad = (layer.startAngle * Math.PI) / 180;
      
      let currentAngle = 0;
      if (layer.direction === 'clockwise') {
        currentAngle = startRad - totalAngle / 2;
      } else {
        currentAngle = startRad + totalAngle / 2;
      }

      chars.forEach((char, idx) => {
        const charAngle = charAngles[idx];
        ctx.save();
        
        if (layer.direction === 'clockwise') {
          const rot = currentAngle + charAngle / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate(rot);
          ctx.translate(0, -radius);
          ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
          ctx.fillText(char, 0, 0);
          currentAngle += charAngle;
        } else {
          const rot = currentAngle - charAngle / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate(rot);
          ctx.translate(0, radius);
          ctx.rotate(Math.PI);
          ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
          ctx.fillText(char, 0, 0);
          currentAngle -= charAngle;
        }
        ctx.restore();
      });
    } else {
      // Straight text
      ctx.translate(centerX, centerY);
      
      const maxOffsetX = isCircular ? settings.size / 2 : (width - 80) / 2;
      const maxOffsetY = isCircular ? settings.size / 2 : (height - 80) / 2;
      const tx = (layer.x / 100) * maxOffsetX;
      const ty = (layer.y / 100) * maxOffsetY;
      
      ctx.translate(tx, ty);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
      
      if (layer.letterSpacing !== 1.0) {
        const chars = Array.from(layer.text);
        const totalWidth = ctx.measureText(layer.text).width;
        const spacingPx = (layer.letterSpacing - 1.0) * (layer.fontSize * 0.3);
        
        let currentX = -((totalWidth + (chars.length - 1) * spacingPx) / 2);
        chars.forEach((char) => {
          const charW = ctx.measureText(char).width;
          ctx.fillText(char, currentX + charW / 2, 0);
          currentX += charW + spacingPx;
        });
      } else {
        ctx.fillText(layer.text, 0, 0);
      }
    }
    ctx.restore();
  });

  // --- Image Layers ---
  settings.imageLayers.forEach((layer) => {
    const img = imagesLoaded[layer.id];
    if (!img) return;

    ctx.save();
    ctx.translate(centerX, centerY);
    
    const maxOffsetX = isCircular ? settings.size / 2 : (width - 80) / 2;
    const maxOffsetY = isCircular ? settings.size / 2 : (height - 80) / 2;
    const tx = (layer.x / 100) * maxOffsetX;
    const ty = (layer.y / 100) * maxOffsetY;
    
    ctx.translate(tx, ty);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    
    const drawW = img.width * layer.scale;
    const drawH = img.height * layer.scale;
    ctx.globalAlpha = layer.opacity / 100;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = img.width;
    offCanvas.height = img.height;
    const offCtx = offCanvas.getContext('2d');

    if (offCtx) {
      offCtx.drawImage(img, 0, 0);
      
      if (layer.removeWhite || layer.colorize) {
        try {
          const imgData = offCtx.getImageData(0, 0, img.width, img.height);
          const data = imgData.data;
          const inkRgb = hexToRgb(settings.inkColor);
          const threshold = layer.whiteThreshold ?? 240;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a === 0) continue;

            // 1. Fehér háttér eltávolítása
            const isWhite = r >= threshold && g >= threshold && b >= threshold;
            if (layer.removeWhite && isWhite) {
              data[i + 3] = 0; // Transzparens
              continue;
            }

            // 2. Tinta színére színezés (Colorize)
            if (layer.colorize) {
              data[i] = inkRgb.r;
              data[i + 1] = inkRgb.g;
              data[i + 2] = inkRgb.b;

              if (layer.removeWhite) {
                // Luminancia szerinti finomítás a jobb élekért
                const brightness = (r + g + b) / 3;
                if (brightness > 128) {
                  const factor = (255 - brightness) / 127;
                  data[i + 3] = Math.round(a * factor);
                }
              } else {
                // Ha nincs fehér kiszűrés, de színezünk, a sötétség határozza meg az átlátszóságot
                const brightness = (r + g + b) / 3;
                data[i + 3] = Math.round(a * (1 - brightness / 255));
              }
            }
          }
          offCtx.putImageData(imgData, 0, 0);
        } catch (e) {
          console.error("Hiba a képfeldolgozás során:", e);
        }
      }
      ctx.drawImage(offCanvas, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    }
    ctx.restore();
  });


  // --- Realism / Grunge Effects ---
  if (settings.grungeStrength > 0) {
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'destination-out';
    
    const seedText = settings.textLayers.map(l => l.text).join('') || 'stamp';
    let charSum = 0;
    for (let i = 0; i < seedText.length; i++) {
      charSum += seedText.charCodeAt(i);
    }
    const noiseRand = createSeededRandom(charSum + settings.grungeStrength * 17);
    const strengthFactor = settings.grungeStrength / 100;
    
    // Noise dots
    const speckCount = Math.round(3000 * strengthFactor);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    for (let i = 0; i < speckCount; i++) {
      const px = noiseRand() * width;
      const py = noiseRand() * height;
      const speckSize = 1 + Math.floor(noiseRand() * 3);
      ctx.fillRect(px, py, speckSize, speckSize);
    }

    // Scratches
    const scratchCount = Math.round(40 * strengthFactor);
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    for (let i = 0; i < scratchCount; i++) {
      const sx = noiseRand() * width;
      const sy = noiseRand() * height;
      const length = 5 + noiseRand() * 25;
      const angle = noiseRand() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(angle) * length, sy + Math.sin(angle) * length);
      ctx.stroke();
    }

    // Ink fade patches
    const patchCount = Math.round(15 * strengthFactor);
    for (let i = 0; i < patchCount; i++) {
      const px = noiseRand() * width;
      const py = noiseRand() * height;
      const radius = 20 + noiseRand() * 40;
      
      const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
      const opacity = 0.1 + noiseRand() * 0.3;
      grad.addColorStop(0, `rgba(0,0,0,${opacity})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalCompositeOperation = 'source-over';
};
