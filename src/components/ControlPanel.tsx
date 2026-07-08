import React, { useState } from 'react';
import type { 
  StampSettings, 
  TextLayer, 
  ImageLayer, 
  BorderStyle 
} from '../types';
import { 
  SUPPORTED_FONTS, 
  INK_COLORS, 
  STAMP_TEMPLATES 
} from '../constants';
import { 
  Type, 
  Image as ImageIcon, 
  Sliders, 
  Download, 
  Plus, 
  Trash2, 
  Palette, 
  Layout, 
  ChevronDown, 
  ChevronUp, 
  Bold, 
  Italic, 
  RefreshCw
} from 'lucide-react';


interface ControlPanelProps {
  settings: StampSettings;
  updateSettings: (updater: (s: StampSettings) => StampSettings) => void;
  loadTemplate: (id: string) => void;
  addTextLayer: (type: 'curved' | 'straight') => void;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  deleteTextLayer: (id: string) => void;
  addImageLayer: (src: string, name: string) => void;
  updateImageLayer: (id: string, updates: Partial<ImageLayer>) => void;
  deleteImageLayer: (id: string) => void;
  resetSettings: () => void;
  onDownload: (format: 'png' | 'jpeg', scale: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  updateSettings,
  loadTemplate,
  addTextLayer,
  updateTextLayer,
  deleteTextLayer,
  addImageLayer,
  updateImageLayer,
  deleteImageLayer,
  resetSettings,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'shape' | 'text' | 'images' | 'effects' | 'export'>('templates');

  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);
  const [exportScale, setExportScale] = useState<number>(1); // 1 = 1000px, 2 = 2000px etc
  const isCircular = settings.type === 'circular';


  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addImageLayer(event.target.result as string, file.name);
        setActiveTab('images');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleLayerExpand = (id: string) => {
    setExpandedLayerId(expandedLayerId === id ? null : id);
  };

