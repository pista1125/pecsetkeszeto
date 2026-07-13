import { useState, useCallback } from 'react';
import type { StampSettings, TextLayer, ImageLayer } from '../types';
import { DEFAULT_STAMP_SETTINGS, STAMP_TEMPLATES } from '../constants';


export const useStampState = () => {
  const [history, setHistory] = useState<StampSettings[]>([DEFAULT_STAMP_SETTINGS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentSettings = history[historyIndex];

  // Helper to push a new state to history
  const pushState = useCallback((newSettings: StampSettings) => {
    setHistory((prevHistory) => {
      // Cut off any redo history if we made a new action
      const cleanHistory = prevHistory.slice(0, historyIndex + 1);
      return [...cleanHistory, newSettings];
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  }, [historyIndex]);

  // General updater
  const updateSettings = useCallback((updater: (settings: StampSettings) => StampSettings) => {
    const nextSettings = updater(currentSettings);
    pushState(nextSettings);
  }, [currentSettings, pushState]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex, history.length]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Load a preset template
  const loadTemplate = useCallback((templateId: string) => {
    const template = STAMP_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      // Create a deep copy of template settings
      const copiedSettings: StampSettings = JSON.parse(JSON.stringify(template.settings));
      
      // Ensure IDs are fresh to avoid collision issues
      copiedSettings.textLayers = copiedSettings.textLayers.map((layer, index) => ({
        ...layer,
        id: `text-${Date.now()}-${index}`
      }));
      copiedSettings.imageLayers = copiedSettings.imageLayers.map((layer, index) => ({
        ...layer,
        id: `image-${Date.now()}-${index}`
      }));

      pushState(copiedSettings);
    }
  }, [pushState]);

  // Text layers operations
  const addTextLayer = useCallback((type: 'curved' | 'straight') => {
    updateSettings((prev) => {
      const newLayer: TextLayer = {
        id: `text-${Date.now()}`,
        type,
        text: type === 'curved' ? 'ÚJ KÖRVONALAS SZÖVEG' : 'Új szövegsor',
        fontFamily: 'Montserrat',
        fontSize: type === 'curved' ? 40 : 48,
        bold: true,
        italic: false,
        letterSpacing: type === 'curved' ? 2.0 : 1.0,
        radius: 300,
        startAngle: -90,
        direction: 'clockwise',
        x: 0,
        y: 0,
        rotation: 0,
        flipX: false,
        flipY: false,
      };
      return {
        ...prev,
        textLayers: [...prev.textLayers, newLayer],
      };
    });
  }, [updateSettings]);

  const updateTextLayer = useCallback((id: string, updates: Partial<TextLayer>) => {
    updateSettings((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    }));
  }, [updateSettings]);

  const deleteTextLayer = useCallback((id: string) => {
    updateSettings((prev) => ({
      ...prev,
      textLayers: prev.textLayers.filter((layer) => layer.id !== id),
    }));
  }, [updateSettings]);

  const reorderTextLayers = useCallback((draggedIndex: number, hoverIndex: number) => {
    updateSettings((prev) => {
      const newLayers = [...prev.textLayers];
      const [removed] = newLayers.splice(draggedIndex, 1);
      newLayers.splice(hoverIndex, 0, removed);
      return {
        ...prev,
        textLayers: newLayers,
      };
    });
  }, [updateSettings]);

  // Image layers operations
  const addImageLayer = useCallback((src: string, name: string) => {
    updateSettings((prev) => {
      const newLayer: ImageLayer = {
        id: `image-${Date.now()}`,
        src,
        name,
        x: 0,
        y: 0,
        scale: 0.35,
        rotation: 0,
        opacity: 100,
        colorize: true,
        removeWhite: true,
        whiteThreshold: 240,
      };

      return {
        ...prev,
        imageLayers: [...prev.imageLayers, newLayer],
      };
    });
  }, [updateSettings]);

  const updateImageLayer = useCallback((id: string, updates: Partial<ImageLayer>) => {
    updateSettings((prev) => ({
      ...prev,
      imageLayers: prev.imageLayers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    }));
  }, [updateSettings]);

  const deleteImageLayer = useCallback((id: string) => {
    updateSettings((prev) => ({
      ...prev,
      imageLayers: prev.imageLayers.filter((layer) => layer.id !== id),
    }));
  }, [updateSettings]);

  const reorderImageLayers = useCallback((draggedIndex: number, hoverIndex: number) => {
    updateSettings((prev) => {
      const newLayers = [...prev.imageLayers];
      const [removed] = newLayers.splice(draggedIndex, 1);
      newLayers.splice(hoverIndex, 0, removed);
      return {
        ...prev,
        imageLayers: newLayers,
      };
    });
  }, [updateSettings]);

  const resetSettings = useCallback(() => {
    pushState(DEFAULT_STAMP_SETTINGS);
  }, [pushState]);

  return {
    settings: currentSettings,
    updateSettings,
    undo,
    redo,
    canUndo,
    canRedo,
    loadTemplate,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    reorderTextLayers,
    addImageLayer,
    updateImageLayer,
    deleteImageLayer,
    reorderImageLayers,
    resetSettings,
  };
};
