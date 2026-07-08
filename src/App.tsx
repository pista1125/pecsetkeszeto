import { useState, useEffect } from 'react';
import { useStampState } from './hooks/useStampState';
import { CanvasPreview } from './components/CanvasPreview';
import { ControlPanel } from './components/ControlPanel';
import { drawStamp } from './utils/drawStamp';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Undo2, 
  Redo2
} from 'lucide-react';


function App() {
  const {
    settings,
    updateSettings,
    undo,
    redo,
    canUndo,
    canRedo,
    loadTemplate,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    addImageLayer,
    updateImageLayer,
    deleteImageLayer,
    resetSettings,
  } = useStampState();

  const [zoom, setZoom] = useState<number>(90);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, HTMLImageElement>>({});

  // Pre-load images inside parent App component to share with CanvasPreview and Export function
  useEffect(() => {
    settings.imageLayers.forEach((layer) => {
      if (imagesLoaded[layer.id]?.src === layer.src) return;

      const img = new Image();
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [layer.id]: img }));
      };
      img.src = layer.src;
    });
  }, [settings.imageLayers, imagesLoaded]);

  // Handle stamp downloads at custom scale (e.g. 0.5x, 1x, 2x)
  const handleDownload = (format: 'png' | 'jpeg', scale: number) => {
    const isCircular = settings.type === 'circular';
    const baseWidth = settings.size;
    const baseHeight = isCircular ? settings.size : Math.round(settings.size / settings.aspectRatio);

    // Create high-res offscreen canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = baseWidth * scale;
    tempCanvas.height = baseHeight * scale;

    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Apply scale matrix transformation
    tempCtx.save();
    tempCtx.scale(scale, scale);

    // If JPEG, force white background if transparent
    const exportSettings = { ...settings };
    if (format === 'jpeg' && settings.backgroundColor === 'transparent') {
      exportSettings.backgroundColor = 'white' as const;
    }

    // Render using shared engine
    drawStamp(tempCtx, exportSettings, baseWidth, baseHeight, imagesLoaded);
    tempCtx.restore();

    // Trigger browser download dialog
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const fileExt = format;
    const link = document.createElement('a');
    link.download = `pecset_${settings.type}_${Date.now()}.${fileExt}`;
    link.href = tempCanvas.toDataURL(mimeType, 0.95);
    link.click();
  };

  const handleZoomIn = () => setZoom(z => Math.min(150, z + 10));
  const handleZoomOut = () => setZoom(z => Math.max(50, z - 10));
  const handleZoomReset = () => setZoom(90);

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">💮</span>
          <h1>PecsétKészítő</h1>
        </div>
        <div className="header-meta">
          Státusz: <strong>Szerkesztés alatt</strong> | Választott típus: 
          <strong> {settings.type === 'circular' ? 'Kör alakú' : 'Téglalap'}</strong>
        </div>
      </header>

      <main className="main-app">
        {/* Left Side: Control Panel */}
        <ControlPanel
          settings={settings}
          updateSettings={updateSettings}
          loadTemplate={loadTemplate}
          addTextLayer={addTextLayer}
          updateTextLayer={updateTextLayer}
          deleteTextLayer={deleteTextLayer}
          addImageLayer={addImageLayer}
          updateImageLayer={updateImageLayer}
          deleteImageLayer={deleteImageLayer}
          resetSettings={resetSettings}
          onDownload={handleDownload}
        />

        {/* Right Side: Interactive Preview Workspace */}
        <div className="workspace">
          <div className="canvas-wrapper">
            <CanvasPreview 
              settings={settings} 
              zoom={zoom} 
              imagesLoaded={imagesLoaded}
            />
          </div>

          {/* Canvas visual tools toolbar */}
          <div className="workspace-toolbar">
            <div className="toolbar-group">
              <button 
                className="toolbar-btn" 
                onClick={handleZoomOut} 
                disabled={zoom <= 50}
                title="Kicsinyítés"
              >
                <ZoomOut size={18} />
              </button>
              <span className="zoom-badge">{zoom}%</span>
              <button 
                className="toolbar-btn" 
                onClick={handleZoomIn} 
                disabled={zoom >= 150}
                title="Nagyítás"
              >
                <ZoomIn size={18} />
              </button>
              <button 
                className="toolbar-btn" 
                onClick={handleZoomReset} 
                title="Eredeti méret"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button 
                className="toolbar-btn" 
                onClick={undo} 
                disabled={!canUndo}
                title="Visszavonás (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button 
                className="toolbar-btn" 
                onClick={redo} 
                disabled={!canRedo}
                title="Mégis (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