  return (
    <div className="control-panel">
      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          title="Sablonok"
        >
          <Layout size={18} />
          <span>Sablonok</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'shape' ? 'active' : ''}`}
          onClick={() => setActiveTab('shape')}
          title="Pecsét alakja és keretei"
        >
          <Sliders size={18} />
          <span>Keret</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
          title="Szövegrétegek szerkesztése"
        >
          <Type size={18} />
          <span>Szöveg</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
          title="Kép/Logó feltöltése és beállítása"
        >
          <ImageIcon size={18} />
          <span>Kép</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
          onClick={() => setActiveTab('effects')}
          title="Tinta és kopás effektusok"
        >
          <Palette size={18} />
          <span>Effektek</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
          title="Letöltés és exportálás"
        >
          <Download size={18} />
          <span>Mentés</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="tab-content">
        
        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="tab-pane animate-fade-in">
            <h3>Előre elkészített sablonok</h3>
            <p className="subtitle">Válassz egyet alapként a gyors indításhoz:</p>
            <div className="template-grid">
              {STAMP_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  className={`template-card ${settings.type === tmpl.settings.type ? 'matching-type' : ''}`}
                  onClick={() => loadTemplate(tmpl.id)}
                >
                  <div className="template-info">
                    <h4>{tmpl.name}</h4>
                    <p>{tmpl.description}</p>
                    <span className="badge">
                      {tmpl.settings.type === 'circular' ? 'Kör alakú' : 'Téglalap'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="reset-section">
              <button className="btn-secondary" onClick={resetSettings}>
                <RefreshCw size={14} /> Alaphelyzet visszaállítása
              </button>
            </div>
          </div>
        )}

        {/* SHAPE & BORDERS TAB */}
        {activeTab === 'shape' && (
          <div className="tab-pane animate-fade-in">
            <h3>Bélyegző alakja & kerete</h3>
            
            <div className="form-group">
              <label>Pecsét típusa</label>
              <div className="toggle-group">
                <button 
                  className={settings.type === 'circular' ? 'active' : ''} 
                  onClick={() => updateSettings(s => ({ ...s, type: 'circular' }))}
                >
                  Kör alakú
                </button>
                <button 
                  className={settings.type === 'rectangular' ? 'active' : ''} 
                  onClick={() => updateSettings(s => ({ ...s, type: 'rectangular' }))}
                >
                  Téglalap alakú
                </button>
              </div>
            </div>

            {settings.type === 'rectangular' && (
              <>
                <div className="form-group">
                  <div className="flex-row">
                    <label>Képarány (Szélesség / Magasság)</label>
                    <span className="val-preview">{settings.aspectRatio.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="1.0" max="3.0" step="0.1" 
                    value={settings.aspectRatio} 
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      updateSettings(s => ({ ...s, aspectRatio: val }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <div className="flex-row">
                    <label>Sarok kerekítése</label>
                    <span className="val-preview">{settings.cornerRadius}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="2" 
                    value={settings.cornerRadius} 
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      updateSettings(s => ({ ...s, cornerRadius: val }));
                    }}
                  />
                </div>
              </>
            )}

            <hr />

            {/* BORDER SETTINGS ACCORDION */}
            {/* Outer Border */}
            <div className="border-accordion-item">
              <div className="flex-row border-header">
                <h4>Külső keretvonal</h4>
                <input 
                  type="checkbox" 
                  checked={settings.outerBorder.show}
                  onChange={e => updateSettings(s => ({
                    ...s,
                    outerBorder: { ...s.outerBorder, show: e.target.checked }
                  }))}
                />
              </div>
              
              {settings.outerBorder.show && (
                <div className="border-controls animate-slide-down">
                  {settings.type === 'circular' && (
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Sugár (méret)</label>
                        <span className="val-preview">{settings.outerBorder.radius}px</span>
                      </div>
                      <input 
                        type="range" min="300" max="480" step="5" 
                        value={settings.outerBorder.radius}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            outerBorder: { ...s.outerBorder, radius: val }
                          }));
                        }}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <div className="flex-row">
                      <label>Vastagság</label>
                      <span className="val-preview">{settings.outerBorder.thickness}px</span>
                    </div>
                    <input 
                      type="range" min="1" max="24" step="1" 
                      value={settings.outerBorder.thickness}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        updateSettings(s => ({
                          ...s,
                          outerBorder: { ...s.outerBorder, thickness: val }
                        }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stílus</label>
                    <select
                      value={settings.outerBorder.style}
                      onChange={e => updateSettings(s => ({
                        ...s,
                        outerBorder: { ...s.outerBorder, style: e.target.value as BorderStyle }
                      }))}
                    >
                      <option value="solid">Folytonos</option>
                      <option value="double">Dupla vonal</option>
                      <option value="dashed">Szaggatott</option>
                      <option value="dotted">Pontozott</option>
                    </select>
                  </div>
                  {settings.outerBorder.style === 'double' && (
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Dupla vonal távolsága</label>
                        <span className="val-preview">{settings.outerBorder.spacing}px</span>
                      </div>
                      <input 
                        type="range" min="4" max="24" step="1" 
                        value={settings.outerBorder.spacing}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            outerBorder: { ...s.outerBorder, spacing: val }
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inner Border 1 */}
            <div className="border-accordion-item">
              <div className="flex-row border-header">
                <h4>Belső keretvonal 1</h4>
                <input 
                  type="checkbox" 
                  checked={settings.innerBorder1.show}
                  onChange={e => updateSettings(s => ({
                    ...s,
                    innerBorder1: { ...s.innerBorder1, show: e.target.checked }
                  }))}
                />
              </div>
              
              {settings.innerBorder1.show && (
                <div className="border-controls animate-slide-down">
                  {settings.type === 'circular' && (
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Sugár (méret)</label>
                        <span className="val-preview">{settings.innerBorder1.radius}px</span>
                      </div>
                      <input 
                        type="range" min="150" max="380" step="5" 
                        value={settings.innerBorder1.radius}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            innerBorder1: { ...s.innerBorder1, radius: val }
                          }));
                        }}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <div className="flex-row">
                      <label>Vastagság</label>
                      <span className="val-preview">{settings.innerBorder1.thickness}px</span>
                    </div>
                    <input 
                      type="range" min="1" max="15" step="1" 
                      value={settings.innerBorder1.thickness}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        updateSettings(s => ({
                          ...s,
                          innerBorder1: { ...s.innerBorder1, thickness: val }
                        }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stílus</label>
                    <select
                      value={settings.innerBorder1.style}
                      onChange={e => updateSettings(s => ({
                        ...s,
                        innerBorder1: { ...s.innerBorder1, style: e.target.value as BorderStyle }
                      }))}
                    >
                      <option value="solid">Folytonos</option>
                      <option value="double">Dupla vonal</option>
                      <option value="dashed">Szaggatott</option>
                      <option value="dotted">Pontozott</option>
                    </select>
                  </div>
                  {settings.innerBorder1.style === 'double' && (
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Dupla vonal távolsága</label>
                        <span className="val-preview">{settings.innerBorder1.spacing}px</span>
                      </div>
                      <input 
                        type="range" min="4" max="20" step="1" 
                        value={settings.innerBorder1.spacing}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            innerBorder1: { ...s.innerBorder1, spacing: val }
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inner Border 2 - mostly for circular */}
            {isCircular && (
              <div className="border-accordion-item">
                <div className="flex-row border-header">
                  <h4>Belső keretvonal 2</h4>
                  <input 
                    type="checkbox" 
                    checked={settings.innerBorder2.show}
                    onChange={e => updateSettings(s => ({
                      ...s,
                      innerBorder2: { ...s.innerBorder2, show: e.target.checked }
                    }))}
                  />
                </div>
                
                {settings.innerBorder2.show && (
                  <div className="border-controls animate-slide-down">
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Sugár (méret)</label>
                        <span className="val-preview">{settings.innerBorder2.radius}px</span>
                      </div>
                      <input 
                        type="range" min="80" max="300" step="5" 
                        value={settings.innerBorder2.radius}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            innerBorder2: { ...s.innerBorder2, radius: val }
                          }));
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Vastagság</label>
                        <span className="val-preview">{settings.innerBorder2.thickness}px</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" step="1" 
                        value={settings.innerBorder2.thickness}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            innerBorder2: { ...s.innerBorder2, thickness: val }
                          }));
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Stílus</label>
                      <select
                        value={settings.innerBorder2.style}
                        onChange={e => updateSettings(s => ({
                          ...s,
                          innerBorder2: { ...s.innerBorder2, style: e.target.value as BorderStyle }
                        }))}
                      >
                        <option value="solid">Folytonos</option>
                        <option value="double">Dupla vonal</option>
                        <option value="dashed">Szaggatott</option>
                        <option value="dotted">Pontozott</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Middle Dividers - Rectangular only */}
            {!isCircular && (
              <div className="border-accordion-item">
                <div className="flex-row border-header">
                  <h4>Vízszintes osztóvonalak</h4>
                  <input 
                    type="checkbox" 
                    checked={settings.middleDividers.show}
                    onChange={e => updateSettings(s => ({
                      ...s,
                      middleDividers: { ...s.middleDividers, show: e.target.checked }
                    }))}
                  />
                </div>
                
                {settings.middleDividers.show && (
                  <div className="border-controls animate-slide-down">
                    <div className="form-group">
                      <label>Vonalak stílusa</label>
                      <div className="toggle-group select-smaller">
                        <button 
                          className={settings.middleDividers.style === 'single' ? 'active' : ''} 
                          onClick={() => updateSettings(s => ({
                            ...s,
                            middleDividers: { ...s.middleDividers, style: 'single' }
                          }))}
                        >
                          Egy vonal
                        </button>
                        <button 
                          className={settings.middleDividers.style === 'double' ? 'active' : ''} 
                          onClick={() => updateSettings(s => ({
                            ...s,
                            middleDividers: { ...s.middleDividers, style: 'double' }
                          }))}
                        >
                          Két vonal
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <div className="flex-row">
                        <label>Vonalvastagság</label>
                        <span className="val-preview">{settings.middleDividers.thickness}px</span>
                      </div>
                      <input 
                        type="range" min="1" max="15" step="1" 
                        value={settings.middleDividers.thickness}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            middleDividers: { ...s.middleDividers, thickness: val }
                          }));
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <div className="flex-row">
                        <label>Felső vonal pozíciója (Y)</label>
                        <span className="val-preview">{settings.middleDividers.yOffset1}%</span>
                      </div>
                      <input 
                        type="range" min="-90" max="0" step="5" 
                        value={settings.middleDividers.yOffset1}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          updateSettings(s => ({
                            ...s,
                            middleDividers: { ...s.middleDividers, yOffset1: val }
                          }));
                        }}
                      />
                    </div>

                    {settings.middleDividers.style === 'double' && (
                      <div className="form-group">
                        <div className="flex-row">
                          <label>Alsó vonal pozíciója (Y)</label>
                          <span className="val-preview">{settings.middleDividers.yOffset2}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="90" step="5" 
                          value={settings.middleDividers.yOffset2}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            updateSettings(s => ({
                              ...s,
                              middleDividers: { ...s.middleDividers, yOffset2: val }
                            }));
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TEXT LAYERS TAB */}
        {activeTab === 'text' && (
          <div className="tab-pane animate-fade-in">
            <div className="flex-row header-with-btn">
              <h3>Szövegrétegek</h3>
              <div className="btn-group-horizontal">
                {isCircular && (
                  <button 
                    className="btn-primary btn-sm"
                    onClick={() => addTextLayer('curved')}
                  >
                    <Plus size={14} /> Köríves
                  </button>
                )}
                <button 
                  className="btn-primary btn-sm"
                  onClick={() => addTextLayer('straight')}
                >
                  <Plus size={14} /> Egyenes
                </button>
              </div>
            </div>

            {settings.textLayers.length === 0 ? (
              <div className="empty-state">
                <p>Nincsenek szövegrétegek. Kattints a fenti gombra az első szöveg hozzáadásához!</p>
              </div>
            ) : (
              <div className="layers-list">
                {settings.textLayers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <div 
                      className="layer-item-header"
                      onClick={() => toggleLayerExpand(layer.id)}
                    >
                      <div className="layer-info-summary">
                        <span className="layer-icon"><Type size={16} /></span>
                        <div className="layer-text-preview">
                          <strong className="truncate">{layer.text || 'Üres szöveg'}</strong>
                          <span>{layer.type === 'curved' ? 'Köríves szöveg' : 'Egyenes szöveg'} • {layer.fontFamily}</span>
                        </div>
                      </div>
                      <div className="layer-actions">
                        <button 
                          className="btn-icon-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTextLayer(layer.id);
                          }}
                          title="Törlés"
                        >
                          <Trash2 size={14} />
                        </button>
                        {expandedLayerId === layer.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {expandedLayerId === layer.id && (
                      <div className="layer-item-body animate-slide-down">
                        <div className="form-group">
                          <label>Szöveg tartalma</label>
                          <input 
                            type="text" 
                            value={layer.text}
                            onChange={e => updateTextLayer(layer.id, { text: e.target.value })}
                            placeholder="Írj be szöveget..."
                          />
                        </div>

                        <div className="flex-row">
                          <div className="form-group flex-1">
                            <label>Betűtípus</label>
                            <select
                              value={layer.fontFamily}
                              onChange={e => updateTextLayer(layer.id, { fontFamily: e.target.value })}
                            >
                              {SUPPORTED_FONTS.map(f => (
                                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Stílus</label>
                            <div className="btn-group-horizontal-compact">
                              <button 
                                className={`style-btn ${layer.bold ? 'active' : ''}`}
                                onClick={() => updateTextLayer(layer.id, { bold: !layer.bold })}
                                title="Félkövér"
                              >
                                <Bold size={16} />
                              </button>
                              <button 
                                className={`style-btn ${layer.italic ? 'active' : ''}`}
                                onClick={() => updateTextLayer(layer.id, { italic: !layer.italic })}
                                title="Dőlt"
                              >
                                <Italic size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Betűméret</label>
                            <span className="val-preview">{layer.fontSize}px</span>
                          </div>
                          <input 
                            type="range" min="10" max="150" step="1" 
                            value={layer.fontSize}
                            onChange={e => updateTextLayer(layer.id, { fontSize: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Betűköz</label>
                            <span className="val-preview">{layer.letterSpacing.toFixed(1)}</span>
                          </div>
                          <input 
                            type="range" min="0.5" max="5.0" step="0.1" 
                            value={layer.letterSpacing}
                            onChange={e => updateTextLayer(layer.id, { letterSpacing: parseFloat(e.target.value) })}
                          />
                        </div>

                        {layer.type === 'curved' && isCircular ? (
                          <>
                            <div className="form-group">
                              <div className="flex-row">
                                <label>Körív sugara</label>
                                <span className="val-preview">{layer.radius}px</span>
                              </div>
                              <input 
                                type="range" min="50" max="470" step="5" 
                                value={layer.radius}
                                onChange={e => updateTextLayer(layer.id, { radius: parseInt(e.target.value) })}
                              />
                            </div>

                            <div className="form-group">
                              <div className="flex-row">
                                <label>Kezdőszög (pozíció)</label>
                                <span className="val-preview">{layer.startAngle}°</span>
                              </div>
                              <input 
                                type="range" min="-180" max="180" step="5" 
                                value={layer.startAngle}
                                onChange={e => updateTextLayer(layer.id, { startAngle: parseInt(e.target.value) })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Szöveg haladási iránya</label>
                              <div className="toggle-group select-smaller">
                                <button 
                                  className={layer.direction === 'clockwise' ? 'active' : ''}
                                  onClick={() => updateTextLayer(layer.id, { direction: 'clockwise' })}
                                >
                                  Óramutatóval egyező (Fent)
                                </button>
                                <button 
                                  className={layer.direction === 'counterclockwise' ? 'active' : ''}
                                  onClick={() => updateTextLayer(layer.id, { direction: 'counterclockwise' })}
                                >
                                  Óramutatóval ellentétes (Lent)
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="form-group">
                              <div className="flex-row">
                                <label>Vízszintes pozíció (X)</label>
                                <span className="val-preview">{layer.x}%</span>
                              </div>
                              <input 
                                type="range" min="-100" max="100" step="2" 
                                value={layer.x}
                                onChange={e => updateTextLayer(layer.id, { x: parseInt(e.target.value) })}
                              />
                            </div>

                            <div className="form-group">
                              <div className="flex-row">
                                <label>Függőleges pozíció (Y)</label>
                                <span className="val-preview">{layer.y}%</span>
                              </div>
                              <input 
                                type="range" min="-100" max="100" step="2" 
                                value={layer.y}
                                onChange={e => updateTextLayer(layer.id, { y: parseInt(e.target.value) })}
                              />
                            </div>

                            <div className="form-group">
                              <div className="flex-row">
                                <label>Forgatás</label>
                                <span className="val-preview">{layer.rotation}°</span>
                              </div>
                              <input 
                                type="range" min="-180" max="180" step="1" 
                                value={layer.rotation}
                                onChange={e => updateTextLayer(layer.id, { rotation: parseInt(e.target.value) })}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* IMAGE LAYERS TAB */}
        {activeTab === 'images' && (
          <div className="tab-pane animate-fade-in">
            <div className="flex-row header-with-btn">
              <h3>Kép & Logó rétegek</h3>
              <label className="btn-primary btn-sm cursor-pointer">
                <Plus size={14} /> Kép feltöltése
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>

            {settings.imageLayers.length === 0 ? (
              <div className="empty-state">
                <p>Nincsenek feltöltött képek. Tölts fel egy logót vagy ábrát (legjobb a fehér vagy átlátszó háttér)!</p>
              </div>
            ) : (
              <div className="layers-list">
                {settings.imageLayers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <div 
                      className="layer-item-header"
                      onClick={() => toggleLayerExpand(layer.id)}
                    >
                      <div className="layer-info-summary">
                        <span className="layer-icon"><ImageIcon size={16} /></span>
                        <div className="layer-text-preview">
                          <strong className="truncate">{layer.name}</strong>
                          <span>Méretezés: {Math.round(layer.scale * 100)}% | {layer.colorize ? 'Átszínezett' : 'Eredeti'}</span>
                        </div>
                      </div>
                      <div className="layer-actions">
                        <button 
                          className="btn-icon-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImageLayer(layer.id);
                          }}
                          title="Törlés"
                        >
                          <Trash2 size={14} />
                        </button>
                        {expandedLayerId === layer.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {expandedLayerId === layer.id && (
                      <div className="layer-item-body animate-slide-down">
                        <div className="image-layer-preview-container">
                          <img src={layer.src} alt={layer.name} className="image-layer-thumbnail" />
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Színkezelés</label>
                            <input 
                              type="checkbox" 
                              id={`colorize-${layer.id}`} 
                              checked={layer.colorize}
                              onChange={e => updateImageLayer(layer.id, { colorize: e.target.checked })}
                            />
                          </div>
                          <label htmlFor={`colorize-${layer.id}`} className="subtitle cursor-pointer block-mt">
                            Kép befestése a bélyegző tintájának színére (ajánlott egyszínű ikonoknál)
                          </label>
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Fehér háttér eltávolítása</label>
                            <input 
                              type="checkbox" 
                              id={`remove-white-${layer.id}`} 
                              checked={layer.removeWhite}
                              onChange={e => updateImageLayer(layer.id, { removeWhite: e.target.checked })}
                            />
                          </div>
                          <label htmlFor={`remove-white-${layer.id}`} className="subtitle cursor-pointer block-mt">
                            Eltávolítja a kép fehér/világos hátterét (ajánlott JPG/nem transzparens képeknél)
                          </label>
                        </div>

                        {layer.removeWhite && (
                          <div className="form-group">
                            <div className="flex-row">
                              <label>Fehér küszöbérték</label>
                              <span className="val-preview">{layer.whiteThreshold}</span>
                            </div>
                            <input 
                              type="range" min="150" max="255" step="5" 
                              value={layer.whiteThreshold}
                              onChange={e => updateImageLayer(layer.id, { whiteThreshold: parseInt(e.target.value) })}
                            />
                            <span className="subtitle">Minél kisebb, annál több sötétebb/szürkébb árnyalatot is fehérnek tekint és töröl.</span>
                          </div>
                        )}


                        <div className="form-group">
                          <div className="flex-row">
                            <label>Méret (skála)</label>
                            <span className="val-preview">{Math.round(layer.scale * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0.05" max="1.5" step="0.01" 
                            value={layer.scale}
                            onChange={e => updateImageLayer(layer.id, { scale: parseFloat(e.target.value) })}
                          />
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Forgatás</label>
                            <span className="val-preview">{layer.rotation}°</span>
                          </div>
                          <input 
                            type="range" min="-180" max="180" step="5" 
                            value={layer.rotation}
                            onChange={e => updateImageLayer(layer.id, { rotation: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Vízszintes eltolás (X)</label>
                            <span className="val-preview">{layer.x}%</span>
                          </div>
                          <input 
                            type="range" min="-100" max="100" step="1" 
                            value={layer.x}
                            onChange={e => updateImageLayer(layer.id, { x: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Függőleges eltolás (Y)</label>
                            <span className="val-preview">{layer.y}%</span>
                          </div>
                          <input 
                            type="range" min="-100" max="100" step="1" 
                            value={layer.y}
                            onChange={e => updateImageLayer(layer.id, { y: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="form-group">
                          <div className="flex-row">
                            <label>Átlátszóság</label>
                            <span className="val-preview">{layer.opacity}%</span>
                          </div>
                          <input 
                            type="range" min="10" max="100" step="5" 
                            value={layer.opacity}
                            onChange={e => updateImageLayer(layer.id, { opacity: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INK & EFFECTS TAB */}
        {activeTab === 'effects' && (
          <div className="tab-pane animate-fade-in">
            <h3>Tinta & Valósághű effektek</h3>

            {/* Ink Color */}
            <div className="form-group">
              <label>Tinta színe</label>
              <div className="color-presets">
                {INK_COLORS.map(c => (
                  <button
                    key={c.value}
                    className={`color-preset-btn ${settings.inkColor === c.value ? 'active' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => updateSettings(s => ({ ...s, inkColor: c.value }))}
                    title={c.label}
                  />
                ))}
                <div className="custom-color-picker">
                  <input 
                    type="color" 
                    value={settings.inkColor}
                    onChange={e => updateSettings(s => ({ ...s, inkColor: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Vintage / Grunge Strength */}
            <div className="form-group">
              <div className="flex-row">
                <label>Kopottság / Bélyegző kopás</label>
                <span className="val-preview">{settings.grungeStrength}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="2" 
                value={settings.grungeStrength}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  updateSettings(s => ({ ...s, grungeStrength: val }));
                }}
              />
              <span className="subtitle">Szabályozza a véletlenszerű tintakopást, karcolásokat és apró lyukakat.</span>
            </div>

            {/* Ink Bleed */}
            <div className="form-group">
              <div className="flex-row">
                <label>Tinta elmosódása (Bleed)</label>
                <span className="val-preview">{settings.inkBleed}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="1" 
                value={settings.inkBleed}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  updateSettings(s => ({ ...s, inkBleed: val }));
                }}
              />
              <span className="subtitle">Finom elmosódás, amely a papír által beszívott nedves tintát szimulálja.</span>
            </div>

            <hr />

            {/* Preview Background */}
            <div className="form-group">
              <label>Szerkesztő háttere</label>
              <div className="toggle-group select-smaller">
                <button 
                  className={settings.backgroundColor === 'transparent' ? 'active' : ''} 
                  onClick={() => updateSettings(s => ({ ...s, backgroundColor: 'transparent' }))}
                >
                  Átlátszó (PNG)
                </button>
                <button 
                  className={settings.backgroundColor === 'white' ? 'active' : ''} 
                  onClick={() => updateSettings(s => ({ ...s, backgroundColor: 'white' }))}
                >
                  Fehér papír
                </button>
                <button 
                  className={settings.backgroundColor === 'paper' ? 'active' : ''} 
                  onClick={() => updateSettings(s => ({ ...s, backgroundColor: 'paper' }))}
                >
                  Vintage papír
                </button>
              </div>
              <span className="subtitle">Megjegyzés: A PNG letöltés átlátszó hátteret eredményez, ha az 'Átlátszó' van kiválasztva.</span>
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {activeTab === 'export' && (
          <div className="tab-pane animate-fade-in">
            <h3>Letöltés és felbontás</h3>
            
            <div className="form-group">
              <label>Képfelbontás (Export méret)</label>
              <div className="export-presets">
                <button 
                  className={`preset-btn ${exportScale === 0.5 ? 'active' : ''}`}
                  onClick={() => setExportScale(0.5)}
                >
                  <strong>Kicsi (500px)</strong>
                  <span>Gyors megosztáshoz</span>
                </button>
                <button 
                  className={`preset-btn ${exportScale === 1 ? 'active' : ''}`}
                  onClick={() => setExportScale(1)}
                >
                  <strong>Közepes (1000px)</strong>
                  <span>Dokumentumokhoz</span>
                </button>
                <button 
                  className={`preset-btn ${exportScale === 2 ? 'active' : ''}`}
                  onClick={() => setExportScale(2)}
                >
                  <strong>Nagy (2000px)</strong>
                  <span>Nyomtatási minőség</span>
                </button>
              </div>
            </div>

            <div className="export-actions">
              <button 
                className="btn-primary btn-lg font-bold"
                onClick={() => onDownload('png', exportScale)}
              >
                <Download size={18} /> PNG letöltése (Átlátszó)
              </button>
              
              <button 
                className="btn-secondary btn-lg font-bold"
                onClick={() => onDownload('jpeg', exportScale)}
              >
                <Download size={18} /> JPG letöltése (Fehér háttér)
              </button>
            </div>
            
            <div className="export-note">
              <p>💡 <strong>Tipp:</strong> A <strong>PNG</strong> formátum megőrzi az átlátszóságot (a pecséten kívüli részek üresek lesznek), ami ideális digitális aláírásokhoz és PDF dokumentumokhoz!</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
